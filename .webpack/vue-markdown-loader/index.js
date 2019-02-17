'use strict'

const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const cheerio = require('cheerio')
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js')
const frontmatter = require('front-matter')

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

module.exports = function (source, map, meta) {
  this.cacheable(true)

  let {
    render,
    wrapper = 'div',
    markdown: {
      plugins,
      options: markdownitOptions,
    },
  } = loaderUtils.getOptions(this) || {};

  // validateOptions(schema, options, 'Example Loader');

  if (render == null) {
    const md = new MarkdownIt({
      html: true,
      ...markdownitOptions,
    })

    if (plugins) {
      plugins.forEach((plugin) =>
        Array.isArray(plugin)
          ? md.use(...plugin)
          : md.use(plugin)
      )
    }

    render = (content) => md.render(content)
  }

  const { body } = frontmatter(source.replace(/^[\s]+---/, '---'))
  const markdown =
    render(body)
      // HACK: Required because vue even considers html entities as interpolation.
      //       Use v-text or t-html instead
      // .replace(/\}\}/g, `{{ '}}' }}`)
      .replace(/\{\{/g, `{{ '{{' }}`)

  const $ = cheerio.load(markdown)

  const $scripts = $('script')
  const $styles = $('style')

  if ($scripts.length > 1) {
    return this.emitError(new Error('A markdown SFC should have only one script block'))
  }

  $scripts.remove()
  $styles.remove()

  const styles = $styles.toArray().map((el) => $.html(el)).join('')

  const output = `
${$.html($scripts) || '<script>export default {};</script>'}
${styles}
<template><${wrapper}>${$('body').html()}</${wrapper}></template>
`

  return output
}

'use strict'

const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const cheerio = require('cheerio')
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js')
const frontmatter = require('front-matter')

const md = new MarkdownIt({
  html: true,
  linkify: false,
  highlight(content, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="md-codeBlock hljs" data-lang="${lang}"><code class="hljs-inner md-codeBlockInner">${
            hljs.highlight(lang, content, true).value
          }</code></pre>`
        );
      } catch (err) {
        throw err;
      }
    }

    return `<pre class="md-codeBlock" data-lang="${lang}"><code class="md-codeBlockInner">${md.utils.escapeHtml(content)}</code></pre>`;
  },
})
  .use(require('markdown-it-named-headings'));

const isTopLevel = (index, el) => {
  return el.parentNode && el.parentNode.tagName === 'body'
}

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

module.exports = function (source, map, meta) {
  // console.time('mark')
  this.cacheable(true)

  const options = loaderUtils.getOptions(this) || {};
  // validateOptions(schema, options, 'Example Loader');

  const {
    render = md.render.bind(md),
    wrapper = 'div',
  } = options

  const { body } = frontmatter(source.replace(/^[\s]+---/, '---'))
  const markdown = render(body)
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

// console.timeEnd('mark')

  return output
}

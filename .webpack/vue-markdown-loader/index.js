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
  .use(require('markdown-it-named-headings'))
  .use(require('markdown-it-anchor'), {
    permalinkSymbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 341.1l-1.2.1c-3.6.4-7 2-9.6 4.5l-64.6 64.6c-13.7 13.7-32 21.2-51.5 21.2s-37.8-7.5-51.5-21.2c-13.7-13.7-21.2-32-21.2-51.5s7.5-37.8 21.2-51.5l68.6-68.6c3.5-3.5 7.3-6.6 11.4-9.3 4.6-3 9.6-5.6 14.8-7.5 4.8-1.8 9.9-3 15-3.7 3.4-.5 6.9-.7 10.2-.7 1.4 0 2.8.1 4.6.2 17.7 1.1 34.4 8.6 46.8 21 7.7 7.7 13.6 17.1 17.1 27.3 2.8 8 11.2 12.5 19.3 10.1.1 0 .2-.1.3-.1.1 0 .2 0 .2-.1 8.1-2.5 12.8-11 10.5-19.1-4.4-15.6-12.2-28.7-24.6-41-15.6-15.6-35.9-25.8-57.6-29.3-1.9-.3-3.8-.6-5.7-.8-3.7-.4-7.4-.6-11.1-.6-2.6 0-5.2.1-7.7.3-5.4.4-10.8 1.2-16.2 2.5-1.1.2-2.1.5-3.2.8-6.7 1.8-13.3 4.2-19.5 7.3-10.3 5.1-19.6 11.7-27.7 19.9l-68.6 68.6C58.9 304.4 48 330.8 48 359c0 28.2 10.9 54.6 30.7 74.4C98.5 453.1 124.9 464 153 464c28.2 0 54.6-10.9 74.4-30.7l65.3-65.3c10.4-10.5 2-28.3-12.7-26.9z"/><path d="M433.3 78.7C413.5 58.9 387.1 48 359 48s-54.6 10.9-74.4 30.7l-63.7 63.7c-9.7 9.7-3.6 26.3 10.1 27.4 4.7.4 9.3-1.3 12.7-4.6l63.8-63.6c13.7-13.7 32-21.2 51.5-21.2s37.8 7.5 51.5 21.2c13.7 13.7 21.2 32 21.2 51.5s-7.5 37.8-21.2 51.5l-68.6 68.6c-3.5 3.5-7.3 6.6-11.4 9.3-4.6 3-9.6 5.6-14.8 7.5-4.8 1.8-9.9 3-15 3.7-3.4.5-6.9.7-10.2.7-1.4 0-2.9-.1-4.6-.2-17.7-1.1-34.4-8.6-46.8-21-7.3-7.3-12.8-16-16.4-25.5-2.9-7.7-11.1-11.9-19.1-9.8-8.9 2.3-14.1 11.7-11.3 20.5 4.5 14 12.1 25.9 23.7 37.5l.2.2c16.9 16.9 39.4 27.6 63.3 30.1 3.7.4 7.4.6 11.1.6 2.6 0 5.2-.1 7.8-.3 6.5-.5 13-1.6 19.3-3.2 6.7-1.8 13.3-4.2 19.5-7.3 10.3-5.1 19.6-11.7 27.7-19.9l68.6-68.6c19.8-19.8 30.7-46.2 30.7-74.4s-11.1-54.6-30.9-74.4z"/></svg>`,
    permalinkClass: 'md-headingAnchor',
    permalinkBefore: true,
    permalink: true,
  })

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

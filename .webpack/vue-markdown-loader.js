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
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, content, true).value
        }</code></pre>`;
      } catch (err) {
        throw err;
      }
    }

    return md.utils.escapeHtml(content);
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
  this.cacheable(true)

  const options = loaderUtils.getOptions(this) || {};
  // validateOptions(schema, options, 'Example Loader');

  const {
    render = md.render.bind(md),
    wrapper = 'div',
    attributesVariable = 'page',
  } = options

  const $ = cheerio.load(source.toString('utf8'))
  const $scripts = $('body').find('script').filter(isTopLevel)
  const $styles = $('body').find('style').filter(isTopLevel)

  if ($scripts.length > 1) {
    return this.emitError(new Error('A markdown SFC should have only one script block'))
  }

  $scripts.remove()
  $styles.remove()

  const input = $('body').html().replace(/^[\s]+---/, '---')

  const { body, attributes } = frontmatter(input)
  const markdown = render(body)
  const styles = $styles.toArray().map((el) => $.html(el)).join('')
  console.log(styles);


  const output = `
<template><${wrapper}>${markdown}</${wrapper}></template>
<script>
${$scripts.first().html() || ''}
;const ${attributesVariable} = ${JSON.stringify(attributes)};
</script>
${styles}
`

  // console.log(output);

  return output
}

'use strict'

const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const MarkdownIt = require('markdown-it');
const frontmatter = require('front-matter')

const md = new MarkdownIt()

const schema = {
  type: 'object',
  properties: {
    render: {
      instanceof: 'Function',
    },
    preprocess: {
      instanceof: 'Function',
    },
    preprocess: {
      instanceof: 'Function',
    },
  },
};

module.exports = function (source, map, meta) {
  this.cacheable(true)

  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'markdown-loader');

  let {
    preprocess = () => frontmatter(source.replace(/^[\s]+---/, '---')).body,
    render = (content) => md.render(content),
    markdown: {
      plugins,
      options: markdownitOptions,
    },
  } = options

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
  }

  return render(preprocess())
}

'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const _ = require('lodash')
const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const datefns = require('date-fns')
const slugify = require('slugify')
const MarkdownIt = require('markdown-it');
const frontmatter = require('front-matter')
const hljs = require('highlight.js')

const glob = util.promisify(require('glob'))
const readFile = util.promisify(fs.readFile)

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
    permalink: true,
    permalinkBefore: true,
  })

const defaultTransformAttributes = exports.defaultTransformAttributes = (all, inputs, options) => {
  return inputs.map((input) => {
    const slug = slugify(path.basename(input.replacedPath, path.extname(input.replacedPath)))

    let excerpt = null

    if (typeof input.attributes.excerpt === 'string') {
      // The excerpt is custom defined in the front matter
      excerpt = String(input.attributes.excerpt);
    } else {
      const separator =
        [frontmatter.excerpt_separator, frontmatter.excerptSeparator, '<!-- endexcerpt -->']
          .find(item => item != null);

      const excerptIndex = input.body.indexOf(separator)

      if (excerptIndex > -1) {
        excerpt = input.body.substring(0, excerptIndex);
      }
    }

    return {
      ...input.attributes,
      importBasename: path.basename(input.path, path.extname(input.path)),
      excerpt: excerpt == null ? null : options.markdown(excerpt),
      humanized: {
        created_at: datefns.format(input.attributes.created_at, 'MMMM, d y'),
      },
      url: path.posix.normalize(`${options.baseRoute}/${slug}`),
      slug,
    }
  })
}

const schema = {
  type: 'object',
  required: [
    'glob',
    'filename',
  ],
  properties: {
    glob: {
      type: 'string',
    },
    filename: {
      type: 'string',
    },
    requireFrontMatter: {
      type: 'boolean',
    },
    merge: {
      type: 'boolean',
    },
    indent: {
      type: 'number',
    },
    context: {
      type: 'string',
    },
    transformAttributes: {
      instanceof: 'Function',
    },
    transformAssets: {
      instanceof: 'Function',
    },
    markdown: {
      instanceof: 'Function',
    },
    replacer: {
      instanceof: 'Function',
    },
    sort: {
      instanceof: 'Function',
    },
  },
};

const readFiles = (pattern) => {
  return glob(pattern)
    .then(files => {
      const promises =
        files.map((filename) =>
          readFile(filename, 'utf8')
            .then((contents) => ({
              path: filename,
              contents: contents,
            }))
        )

      return Promise.all(promises)
    })
}

const name = 'FrontMatterPlugin';

const identity = (value) => value

const defaultOptions = {
  merge: true,
  requireFrontMatter: true,
  markdown: (...args) => md.render(...args),
  indent: 0,
  context: process.cwd(),
  replacer: identity,
  transformAssets: identity,
  transformAttributes: defaultTransformAttributes,
}

/**
 * Transforms the frontmatter in the set of retrieved files into a single JSON.
 */
module.exports = class FrontMatterPlugin {
  /**
   * @param {Object} options
   * @param {string} options.glob - a glob pattern
   * @param {string} options.filename - an interpolated filename e.g. '\[name].\[hash].\[ext]'
   * @param {string} options.requireFrontMatter - throws an error if any files lack a front matter header
   * @param {string} options.replacer - allows modifying the output filename before it's interpolated
   * @param {string} options.merge - merge all front matters into a single file
   * @param {string} options.context - overrides webpack context
   * @param {number} [options.indent=0] - The indent of the output JSON
   * @param {string} options.dateField - A lodash path for the field in the front matter containing the date
   * @param {() => { [filename: string]: string | Buffer }} options.transform
   */
  constructor(options) {
    const { dateField = 'created_at' } = options

    const defaultSort = ({ attributes: aAttributes }, { attributes: bAttributes }) => {
      const aDate = _.get(aAttributes, dateField)
      const bDate = _.get(bAttributes, dateField)

      return datefns.compareDesc(aDate, bDate)
    }

    this.options = Object.assign({ dateField, sort: defaultSort }, defaultOptions, options);

    if (typeof options == null || typeof options !== 'object') {
      throw new Error(`options should be an object, got ${options}`);
    }

    validateOptions(schema, this.options, name)
  }

  apply(compiler) {
    const {
      glob: pattern,
      sort = defaultSort,
      merge,
      requireFrontMatter,
      indent,
      filename,
      context,
      replacer,
      transformAssets,
      transformAttributes,
    } = this.options

    const emit = (compilation, callback) => {
      readFiles(pattern)
        .then((files) => {
          const inputs = files.map((file) => {
            const contents = file.contents.replace(/^\s+---/, '---')

            if (requireFrontMatter && !frontmatter.test(contents)) {
              throw new Error('Markdown file has no frontmatter')
            }

            const fm = frontmatter(contents)

            return {
              replacedPath: replacer(file.path),
              ...file,
              ...fm,
            }
          })

          let assets = {}

          if (merge) {
            let headers = inputs.map(input => input.attributes)

            headers =
              typeof sort === 'function'
                ? [...inputs.sort(sort)]
                : headers

            const allAttributes = headers.map(input => input.attributes)

            const json = JSON.stringify(
                transformAttributes(allAttributes, inputs, this.options),
                null,
                indent
              )

            const outputFilename =
              loaderUtils.interpolateName({
                resourcePath: '',
              }, filename, {
                content: json,
                context: context,
              });

            assets = { [outputFilename]: json }
          } else {
            assets = inputs.reduce((all, input) => {
              const resourcePath = replacer(input.path)
              const outputPath =
                loaderUtils.interpolateName({
                  resourcePath,
                }, filename, {
                  content: input.contents,
                  context: context,
                });

              const attributes = transformAttributes(input.attributes, input, inputs, this.options)

              all[outputPath] = JSON.stringify(attributes, null, indent)

              return all
            }, {})
          }

          if (transformAssets) {
            assets = transformAssets(assets, inputs)
          }

          Object.assign(
            compilation.assets,
              Object.entries(assets)
                .map(([filename, contents]) => [filename, { source: () => contents, size: () => contents.length }])
                .reduce((all, [filename, source]) => (all[filename] = source, all), {})
            )

          callback()
        })
    };

    if (compiler.hooks) {
      // Webpack 4
      const plugin = { name };
      compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
      compiler.plugin('emit', emit);
    }
  }
}

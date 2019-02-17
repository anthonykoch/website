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


const defaultTransformAttributes = exports.defaultTransformAttributes = (all, inputs, options) => {
  const { markdown = {}, baseRoute, preprocess } = options

  let render = identity

  if (markdown) {
    const md = new MarkdownIt({
      html: true,
      ...markdown.options,
    })

    if (markdown.plugins) {
      markdown.plugins.forEach((plugin) =>
        Array.isArray(plugin)
          ? md.use(...plugin)
          : md.use(plugin)
      )
    }

    render = (contents) => md.render(contents)
  }

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
      excerpt: excerpt == null ? null : render(preprocess(excerpt)),
      humanized: {
        created_at: datefns.format(input.attributes.created_at, 'MMMM, d y'),
      },
      url: path.posix.normalize(`${baseRoute}/${slug}`),
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
    preprocess: {
      instanceof: 'Function',
    },
    transformAssets: {
      instanceof: 'Function',
    },
    markdown: {
      type: 'object',
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

    const defaultOptions = {
      merge: true,
      requireFrontMatter: true,
      indent: 0,
      preprocess: identity,
      context: process.cwd(),
      replacer: identity,
      transformAssets: identity,
      transformAttributes: defaultTransformAttributes,
    }

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

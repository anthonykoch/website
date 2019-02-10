'use strict'

const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')
const validateOptions = require('schema-utils')
const fs = require('fs')
const util = require('util')
const dateFns = require('date-fns')

const glob = util.promisify(require('glob'))
const readFile = util.promisify(fs.readFile)

const schema = {
  type: 'object',
  required: [
    'glob',
    'filename',
  ],
  // additionalProperties: false,
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
    transform: {
      instanceof: 'Function',
    },
    replacer: {
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
   * @param {Object} options.attributes
   * @param {Object} options.attributes.date - The name of the attribute in the front matter that contains the date
   * @param {() => { [filename: string]: string | Buffer }} options.transform
   */
  constructor(options) {
    this.options = options;

    if (typeof options == null || typeof options !== 'object') {
      throw new Error(`options should be an object, got ${options}`);
    }
  }

  apply(compiler) {
    const { attributes = { date: 'created_at' } } = this.options

    const defaultSort = ({ attributes: aAttributes }, { attributes: bAttributes }) => {
      const aDate = aAttributes[attributes.date]
      const bDate = bAttributes[attributes.date]

      return dateFns.compareDesc(aDate, bDate)
    }

    const {
      glob: pattern,
      merge = true,
      requireFrontMatter = true,
      sort = defaultSort,
      indent = 0,
      filename,
      replacer = (str) => str,
      context = process.cwd(),
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

            const json = JSON.stringify(headers.map(input => input.attributes), null, indent)

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

              all[outputPath] = JSON.stringify(input.attributes, null, indent)

              return all
            }, {})
          }

          if (this.options.transform) {
            assets = this.options.transform(assets, files)
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

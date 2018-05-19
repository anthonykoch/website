'use strict';

const requireModule = require('esm')(module);

const path = require('path');
const glob = require('glob');
const { inspect } = require('util');

const _ = require('lodash');
const MarkdownIt = require('markdown-it');
const frontmatter = require('front-matter');
const loaderUtils = require('loader-utils');

const md = new MarkdownIt({
  // TODO
});

const TransformFilePlugin = requireModule('./.webpack/transform-file-plugin').default;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DIR_POSTS = '_posts';
const JSON_INDENT = 0;

const interpolatePath = ({ resourcePath, output, contents, context }) => {
  const loaderContext = {
    resourcePath,
  };

  const options = {
    content: contents.toString('utf8'),
    context,
  };

  const filename = loaderUtils.interpolateName(loaderContext, output, options);

  return filename;
};

/**
 * Converts an array of mapping of interpolation filenames (e.g. '[name]-[hash:8].png')
 * to file contents.
 *
 * @return {Object<string>}
 */
const convertToAssets =
  (assets, options) =>
    Object.entries(assets)
      .reduce((newFiles, [originalFilename, contents]) => {
      const filename = interpolatePath({
        resourcePath: originalFilename,
        contents: contents,
        output: options.output,
        context: options.context,
      });

      newFiles[filename] = contents;

      return newFiles;
    }, {});

/**
 * Parses front matter and adds it to the meta
 */
const getFrontMatter =
  () =>
    (file) => {
      const data = frontmatter(file.contents);

      if (!frontmatter.test(file.contents)) {
        throw new Error(`Could not find frontmatter in "${filename}"`);
      }

      return _.merge({}, file, {
        frontmatter: data.attributes,
        contents: data.body,
      });
    };

/**
 * Adds the excerpt of a post to the file meta
 *
 * Is a "plugin" to be utilized by the parseMarkdown function.
 */
const getPostExcerpt =
  ({ renderExcerpt=true, defaultSeparator='<!-- endexcerpt -->', md }={}) =>
    (file) => {
    let excerpt = null;
    let excerptIndex = null;
    let excerptLoc = null;

    if (!_.isObject(file.frontmatter)) {
      throw new Error(`frontmatter does not exist on file ${file.path}`);
    }

    if (file.frontmatter.excerpt) {
      // Use a custom defined excerpt from the frontmatter
      excerpt = String(file.frontmatter.excerpt);
    } else {
      const separator =
        [frontmatter.excerpt_separator, frontmatter.excerptSeparator, defaultSeparator]
          .find(item => item != null);

      if (separator != null) {
        excerptIndex = file.contents.indexOf(separator);

        if (excerptIndex > -1) {
          excerpt = file.contents.substring(0, excerptIndex);
          excerptLoc = {
            start: 0,
            end: excerptIndex,
          };
        }
      }
    }

    return _.merge({}, file, {
      meta: {
        excerpt: {
          content: renderExcerpt && excerpt != null ? md.render(excerpt) : excerpt,
          loc: excerptLoc,
        },
      },
    });
  };

const stripFileDate = (pathname) => pathname.replace(/\d{4}-\d{2}-\d{2}-/, '');

const validateBaseFile = (value) => {
  let message = null;

  if (!_.isObject(value)) {
    message = `transform did not return an object, got ${inspect(value)}`;
  } else if (!_.isString(value.contents) && !Buffer.isBuffer(value.contents)) {
    message = `transform returned object without contents as string or buffer, got ${inspect(value.contents)}`;
  } else if (!_.isObject(value.meta)) {
    message = `transform did not return an object with meta , got ${inspect(value.meta)}`;
  } else if (!_.isString(value.path)) {
    message = `transform did not return an object with a path, got ${inspect(value.path)}`;
  }

  return { message };
};

/**
 * Runs transforms (really just a series of functions) on an initial value.
 *
 * @throws {Error} If the transform function doesn't return an object
 *
 * @return Promise<Object>
 */
const runTransforms =
  async (initial, transforms, options={ name: 'TransformRunner' }) => {
    let data = await initial;

    for (const transform of transforms) {
      const arg = await data;
      const value = await transform(arg);
      const { message } = validateBaseFile(value);

      if (message != null) {
        throw new Error(`${options.name}: ${message}`);
      }

      data = value;
    }

    return data;
  };

/**
 * Calls a series of functions
 *
 * @throws {Error} If the yaml frontmatter does not exist
 *
 * type files = { [string]: Buffer };
 * type transforms = function[];
 *
 * type return = {
 *   path: string,
 *   contents: string,
 *   meta: {},
 *   attributes: {},
 * };
 */
const transformer = async (files, { transforms=[] }={}) => {
  const newFiles = Object.entries(files)
    .map(async ([filename, buffer]) => {
      const contents = buffer.toString('utf8');

      let file = {
        // originalPath and source should not be modified
        originalPath: filename,
        source: contents,

        // Any one of these properties below may be modified by a transformer
        path: filename,
        meta: {},
        contents,
      };

      const defaultOpts = {
        name: 'Transformer',
      };

      file = await runTransforms(file, transforms, defaultOpts);

      return file;
    });

  return Promise.all(newFiles);
};

const when = (bool, a, b) => bool ? a : b;

const baseUrl = 'http://localhost:3000';

module.exports = {
  env: {
    // baseUrl,
  },

  css: [
    '@/assets/styles/main.sass',
  ],

  /*
   * Headers of the page
   */
  head: {
    title: 'website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'robots', content: 'index,follow' },
    ],
    link: [
      {
        href: 'https://fonts.googleapis.com/css?family=Lato:400,300,700, 800,900|Source+Sans+Pro:200,200italic,300,300italic,400,400italic,600,700|Source+Code+Pro:400,600,700',
       rel: 'stylesheet',
       type: 'text/css',
     },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
   * Customize the progress bar color
   */
  loading: { color: '#3B8070' },

  router: {
    linkActiveClass: '',
    linkExactActiveClass: '',
    // FIXME: Scroll position should be restored on refresh
  },

  /*
   * Build configuration
   */
  build: {
    extractCSS: {
      allChunks: true
    },

    extend (config, { isClient }) {
      config.module.rules = [
        ...config.module.rules,
        {
          // This loader compiles the markdown files in `@/_post` and the TransformFilePlugin
          // converts them into json. This allows the posts to be imported async when needed
          // rather than sending them down with the entire app.
          //
          // In order to kick this loader off on the markdown, you need to `require('@/_posts/hello.md')`
          // or require.context('@/_posts', false, /\.$.md/) to require all the posts in a directory.
          test: /\.md$/,
          include: [path.resolve(DIR_POSTS)],
          use: [
            {
              // This loader will emit the the markdown file so that we can use the TransformFilePlugin
              // to transform it into JSON before the markdown is emitted.
              loader: 'file-loader?name=[path][name].html',
            },
          ],
        },
      ];

      if (isClient) {
        config.plugins = [
          ...config.plugins,
          //   reportFilename: path.join(__dirname, IS_PRODUCTION ? '.reports/prod.html' : '.reports/dev.html'),

          new TransformFilePlugin({
            include: /_posts\/.*?\.html$/,
            deleteOriginalAssets: true,
            async transform(files) {
              const postsFiles = await transformer(files, {
                transforms: [
                  getFrontMatter(),
                  getPostExcerpt({ md }),
                  (file) => _.merge({}, file, {
                    contents: md.render(file.contents),
                  }),
                  (file) => _.merge({}, file, {
                    path: stripFileDate(file.path),
                  }),
                ],
              });

              const posts =
                postsFiles.reduce((assets, file) => {
                  assets[file.path] =
                    JSON.stringify(
                      _.pick(file, [
                        'frontmatter',
                        'contents',
                        'meta',
                      ]),
                      null, JSON_INDENT);

                  return assets;
                }, {});

              const all = {
                ...convertToAssets(posts, {
                  // context: config.context,
                  output: 'api/posts/[name].json',
                }),
                'api/postmeta.json':
                  JSON.stringify(
                    postsFiles.map(file => {
                      return _.merge(
                        _.pick(file, [
                          'frontmatter',
                          'meta.excerpt',
                        ]), {
                          meta: {
                            // TODO: export to function
                            slug:
                              stripFileDate(path.basename(file.path, path.extname(file.path)))
                                .replace(/\..+$/, ''),
                          },
                        });
                    }), null, JSON_INDENT),

              };

              // console.log(Object.keys(all))

              return all;
            },
          }),
        ];
      }
    },
  },

  generate: {
    routes: [
      ...glob.sync(path.join(__dirname, `${DIR_POSTS}/*.md`))
        .map((filename) => {
          const relativeFilename =
            path.relative(path.join(__dirname, DIR_POSTS), filename)

          const basename = path.basename(relativeFilename, path.extname(relativeFilename))

          return `/blog/${stripFileDate(basename)}`;
        }),
    ],
  },

  plugins: [
    '~plugins/context',
    // Might need highlighter later
    // '~plugins/vue-highlightjs'
  ],

  modules: [
    // ['@nuxtjs/google-analytics', { ua: 'UA-104010-6' }],
  ],
};

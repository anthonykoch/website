'use strict';

const requireModule = require('esm')(module);

const path = require('path');
const glob = require('glob');
const { inspect } = require('util');

const _ = require('lodash');
const datefns = require('date-fns');
const MarkdownIt = require('markdown-it');
const frontmatter = require('front-matter');
const hljs = require('highlight.js');

const md = new MarkdownIt({
  html: true,
  linkify: false,
  highlight(content, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, content, true).value
      } catch (err) {
        // console.log(lang,  content)
        throw err;
      }
    }

    // console.log(lang, content);

    return md.utils.escapeHtml(content);
  },
});

const TransformFilePlugin = requireModule('./.webpack/transform-file-plugin').default;

const {
  stripFileDate,
  getPathSlug,
  interpolatePath,
  convertToAssets,
  validateBaseFile,
  runTransforms,
  transformer,
  when,
} = requireModule('./.webpack/utils');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DIR_POSTS = '_posts';
const JSON_INDENT = 2;
const ROUTE_BLOG = '/blog';

/**
 * Adds the parsed front matter to the file object
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
      contents: file.contents,
      meta: {
        excerpt: {
          content: renderExcerpt && excerpt != null ? md.render(excerpt) : excerpt,
          loc: excerptLoc,
        },
      },
    });
  };

  /**
   * Convers a list of files to JSON and returns an asset mapping.
   *
   * @param  {Array<File>} files
   * @param  {Number} options.indent - The indent for the json
   * @param  {Number} options.output - Interpolation name e.g. '[name]-[hash:8].json'
   * @return {Object.<string>}
   */
const createPostsJsonAssets = (files, options={}) => {
  const posts = files.reduce((assets, file) => {
    const slug = getPathSlug(file.path);

    assets[file.path] =
      JSON.stringify({
          excerpt: file.meta.excerpt,
          ...file.frontmatter,
          humanized: file.humanized,
          url: path.posix.normalize(`${ROUTE_BLOG}/${slug}`),
          slug,
          contents: file.contents,
        },
        null,
        options.indent || 0
      );

      return assets;
    }, {});

  return convertToAssets(posts, {
    output: options.output,
  });
};

/**
 * Converts a list of files to a list of meta of each file and returns
 * an asset mapping containg the meta file.
 *
 * @type {Object.<Array<Object>>}
 */
const createPostsMetaAssets =
  (files, { output='postmeta.json', indent=0 }={}) => {
    const meta = files.map(file => {
      return {
        excerpt: file.meta.excerpt,
        ...file.frontmatter,
        humanized: file.humanized,
        url: path.posix.normalize(`${ROUTE_BLOG}/${getPathSlug(file.path)}`),
        slug: getPathSlug(file.path),
      };
    }).sort((a, b) => datefns.compareDesc(a.created_at, b.created_at));

    return convertToAssets({
      'postsmeta.json': JSON.stringify(meta, null, indent),
    }, {
      output: output,
    });
  };

let appenv = {
  apiPath: '/_nuxt/api',
  baseUrl: 'http://localhost:3000',
};

if (IS_PRODUCTION) {
  appenv = {
    apiPath: '/_nuxt/api',
    baseUrl: 'http://localhost:3000',
  };
}

module.exports = {

  router: {
    linkActiveClass: '',
    linkExactActiveClass: '',
  },

  env: {
    app: {
      ...appenv,
      IS_PRODUCTION,
    },
  },

  // mode: 'spa',

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

      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.typekit.net/nsr0hmh.css' },
    ]
  },
  /*
   * Customize the progress bar color
   */
  loading: false,
  // loading: { color: '#3B8070' },

  /*
   * Build configuration
   */
  build: {
    extractCSS: {
      allChunks: true,
    },

    postcss: [
      // require('cssnano')({
      //   preset: 'default',
      // }),
      // require('autoprefixer')(),
    ],

    extend(config, { isClient }) {
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

      const transformFilePlugin =
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
                  (file) => _.merge({}, file, {
                    humanized: {
                      created_at: datefns.format(file.frontmatter.created_at, 'MMMM, d y'),
                    },
                  }),
                ],
              });

              const postAssets = createPostsJsonAssets(postsFiles, {
                output: 'api/posts/[name].json',
                indent: JSON_INDENT,
              });

              // This is so that we can have a preview listing of posts on the /blog page
              const postsMeta = createPostsMetaAssets(postsFiles, {
                output: 'api/postmeta.json',
                indent: JSON_INDENT,
              });

              const all = {
                ...postAssets,
                ...postsMeta,
              };

              return all;
            },
          });

      if (isClient) {
        config.plugins = [
          ...config.plugins,
          //   reportFilename: path.join(__dirname, IS_PRODUCTION ? '.reports/prod.html' : '.reports/dev.html'),

          transformFilePlugin
        ];
      }
    },
  },

  generate: {
    routes: [
      ...glob.sync(path.join(__dirname, `${DIR_POSTS}/*.md`))
        .map((filename) => {
          const relativeFilename =
            path.relative(path.join(__dirname, DIR_POSTS), filename);

          const basename =
            path.basename(relativeFilename, path.extname(relativeFilename));

          return path.posix.normalize(`${ROUTE_BLOG}/${stripFileDate(basename)}`);
        }),
    ],
  },

  plugins: [
    '~plugins/context',
    '~plugins/logger',
    '~/plugins/disqus',

    // Might need highlighter later
    // '~plugins/vue-highlightjs'
  ],

  modules: [
    // ['@nuxtjs/google-analytics', { ua: 'UA-104010-6' }],
  ],
};

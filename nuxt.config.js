'use strict';

const requireModule = require('esm')(module);

const path = require('path');
const glob = require('glob');
const { inspect } = require('util');

const _ = require('lodash');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const datefns = require('date-fns');

const { default: TransformFilePlugin } = requireModule('./.webpack/transform-file-plugin');

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
});


const {
  getFrontMatter,
  getPostExcerpt,
  createPostsJsonAssets,
  createPostsMetaAssets,
} = requireModule('./.webpack/post-helpers.js');

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
const ROUTE_BLOG = '/blog';
const JSON_INDENT = 2;

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
      { hid: 'description', name: 'description', content: 'Freelance front-end web developer producing high quality work with an exceptional eye for detail. Mentor. Lover of JavaScript.' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'robots', content: 'index,follow' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.typekit.net/nsr0hmh.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css' },
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
    '~plugins/bootstrap',
    '~/plugins/disqus',

    // Might need highlighter later
    // '~plugins/vue-highlightjs'
  ],

  modules: [
    // ['@nuxtjs/google-analytics', { ua: 'UA-104010-6' }],
  ],
};

'use strict';

const requireModule = require('esm')(module);

const path = require('path');
const glob = require('glob');
const { inspect } = require('util');

const _ = require('lodash');
const datefns = require('date-fns');

const { default: TransformFilePlugin } = requireModule('./.webpack/transform-file-plugin');
const { getPostsJson } = requireModule('./.webpack/post-helpers.js');
const { stripFileDate } = requireModule('./.webpack/utils');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DIR_POSTS = '_posts';
const ROUTE_BLOG = '/blog';

console.log({IS_PRODUCTION, node_env: process.env.NODE_ENV});

let appenv = {
  apiPath: '/_nuxt/api',
  baseUrl: 'http://localhost:3000',
  disqusShortname: 'anthonykoch',
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

      // TODO: If this is even how this is even done anymore
      // { name: "twitter:card", content: "summary" },
      // { name: "twitter:site", content: "@twitter" },
      // { name: "twitter:title", content: "{{ page.title }}" },
      // { name: "twitter:description", content: "{{ page.description }}" },
      // { name: "twitter:url", content: "{{ page.url }}"},
    ],
    script: [
      { async: true, src: '//assets.codepen.io/assets/embed/ei.js' },
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
    watch: ['_posts'],
    extractCSS: {
      allChunks: true,
    },

    postcss: [
      require('cssnano')({
        preset: 'default',
      }),
      require('autoprefixer')(),
    ],

    extend(config, { isClient }) {
      config.module.rules = [
        ...config.module.rules,
        {
          // This loader is purely so to make the posts files available to the the TransformFilePlugin,
          // which subsequently converts them into json. This allows the posts to be imported async
          // needed rather than sending them down with the entire app.
          //
          // In order to kick this loader off on the markdown, you need to `require('@/_posts/hello.md')`
          // or require.context('@/_posts', false, /\.$.md/) to require all the posts in a directory.
          test: /\.md$/,
          include: [path.resolve(DIR_POSTS)],
          use: [
            {
              // This loader will emit the the markdown file so that we can use the TransformFilePlugin
              // to transform it into JSON before the markdown is emitted.
              loader: 'file-loader?name=[path][name].md',
            },
          ],
        },
      ];

      const transformFilePlugin =
        new TransformFilePlugin({
            include: /_posts\/.*?\.md$/,
            deleteOriginalAssets: true,
            async transform(files) {
              const { posts, postsMeta } = await getPostsJson(files);

              return {
                ...posts,
                ...postsMeta,
              };
            },
          });

      if (isClient) {
        config.plugins = [
          ...config.plugins,
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
    '~/plugins/ga',
    // '~/plugins/disqus',

    // Might need highlighter later
    // '~plugins/vue-highlightjs'
  ],

  modules: [
    // ['@nuxtjs/google-analytics', { ua: 'UA-104010-6' }],
  ],
};

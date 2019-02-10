'use strict';

const requireModule = require('esm')(module);

const path = require('path');
const glob = require('glob');

const FrontMatterPlugin = require('./.webpack/frontmatter-plugin');

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = !isEnvProduction
const DIR_POSTS = '_posts';
const blogRoute = '/blog';

console.log({node_env: process.env.NODE_ENV});

const stripFileDate = (pathname) => pathname.replace(/\d{4}-\d{2}-\d{2}-/, '')

const publicPath = '/assets/'

let appenv = {
  publicPath,
  apiPath:  `${publicPath}api/`,
  baseUrl: 'http://localhost:3000',
  disqusShortname: 'anthonykoch',
};

// if (isEnvProduction) {
//   appenv = {
//     apiPath: '${publicPath}/api',
//     baseUrl: 'http://localhost:3000',
//   };
// }

module.exports = {

  router: {
    linkActiveClass: '',
    linkExactActiveClass: '',
  },

  env: {
    app: {
      ...appenv,
      isEnvProduction,
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
    publicPath,
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
        {
          test: /\.md$/i,
          include: [path.resolve('_posts')],
          use: [
            'vue-loader',
            {
              loader: require.resolve('./.webpack/vue-markdown-loader'),
            },
          ],
        },
        ...config.module.rules,
      ];

        config.plugins = [
          ...config.plugins,
          new FrontMatterPlugin({
            // Remove the date from the output filename
            glob: '_posts/*.md',
            baseRoute: blogRoute,
            replacer: stripFileDate,
            filename: `api/postmeta.json`,
          })
        ];
      if (isClient) {
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

          return path.posix.normalize(`${blogRoute}/${stripFileDate(basename)}`);
        }),
    ],
  },

  plugins: [
    '~plugins/bootstrap',
    // '~/plugins/disqus',

    // Might need highlighter later
    // '~plugins/vue-highlightjs'
  ],

  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-69481885-1',
    }]
  ],
};

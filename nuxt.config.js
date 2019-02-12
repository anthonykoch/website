'use strict'

// TODO: Disable/enable? https://nuxtjs.org/api/configuration-router#prefetchlinks

<<<<<<< Updated upstream
const path = require('path');
const glob = require('glob');
const { inspect } = require('util');

const _ = require('lodash');
const datefns = require('date-fns');

const { default: TransformFilePlugin } = requireModule('./.webpack/transform-file-plugin');
const { getPostsJson } = requireModule('./.webpack/post-helpers.js');
const { stripFileDate } = requireModule('./.webpack/utils');
=======
const path = require('path')
const glob = require('glob')

const webpack = require('webpack')
const FrontMatterPlugin = require('./.webpack/frontmatter-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = !isEnvProduction
const DIR_POSTS = '_posts'
const blogRoute = '/blog'

console.log({node_env: process.env.NODE_ENV})
>>>>>>> Stashed changes

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DIR_POSTS = '_posts';
const ROUTE_BLOG = '/blog';

console.log({IS_PRODUCTION, node_env: process.env.NODE_ENV});

const HOST = process.env.NUXT_HOST || 'localhost'
const PORT = process.env.NUXT_PORT || 3000

let appenv = {
<<<<<<< Updated upstream
  apiPath: '/_nuxt/api',
  baseUrl: 'http://localhost:3000',
  disqusShortname: 'anthonykoch',
};

if (IS_PRODUCTION) {
  appenv = {
    apiPath: '/_nuxt/api',
    baseUrl: 'http://localhost:3000',
  };
=======
  publicPath,
  apiPath:  `${publicPath}api/`,
  baseUrl: `http://${HOST}:${PORT}`,
  disqusShortname: 'anthonykoch',
>>>>>>> Stashed changes
}

module.exports = {
  router: {
    linkActiveClass: '',
    linkExactActiveClass: '',
    scrollBehavior(to, from, savedPosition) { // copied from nuxtjs.org
      // savedPosition is only available for popstate navigations (back button)
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    }
  },
  env: {
    app: {
      ...appenv,
      IS_PRODUCTION,
    },
  },
  css: [
    '@/assets/styles/main.sass',
  ],
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
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,400i,600,700' },
    ]
  },
  loading: false,
  render: {
    csp: {
      hashAlgorithm: 'sha256',
      policies: {
        'script-src': [
          'https://www.google-analytics.com',
          `https://${HOST}:${PORT}`,
          'http://assets.codepen.io',
          'https://assets.codepen.io',
        ],
        'report-uri': [
          `https://${HOST}:${PORT}`,
        ]
      }
    }  },
  build: {
    watch: ['_posts'],
<<<<<<< Updated upstream
    extractCSS: {
      allChunks: true,
    },

=======
>>>>>>> Stashed changes
    postcss: [
      require('cssnano')({
        preset: 'default',
      }),
      require('autoprefixer')(),
    ],
<<<<<<< Updated upstream

    extend(config, { isClient }) {
=======
    extend(config, { isClient, isServer }) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        ...config.module.rules,
      ]

      config.plugins = [
        new webpack.DefinePlugin({
          isServer,
          isClient,
        }),
        ...config.plugins,
        new FrontMatterPlugin({
          // Remove the date from the output filename
          glob: '_posts/*.md',
          baseRoute: blogRoute,
          replacer: stripFileDate,
          filename: `api/postmeta.json`,
        })
      ]
>>>>>>> Stashed changes
    },
  },
  generate: {
    routes: [
      ...glob.sync(path.join(__dirname, `${DIR_POSTS}/*.md`))
        .map((filename) => {
          const relativeFilename =
            path.relative(path.join(__dirname, DIR_POSTS), filename)

          const basename =
            path.basename(relativeFilename, path.extname(relativeFilename))

<<<<<<< Updated upstream
          return path.posix.normalize(`${ROUTE_BLOG}/${stripFileDate(basename)}`);
=======
          return path.posix.normalize(`${blogRoute}/${stripFileDate(basename)}`)
>>>>>>> Stashed changes
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
}

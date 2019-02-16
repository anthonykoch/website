'use strict'

// TODO: Disable/enable? https://nuxtjs.org/api/configuration-router#prefetchlinks

const path = require('path')
const glob = require('glob')

const webpack = require('webpack')
const FrontMatterPlugin = require('./.webpack/frontmatter-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = !isEnvProduction
const DIR_POSTS = '_posts'
const blogRoute = '/blog'

console.log({node_env: process.env.NODE_ENV})

const stripFileDate = (pathname) => pathname.replace(/\d{4}-\d{2}-\d{2}-/, '')

const publicPath = '/assets/'

const HOST = process.env.NUXT_HOST || 'localhost'
const PORT = process.env.NUXT_PORT || 3000

let appenv = {
  publicPath,
  apiPath:  `${publicPath}api/`,
  baseUrl: `http://${HOST}:${PORT}`,
  disqusShortname: 'anthonykoch',
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
      isEnvProduction,
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
    publicPath,
    watch: ['_posts'],
    postcss: [
      require('cssnano')({
        preset: ['default', {
          mergeRules: false,
          zindex: false,
          safe: true,
        }],
      }),
      require('autoprefixer')(),
    ],
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : '[name].[contenthash].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[hash:8].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name]/[hash:8].[ext]',
      video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[name].[hash:8].[ext]'
    },
    extend(config, { isClient, isServer }) {
      config.module.rules.push({
        test: /\.md$/i,
        include: [path.resolve('_posts')],
        use: [
          'vue-loader',
          {
            loader: require.resolve('./.webpack/vue-markdown-loader'),
          },
        ],
      })

      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      });

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

          return path.posix.normalize(`${blogRoute}/${stripFileDate(basename)}`)
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

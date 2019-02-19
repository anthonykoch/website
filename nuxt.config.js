'use strict'

// TODO: Disable/enable? https://nuxtjs.org/api/configuration-router#prefetchlinks

const path = require('path')
const glob = require('glob')

const webpack = require('webpack')
const FrontMatterPlugin = require('./.webpack/frontmatter-plugin')
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = !isEnvProduction
const isStaging = process.env.STAGING === 'true'
const DIR_POSTS = '_posts'
const blogRoute = '/blog'

const stripFileDate = (pathname) => pathname.replace(/\d{4}-\d{2}-\d{2}-/, '')

const publicPath = '/assets/'
const buildDir = isStaging ? 'dist-staging' : 'dist'
const HOST = process.env.NUXT_HOST || 'localhost'
const PORT = process.env.NUXT_PORT || 3000

const env = {
  publicPath,
  isEnvProduction,
  isStaging,
  apiPath: `${publicPath}api/`,
  baseUrl: `http://${HOST}:${PORT}`,
  disqusShortname: 'anthonykoch',
}

console.log(env)

const md = new MarkdownIt()

const markdownOptions = {
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

    return `<pre class="md-codeBlock" data-lang="${lang}"><code class="md-codeBlockInner">${
      md.utils.escapeHtml(content)
    }</code></pre>`;
  },
}

const markdownPlugins = [
  require('markdown-it-named-headings'),
  [require('markdown-it-anchor'), {
    permalinkSymbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 341.1l-1.2.1c-3.6.4-7 2-9.6 4.5l-64.6 64.6c-13.7 13.7-32 21.2-51.5 21.2s-37.8-7.5-51.5-21.2c-13.7-13.7-21.2-32-21.2-51.5s7.5-37.8 21.2-51.5l68.6-68.6c3.5-3.5 7.3-6.6 11.4-9.3 4.6-3 9.6-5.6 14.8-7.5 4.8-1.8 9.9-3 15-3.7 3.4-.5 6.9-.7 10.2-.7 1.4 0 2.8.1 4.6.2 17.7 1.1 34.4 8.6 46.8 21 7.7 7.7 13.6 17.1 17.1 27.3 2.8 8 11.2 12.5 19.3 10.1.1 0 .2-.1.3-.1.1 0 .2 0 .2-.1 8.1-2.5 12.8-11 10.5-19.1-4.4-15.6-12.2-28.7-24.6-41-15.6-15.6-35.9-25.8-57.6-29.3-1.9-.3-3.8-.6-5.7-.8-3.7-.4-7.4-.6-11.1-.6-2.6 0-5.2.1-7.7.3-5.4.4-10.8 1.2-16.2 2.5-1.1.2-2.1.5-3.2.8-6.7 1.8-13.3 4.2-19.5 7.3-10.3 5.1-19.6 11.7-27.7 19.9l-68.6 68.6C58.9 304.4 48 330.8 48 359c0 28.2 10.9 54.6 30.7 74.4C98.5 453.1 124.9 464 153 464c28.2 0 54.6-10.9 74.4-30.7l65.3-65.3c10.4-10.5 2-28.3-12.7-26.9z"/><path d="M433.3 78.7C413.5 58.9 387.1 48 359 48s-54.6 10.9-74.4 30.7l-63.7 63.7c-9.7 9.7-3.6 26.3 10.1 27.4 4.7.4 9.3-1.3 12.7-4.6l63.8-63.6c13.7-13.7 32-21.2 51.5-21.2s37.8 7.5 51.5 21.2c13.7 13.7 21.2 32 21.2 51.5s-7.5 37.8-21.2 51.5l-68.6 68.6c-3.5 3.5-7.3 6.6-11.4 9.3-4.6 3-9.6 5.6-14.8 7.5-4.8 1.8-9.9 3-15 3.7-3.4.5-6.9.7-10.2.7-1.4 0-2.9-.1-4.6-.2-17.7-1.1-34.4-8.6-46.8-21-7.3-7.3-12.8-16-16.4-25.5-2.9-7.7-11.1-11.9-19.1-9.8-8.9 2.3-14.1 11.7-11.3 20.5 4.5 14 12.1 25.9 23.7 37.5l.2.2c16.9 16.9 39.4 27.6 63.3 30.1 3.7.4 7.4.6 11.1.6 2.6 0 5.2-.1 7.8-.3 6.5-.5 13-1.6 19.3-3.2 6.7-1.8 13.3-4.2 19.5-7.3 10.3-5.1 19.6-11.7 27.7-19.9l68.6-68.6c19.8-19.8 30.7-46.2 30.7-74.4s-11.1-54.6-30.9-74.4z"/></svg>`,
    permalinkClass: 'md-headingAnchor',
    permalink: true,
    permalinkBefore: true,
  }]
]

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
    app: env,
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
      { async: true, src: 'https://static.codepen.io/assets/embed/ei.js', body: true },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.typekit.net/nsr0hmh.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css' },
    ]
  },
  loading: false,
  build: {
    publicPath,
    watch: ['_posts'],
    extractCSS: isEnvProduction,
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
        test: /\.md/,
        use: [
          'vue-loader',
          {
            loader: require.resolve('./.webpack/vue-markdown-loader/index.js'),
            options: {
              markdown: {
                options: markdownOptions,
                plugins: markdownPlugins,
              },
            },
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
          markdown: {
            options: markdownOptions,
            plugins: markdownPlugins,
          },
          baseRoute: blogRoute,
          replacer: stripFileDate,
          filename: `api/postmeta.json`,
        })
      ]
    },
  },
  generate: {
    dir: buildDir,
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

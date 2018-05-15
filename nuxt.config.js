const path = require('path');

module.exports = {
  css: [
    '@/assets/styles/main.sass',
  ],

  /*
  ** Headers of the page
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
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  router: {
    linkActiveClass: '',
    linkExactActiveClass: '',
    // FIXME: Scroll position should be restored on refresh
  },

  /*
  ** Build configuration
  */
  build: {
    extractCSS: {
      allChunks: true
    },

    extend (config, { isDev, isClient }) {
      // console.log(require('util').inspect(config.module.rules, { depth: 5 }))

      config.module.rules.push({
        test: /\.(yaml|yml)$/,
        include: [path.resolve('_data')],
        use: ['yml-loader'],
      });

      // if (isDev && isClient) {

      // }
    }
  }
}




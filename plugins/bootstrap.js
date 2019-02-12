import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';

import logger from '@/core/logger';

if (process.env.isClient) {
  require('@/assets/scripts/vendor/pep.min.js')
}

global.Waypoint = require('waypoints/src/entries/noframework')

Vue.use(VueScrollTo)

// nuxt's default loaders will process this to output to the dist directory
require.context('~/assets/images', true, /\.(svg|png|jpg)$/)

global.logger = logger

console.log('appenv:', process.env.app)

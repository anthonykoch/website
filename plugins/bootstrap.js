import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';

import logger from '@/core/logger';

if (process.env.isClient) {
  require('@/assets/scripts/vendor/pep.min.js')
}

global.Waypoint = require('waypoints/src/entries/noframework')

Vue.use(VueScrollTo)

// This kicks off the compilation for the posts
require.context('@/_posts', false, /\.md$/);

// nuxt's default loaders will process this to output to the dist directory
require.context('~/assets/images', true, /\.(svg|png|jpg)$/)

global.logger = logger

<<<<<<< Updated upstream
console.log('appenv:', process.env.app);



// if (typeof window !== 'undefined') {
//   window.addEventListener('error', () => {
//     console.log({
//       isClient: process.client,
//       isServer: process.server,
//     })
//   });
// }

=======
console.log('appenv:', process.env.app)
>>>>>>> Stashed changes

import logger from '@/core/logger';

console.log('appenv:', process.env.app);

global.logger = logger;

// if (typeof window !== 'undefined') {
//   window.addEventListener('error', () => {
//     console.log({
//       isClient: process.client,
//       isServer: process.server,
//     })
//   });
// }

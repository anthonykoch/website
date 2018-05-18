// This kicks off the compilation for the posts
require.context('@/_posts', false, /\.md$/);

// nuxt's default loaders will process this to output to the dist directory
require.context('~/assets/images', true, /\.(svg|png|jpg)$/);

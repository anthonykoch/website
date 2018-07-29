import cuid from 'cuid';

export default [
  {
    title: 'vue-scuffka',
    video: {
      url: require('~/assets/videos/howitworks2.mp4'),
    },
    thumbnail: {
      //
    },
    icon: {
      xlinkHref: 'icon-octocat',
    },
    fade: 'white',
    href: 'http://www.anthonykoch.com/vue-scuffka',
    meta: {
      // likes: 0,
    },
  },
  {
    title: 'Calculator',
    image: {
      url: require('~/assets/images/projects/calculator.png'),
    },
    thumbnail: {
      // url: require('~/assets/images/projects/calculator--thumb.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'xVQOwb',
    href: 'http://codepen.io/anthonykoch/pen/xVQOwb',
    meta: {
      likes: 193,
    },
  },
  {
    title: 'Settings Page',
    image: {
      url: require('~/assets/images/projects/settings.png'),
    },
    thumbnail: {
      // url: require('~/assets/images/projects/settings--thumb.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'QjJaQv',
    href: 'http://codepen.io/anthonykoch/pen/QjJaQv',
    meta: {
      likes: 67,
    },
  },
  {
    title: 'Medium Image Loading',
    image: {
      url: require('~/assets/images/projects/medium.png'),
    },
    thumbnail: {
      // url: require('~/assets/images/projects/medium--thumb.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'WrOQQz',
    href: 'http://codepen.io/anthonykoch/pen/WrOQQz',
    meta: {
      likes: 77,
    },
  },
  {
    title: 'Smart Home UI',
    image: {
      url: require('~/assets/images/projects/smarthomeui.png'),
    },
    thumbnail: {
      // url: require('~/assets/images/projects/smarthomeui--thumb.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'GpQYrJ',
    href: 'http://codepen.io/anthonykoch/pen/GpQYrJ',
    meta: {
      likes: 37,
    },
  },
  {
    title: 'Social Connect',
    image: {
      url: require('~/assets/images/projects/social-connect.png'),
    },
    thumbnail: {
      // url: require('~/assets/images/projects/social-connect--thumb.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'MaQBrd',
    href: 'http://codepen.io/anthonykoch/pen/MaQBrd',
    meta: {
      likes: 46,
    },
  },
//   {
//     title: 'Ponymail',
//     image: {
//       url: require('~/assets/images/projects/ponymail.png'),
//     },
//     thumbnail: {
//       // url: require('~/assets/images/projects/ponymail--thumb.png'),
//     },
//     icon: {
// xlinkHref: 'icon-octocat',
//     },
//     fade: 'white',
//     href: 'http://www.anthonykoch.com/ponymail/inbox/',
//     meta: {
//   likes: 0,
// },
//   },
].map(data => {
  return {
    ...data,
    id: cuid(),
  };
});

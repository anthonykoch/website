import cuid from 'cuid';

export default [
  {
    title: 'vue-scuffka',
    image: {
      url: require('~/assets/images/projects/vue-scuffka.png'),
      size: require('!image-size-loader!~/assets/images/projects/vue-scuffka.png'),
    },
    icon: {
      xlinkHref: 'icon-octocat',
    },
    fade: 'white',
    href: 'http://www.anthonykoch.com/vue-scuffka',
  },
  {
    title: 'Calculator',
    image: {
      url: require('~/assets/images/projects/calculator.png'),
      size: require('!image-size-loader!~/assets/images/projects/calculator.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'xVQOwb',
    href: 'http://codepen.io/anthonykoch/pen/xVQOwb',
    meta: {
      likes: 207,
    },
  },
  {
    title: 'Settings Page',
    image: {
      url: require('~/assets/images/projects/settings.png'),
      size: require('!image-size-loader!~/assets/images/projects/settings.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'QjJaQv',
    href: 'http://codepen.io/anthonykoch/pen/QjJaQv',
    meta: {
      likes: 80,
    },
  },
  {
    title: 'Medium Image Loading',
    image: {
      url: require('~/assets/images/projects/medium.png'),
      size: require('!image-size-loader!~/assets/images/projects/medium.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'WrOQQz',
    href: 'http://codepen.io/anthonykoch/pen/WrOQQz',
    meta: {
      likes: 81,
    },
  },
  {
    title: 'Smart Home UI',
    image: {
      url: require('~/assets/images/projects/smarthomeui.png'),
      size: require('!image-size-loader!~/assets/images/projects/smarthomeui.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'GpQYrJ',
    href: 'http://codepen.io/anthonykoch/pen/GpQYrJ',
    meta: {
      likes: 50,
    },
  },
  {
    title: 'Social Connect',
    image: {
      url: require('~/assets/images/projects/social-connect.png'),
      size: require('!image-size-loader!~/assets/images/projects/social-connect.png'),
    },
    icon: {
      xlinkHref: 'icon-codepen-outline',
    },
    fade: 'codepen',
    hash: 'MaQBrd',
    href: 'http://codepen.io/anthonykoch/pen/MaQBrd',
    meta: {
      likes: 55,
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

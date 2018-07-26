export default {
  namespaced: true,
  state: {
    media: {
      codepen: {
        href: 'http://codepen.io/anthonykoch/',
        name: 'anthonykoch',
        title: 'anthonykoch',
        icon: {
          class: 'icon-codepen',
        },
      },
      github: {
        href: 'https://github.com/anthonykoch',
        name: 'anthonykoch',
        title: 'anthonykoch',
        icon: {
          class: 'icon-octocat',
        },
      },
      twitter: {
        href: 'https://twitter.com/anthkoch',
        handle: '@anthkoch',
        title: '@anthkoch',
        icon: {
          class: 'icon-twitter',
        },
      },
    },
  },
  getters: {
    getMediaItems: (state) => Array.from(Object.values(state.media)),
  },
};

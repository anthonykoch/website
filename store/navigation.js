export default {
  namespaced: true,
  state: {
    links: [
      {
        text: 'work',
        href: '/#work',
        active: '/#work',
        scrollTo: '#work',
      },
      {
        text: 'blog',
        href: '/blog',
        active: '/blog/',
      },
      {
        text: 'contact',
        href: '/contact',
        active: '/contact/',
      }
    ],
  },
};

export default {
  namespaced: true,
  state: {
    links: [
      {
        text: 'about',
        href: '/about',
        active: '/about/',
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

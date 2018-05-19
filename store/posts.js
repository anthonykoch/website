import * as api from '@/core/api';

export default {
  namespaced: true,

  state: {
    posts: {},
    metadata: [],
  },

  mutations: {
    LOAD_POST(state, post) {
      state.posts[post.frontmatter.postId] = post;
    },

    LOAD_POSTS_META(state, postsMeta) {
      state.postsMeta = postsMeta;
    },
  },

  actions: {
    async nuxtServerInit() {
      throw new Error('LMAO');
    },

    async loadPost($store, { slug }) {
      const post = await api.getPost(slug);

      $store.commit('LOAD_POST', slug);

      return posts;
    },

    async loadMetadata($store) {
      const postsMeta = await api.getPostsMeta();

      $store.commit('LOAD_POSTS_META', postsMeta);

      return postsMeta;
    },
  },

  getters: {
    getPosts: state => Object.values(state.posts),
  },
};

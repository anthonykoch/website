import * as api from '@/core/api';

export default {
  namespaced: true,
  state: {
    posts: {},
    metadata: [],
  },
  mutations: {
    LOAD_POST(state, post) {
      state.posts[post.meta.slug] = post;
    },

    LOAD_METADATA(state, metadata) {
      state.metadata = metadata;
    },
  },
  actions: {
    async loadPost($store) {
      const posts = await api.getPost();

      $store.commit('LOAD_POST');

      return posts;
    },


    async loadMetadata($store) {
      const metadata = await api.getMetadata();

      $store.commit('LOAD_METADATA', metadata);

      return metadata;
    },
  },
};

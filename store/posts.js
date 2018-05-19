import * as api from '@/core/api';

export default {
  namespaced: true,

  state: {
    posts: {},
    meta: [],
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
      console.log('LMAO'.repeat(200));
    },

    async loadPost($store, { slug }) {
      const post = await api.getPost(slug);

      $store.commit('LOAD_POST', slug);

      return posts;
    },

    async loadMeta($store) {
      const { error, data } = await api.getPostsMeta();

      console.log({data, error})

      $store.commit('LOAD_POSTS_META', data);

      return data;
    },
  },

  getters: {
    getPosts: state => Object.values(state.posts),
  },
};

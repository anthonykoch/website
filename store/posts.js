import * as api from '@/core/api';

export default {
  namespaced: true,

  state: {
    postsById: Object.freeze({}),
    meta: [],
  },

  mutations: {
    LOAD_POST(state, post) {
      logger.client('Adding post:', post);

      state.postsById = Object.freeze({
        ...state.postsById,
        [post.id]: post,
      });
    },

    LOAD_POSTS_META(state, postsMeta) {
      state.meta = postsMeta;
    },
  },

  actions: {
    loadPost($store, { slug }) {
      return api.getPost(slug)
        .then(res => {
          $store.commit('LOAD_POST', res.data);
          // console.log('loaded:', response.data.slug, response.data.slug===slug, {error, response});

        })
        .catch(err => {

          return err;
        });
    },

    loadMeta($store) {
      return api.getPostsMeta()
        .then(res => {
          $store.commit('LOAD_POSTS_META', res.data);
          // console.log('loadMeta', res.data);
        })
        .catch(err => {
          // console.log('err', err)

          return err;
        });
    },
  },

  getters: {
    getBySlug:
      (state, getters) =>
        slug => getters.getPosts.find(item => item.slug === slug),

    getPosts: state => {
      return Array.from(Object.values(state.postsById));
    },
  },
};

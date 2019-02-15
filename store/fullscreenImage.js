
export default {
  namespaced: true,
  state: {
    isShowing: false,
    attributes: {
      src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    },
  },

  mutations: {
    SET_IMAGE(state, { attributes }) {
      state.isShowing = true;
      state.attributes = attributes;
    },

    HIDE_IMAGE(state) {
      state.isShowing = false;
    },
  },

  actions: {
    setImage({ commit }, options) {
      commit('SET_IMAGE', options);
    },

    hideImage({ commit }) {
      commit('HIDE_IMAGE');
    },
  },
};

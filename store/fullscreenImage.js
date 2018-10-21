
export default {
  namespaced: true,
  state: {
    isFullscreenImageShowing: false,
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    alt: '',
    maxWidth: null,
  },

  mutations: {
    SET_IMAGE(state, { src, alt, maxWidth }) {
      state.isFullscreenImageShowing = true;
      state.alt = alt;
      state.src = src;

      state.maxWidth = maxWidth;
    },

    HIDE_IMAGE(state) {
      state.isFullscreenImageShowing = false;
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

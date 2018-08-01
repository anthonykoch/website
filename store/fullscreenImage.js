
export default {
  namespaced: true,
  state: {
    isFullscreenImageShowing: false,
    fullscreenImageSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    fullscreenImageAlt: '',
  },

  mutations: {
    SET_IMAGE(state, { src, alt }) {
      state.isFullscreenImageShowing = true;
      state.fullscreenImageAlt = alt;
      state.fullscreenImageSrc = src;
    },

    HIDE_IMAGE(state) {
      state.isFullscreenImageShowing = false;
    },
  },

  actions: {
    setImage({ commit }, { src, alt }) {
      commit('SET_IMAGE', { src, alt });
    },

    hideImage({ commit }) {
      commit('HIDE_IMAGE');
    },
  },
};

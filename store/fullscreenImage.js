export const state = () => ({
  isShowing: false,
  attributes: {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  },
})

export const mutations = {
  SET_IMAGE(state, { attributes }) {
    state.isShowing = true;
    state.attributes = attributes;
  },

  HIDE_IMAGE(state) {
    state.isShowing = false;
  },
}

export const actions = {
  setImage({ commit }, options) {
    commit('SET_IMAGE', options);
  },

  hideImage({ commit }) {
    commit('HIDE_IMAGE');
  },
}

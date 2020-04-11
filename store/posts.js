import * as api from '@/core/api';

export const state = () => ({
  allMeta: [],
})

export const mutations = {
  LOAD_POSTS_META(state, allMeta) {
    state.allMeta = allMeta;
  },
}

export const actions = {
  loadAllMeta({ commit }) {
    return api.getPostsMeta()
      .then(res => {
        commit('LOAD_POSTS_META', res.data);
      })
      .catch(err => console.log(err))
  },
}

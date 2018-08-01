// import createPersistedState from 'vuex-persistedstate'

import Vuex from 'vuex';

import projects from './projects';
import posts from './posts';
import navigation from './navigation';
import fullscreenImage from './fullscreenImage';

export const storeDefinitions = {
  strict: true,

  // plugins: [createPersistedState({
  //   //
  // })],
  actions: {
    async nuxtServerInit() {
      if (process.server) {

      }
    },
  },

  modules: {
    projects,
    posts,
    navigation,
    fullscreenImage,
  },
};

const createStore = () => {
  return new Vuex.Store(storeDefinitions);
};

export default createStore;

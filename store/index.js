// import createPersistedState from 'vuex-persistedstate'

import Vuex from 'vuex';

import social from './social';
import projects from './projects';
import posts from './posts';
import navigation from './navigation';
import pages from './pages';

export const storeDefinitions = {
  strict: true,
  // plugins: [createPersistedState({
  //   //
  // })],
  modules: {
    projects,
    posts,
    navigation,
    social,
    pages,
  },
};

const createStore = () => {
  return new Vuex.Store(storeDefinitions);
};

export default createStore;

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
  actions: {
    async nuxtServerInit() {
      console.log('looooool')

      this.dispatch('posts/loadMeta');

      if (process.server) {
        // const test = await axios.get('http://localhost:3000/_nuxt/api/postmeta.json');

        // console.log(test)
      }


    },
  },

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

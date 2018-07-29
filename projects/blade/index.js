'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import debounce from 'lodash/debounce';

import App from '@/projects/blade/App';

export default function init(el) {
  const store = new Vuex.Store({
    ...require('@/projects/blade/store').default,
    key: 'bladejs',
    plugins:
      process.browser
        ? [createPersistedState()]
        : undefined,
  });

  store.subscribe((mutation, state) => {
    const { payload, type } = mutation;
    console.log('Mutation:', mutation, state);
  });

  return new Vue({
    el,
    store,
    render: h => h(App),
  });
}

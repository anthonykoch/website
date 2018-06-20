<template>
  <div>

    <app-site-header>
      <app-hero
        slot="lower"
      >
        <div slot="caption">My writings</div>
        <div slot="description">
          These are my various writings, mostly on topics surrounding front-end development.
        </div>
      </app-hero>
    </app-site-header>

    <section>
      <div class="row row--readable">
        <ul class="PostList">
          <li class="PostList__item" v-for="meta in postsMeta">
            <app-post-preview :meta="meta"></app-post-preview>
          </li>
        </ul>
      </div>
    </section>

    <app-site-footer></app-site-footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import * as api from '@/core/api';

export default {
  async fetch({ store: $store }) {
    await $store.dispatch('posts/loadMeta');
  },

  data() {
    return {

    };
  },

  computed: {
    ...mapState({
      postsMeta: state => state.posts.meta,
    }),
  },
};
</script>


<style>

.PostList {
  /*padding-top: 2rem;*/
}

</style>

<template>
  <page
    :show-social="false"
  >
    <div slot="heroCaption">My writings</div>
    <div slot="heroDescription">
      These are my various writings, mostly on topics surrounding front-end development.
    </div>
    <section>
      <div class="u-sizeReadable u-mxauto">
        <ul class="PostList u-pt8">
          <li class="PostList__item u-pb8"
            v-for="(meta, index) in postsMeta"
            :key="index"
          >
            <app-post-preview :meta="meta"></app-post-preview>
          </li>
        </ul>
      </div>
    </section>
  </page>
</template>

<script>
import { mapState } from 'vuex';

import * as api from '@/core/api';

export default {
  async fetch({ store: $store }) {
    await $store.dispatch('posts/loadMeta');
  },

  components: {
    page: require('@/layouts/main').default,
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

</style>

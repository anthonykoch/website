<template>
  <page
    :theme="theme"
    :show-social="false"
  >
    <div slot="heroCaption">My writings</div>
    <div slot="heroDescription">
      These are my various writings, mostly on topics surrounding front-end development.
    </div>
    <section>
      <div class="[ Container is-smallWidth ] u-gutter u-mxauto">
        <ul class="PostList">
          <li class="PostList__item"
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
    await $store.dispatch('posts/loadAllMeta');

  },

  components: {
    page: require('@/layouts/main').default,
  },

  data() {
    return {
      theme: {
        hero: {
          isSmallWidth: true,
        },
      },
    };
  },

  head() {
    return {
      title: 'Blog',
      meta: [
        { hid: 'description', name: 'description', content: `These are my various writings, mostly on topics surrounding front-end development.` },
      ],
    };
  },

  computed: {
    ...mapState({
      postsMeta: state => state.posts.allMeta,
    }),
  },
};
</script>

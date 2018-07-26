<template>
  <page
    :theme="theme"
    :show-social="false"
  >
    <!-- <div slot="before">
      <div class="Sidebar"></div>
      <div class="Sidebar2"></div>
    </div> -->
    <div slot="heroCaption">My writings</div>
    <div slot="heroDescription">
      These are my various writings, mostly on topics surrounding front-end development.
    </div>
    <section>
      <div class="u-mxauto [ Container is-smallWidth ]">
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
      theme: {
        hero: {
          isSmallWidth: true,
        },
      },
    };
  },

  computed: {
    ...mapState({
      postsMeta: state => state.posts.meta,
    }),
  },
};
</script>

<style lang="scss">

// .Sidebar {
//   background-color: rgba(white, 0.2);
//   height: 500px;
//   left: 0;
//   top: 0;
//   position: absolute;
//   width: 300px;
// }

// .Sidebar2 {
//   background-color: rgba(black, 0.2);
//   width: 300px;
//   position: absolute;
//   left: 0;
//   height: 400vh;
//   top: 500px;
// }

// .SiteHeader__lower {
//   padding-left: 300px;
// }

</style>

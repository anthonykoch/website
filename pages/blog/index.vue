<template>
  <div>
    this is index blog

  {{ postsMeta }}

  </div>
</template>

<script>
import { mapState } from 'vuex';

import * as api from '@/core/api';

export default {
  mounted() {
    console.log(this);
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

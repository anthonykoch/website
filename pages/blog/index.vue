<template>
  <div>
    this is index blog


  </div>
</template>

<script>
import * as api from '@/core/api';

export default {
  mounted() {
    console.log(this);
  },

  async asyncData(context) {
    const postsMeta = await api.getPostsMeta();

    console.log({postsMeta})

    return {
      postsMeta,
    };

    // return {
    //   metadata,
    // };
  },
};
</script>

<template>
  <div>
    this is index blog
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    // console.log(this.$router.options.routes)
  },

  // asyncData(context) {
  //   // console.log('awpdokawd', context)

  //   const metadata =
  //     axios.get('//localhost:3000/api/posts/metadata.json')
  //       .then(meme => console.log(meme))
  //       .catch(err => console.log('error', err));

  //   // return Promise.resolve()
  //   // // console.log(metadata)

  //   return metadata;

  //   // return {
  //   //   metadata,
  //   // };
  // },
};
</script>

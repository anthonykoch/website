<template>

  <app-hero>
    <div slot="heroCaption">Try BladeJS.</div>
    <div slot="heroDescription">
      BladeJS is a JavaScript implementation of Laravel's Blade templating engine.
    </div>
  </app-hero>

  <!--
  scripts:
    - src: pages/blade.js
   -->
</template>

<script>
export default {
  components: {
    page: require('@/layouts/main').default,
    AppHero: require('@/components/Hero').default,
  },

  head() {
    return {

    };
  },

};
</script>


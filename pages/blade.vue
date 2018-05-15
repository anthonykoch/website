<template>

  <app-hero>
    <div slot="caption">Try BladeJS.</div>
    <div slot="description">
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
    AppHero: require('@/components/Hero').default,
  },

  head() {
    return {

    };
  },

};
</script>


<template>
  <page>
    <div slot="heroCaption">Try BladeJS.</div>
    <div slot="heroDescription">
      BladeJS is a JavaScript implementation of Laravel's Blade templating engine. The code for the compiler can be found here <a href="https://github.com/anthonykoch/bladejs">https://github.com/anthonykoch/bladejs</a>
    </div>

    <!-- I heard you liked apps, so I put an app inside your app -->
    <div id="app" ref="app"></div>
  </page>
</template>

<script>

export default {
  components: {
    page: require('@/layouts/main').default,
    AppHero: require('@/components/Hero').default,
  },

  head() {
    return {
      title: 'BladeJS',
      meta: [
        { hid: 'description', name: 'description', content: `BladeJS is a JavaScript implementation of Laravel's Blade templating engine.` },
      ],
    };
  },

  async created() {
    const { default: init } = await import('@/projects/blade/index.js');

    init(this.$refs.app);
  },
};

</script>

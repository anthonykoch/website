<template>
  <a
    :href="project.href"
    class="ProjectPreview is-animated"
    tabindex="0"
    @click="onClick"
  >
    <div
      class="ProjectPreview-container"
    >
      <div
        v-if="project.image"
        :style="imageStyles"
        ref="background"
        aria-hidden="true"
        class="ProjectPreview-background"
      ></div>
      <video
        v-if="project.video"
        ref="background"
        :src="project.video.url"
        style="height: auto"
        loop="true"
        aria-hidden="true"
        class="ProjectPreview-background"
      ></video>
      <div class="ProjectPreview-title">
        {{ project.title }}
      </div>
      <div class="ProjectPreview-icon">
        <svg class="svg-icon">
          <use :xlink:href="'#' + project.icon.xlinkHref"></use>
        </svg>
      </div>

      <app-ripple :ripple="ripple"></app-ripple>
    </div>

    <div class="ProjectPreview-meta" v-if="project.meta">
      <div>
      </div>
      <div class="u-flex u-itemsCenter" v-if="project.meta.likes">
        <svg class="ProjectPreview-likes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"/></svg>
        <span>{{ project.meta.likes }}</span>
      </div>
    </div>
  </a>
</template>

<script>

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      ripple: null,
    };
  },

  computed: {
    imageStyles() {
      return {
        'background-image': `url(${this.project.image.url})`,
      };
    },
  },

  methods: {
    hasBackgroundVideo() {
      return this.$refs.background.tagName === 'VIDEO';
    },

    onClick(e) {
      e.preventDefault();

      this.ripple = {
        pageX: e.pageX,
        pageY: e.pageY,
      };

      this.$emit('navigate', e, this.project);
    },
  },

  mounted() {
    // FIXME: This randomly breaks, soooooo...
    // if (this.hasBackgroundVideo()) {
    //   this.waypoint = new Waypoint({
    //     element: this.$refs.background,
    //     handler: () => {
    //       this.$refs.background.play();
    //       this.waypoint.destroy();
    //     },
    //     offset: '55%',
    //   });
    // }
  },

  destroyed() {
    // if (this.waypoint) {
    //   this.waypoint.destroy();
    // }
  },
};

</script>

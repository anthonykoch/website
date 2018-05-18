<template>
  <a
    :href="project.href"
    class="ProjectPreview ProjectPreview--is-animated"
    tabindex="0"
    @click="onClick"
  >
    <div
      class="ProjectPreview__container"
    >
      <div
        aria-hidden="true"
        class="ProjectPreview__background"
        :style="imageStyles"
      >
      </div>
      <div class="ProjectPreview__title">
        {{ project.title }}
      </div>
      <div class="ProjectPreview__icon">
        <svg class="svg-icon">
          <use :xlink:href="'#' + project.icon.xlinkHref"></use>
        </svg>
      </div>

      <app-ripple :ripple="ripple"></app-ripple>
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
    onClick(e) {
      e.preventDefault();

      this.ripple = {
        pageX: e.pageX,
        pageY: e.pageY,
      };

      this.$emit('navigate', e, this.project);
    },
  },
};

</script>

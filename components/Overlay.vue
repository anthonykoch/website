<template>
  <div
    class="Overlay"
    :class="classes"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Overlay',

  props: {
    allowClose: {
      type: Boolean,
      default: true,
    },

    background: {
      default: null,
      validator(value) {
        return value == null || typeof value === 'string';
      },
    },
  },

  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },

  destroyed() {
    window.removeEventListener('keydown', this.onKeydown);
  },

  computed: {
    classes() {
      const classes = {
        'is-codepen': this.background === 'codepen',
        'is-light': this.background === null || this.background === 'light',
        'is-white': this.background === 'white',
        'is-dark': this.background === 'dark',
      };

      // console.log(this.background, classes)

      return classes;
    },
  },

  methods: {
    onClick(e) {
      if (e.target === this.$el) {
        this.$emit('request-close', { escape: false, });
      }
    },

    onKeydown(e) {
      if (e.which === 27) {
        this.$emit('request-close', { escape: true, });
      }
    },
  },

};
</script>

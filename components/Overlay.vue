<template>
  <div
    class="Overlay"
    :class="classes"
    @click="onClick"
  >
    <focus-lock>
      <slot name="close">
        <button
          v-show="isShowingClose"
          :class="{ 'is-light': hasLightCloseButton }"
          class="Overlay-close"
          @click="$emit('request-close')"
        >
          <svg class="Overlay-closeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/></svg>
        </button>
      </slot>
      <slot></slot>
    </focus-lock>
  </div>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    fill : {
      type: String,
      default: 'window',
      validator(value) {
        return ['window', 'parent'].includes(value)
      },
    },
    hasLightCloseButton: {
      type: Boolean,
      default: true,
    },
    isShowingClose: {
      type: Boolean,
      default: true,
    },
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
  components: {
    'focus-lock': require('vue-focus-lock').default,
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
        'is-relativeToParent': this.fill !== 'window',
        'is-codepen': this.background === 'codepen',
        'is-light': this.background === null || this.background === 'light',
        'is-white': this.background === 'white',
        'is-dark': this.background === 'dark',
      };

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

<style lang="scss" scoped>
@import '../assets/styles/bootstrap';

.Overlay {
  background: rgba(color('background'), 0.5);
  height: 100vh;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  z-index: $app-layer-overlay;
  width: 100%;

  &.is-relativeToParent {
    position: absolute;
  }
}

.Overlay.is-white {
  background-color: #ffffff;
}

.Overlay.is-codepen {
  background-color: #1a1c1d;
}

.Overlay.is-dark {
  background-color: #2b292b;
}

.Overlay-close {
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 100%;
  fill: rgba(black, 0.6);
  height: 43px;
  outline: 0;
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: transform 170ms, box-shadow 170ms;
  width: 43px;
  z-index: 1;

  &:focus {
    border-color: rgba(black, 0.4);
  }

  &:active {
    transform: scale(0.92);
    box-shadow: 0 3px 5px -1px rgba(black, 0.4);
  }

  &.is-light {
    background-color: white;
    box-shadow: 0 13px 36px -2px rgba(black, 0.18);
  }
}

.Overlay-closeIcon {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
}

</style>

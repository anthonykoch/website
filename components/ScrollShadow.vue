<template>
  <div class="ScrollShadow">
    <div class="ScrollShadow-shadow" :class="{ 'is-showing': !isScrollShadowShowing }"></div>
    <div
      class="ScrollShadow-scroller"
      ref="scroll"
      @scroll="onScrollThrottled"
    >
      <div
        ref="container"
        class="ScrollShadow-container"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  created() {
    this.onScrollThrottled = _.throttle(this.onScroll, 48, { leading: true })
  },
  mounted() {
    this.isScrollShadowShowing = this.isScrolledToEnd()
  },
  data() {
    return {
      isScrollShadowShowing: true,
    }
  },
  methods: {
    onScroll() {
      this.isScrollShadowShowing = this.isScrolledToEnd()
    },
    isScrolledToEnd() {
      return this.$refs.scroll.scrollWidth - this.$refs.scroll.offsetWidth === this.$refs.scroll.scrollLeft
    },
  },
}
</script>

<style lang="scss" scoped>

.ScrollShadow {
  position: relative;
  width: 100%;
}

.ScrollShadow-scroller {
  overflow: auto;
  white-space: nowrap;
  max-width: 100%;
}

.ScrollShadow-shadow {
  background-image: linear-gradient(to left, rgba(black, 0.07), transparent);
  content: '';
  height: 100%;
  position: absolute;
  pointer-events: none;
  right: 0;
  opacity: 0;
  top: 0;
  transition: opacity 300ms;
  width: 20px;
  z-index: 2;

  &.is-showing {
    opacity: 1;
  }
}

</style>

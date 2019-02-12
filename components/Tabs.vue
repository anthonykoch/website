<template>
  <div style="position: relative">
    <div
      ref="tabs"
      @scroll="onScrollDebounced"
      class="Tabs"
      role="tablist"
    >
      <div class="Tabs-scrollShadow" :class="{ 'is-showing': isScrollShadowShowing }"></div>
      <div class="Tabs-container">
        <slot>
          <tabs-item
            v-for="(tab, index) in tabs"
            :key="tab.id || index"
            v-bind="{
              text: tab.text,
              id: tab.id,
              isActive: index === activeIndex,
              ariaControls: tab.ariaControls,
            }"
          >
          </tabs-item>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  components: {
    TabsItem: require('@/components/TabsItem.vue').default,
  },
  data() {
    return {
      isScrollShadowShowing: true,
      activeIndex: this.$props.defaultIndex || 0,
    }
  },
  props: {
    defaultIndex: {
      type: Number,
      default: 0,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  destroyed() {
    this.$off('click', this.onClick)
  },
  mounted() {
    this.$on('click', this.onClick)
    this.isScrollShadowShowing = this.isScrolledToEnd()
  },
  created() {
    this.onScrollDebounced = _.debounce(this.onScroll, 48)
  },
  methods: {
    isScrolledToEnd() {
      return this.$refs.tabs.scrollWidth - this.$refs.tabs.offsetWidth === this.$refs.tabs.scrollLeft
    },
    onScroll(e) {
      this.isScrollShadowShowing = this.isScrolledToEnd()
    },
    onClick(id) {
      this.activeIndex = this.tabs.findIndex((tab) => tab.id === id)
      this.$emit('change', this.activeIndex, id)
    }
  },
}
</script>

<style lang="scss" scoped>

.Tabs {
  overflow: auto;
  white-space: nowrap;
}

.Tabs-scrollShadow {
  background-image: linear-gradient(to left, rgba(black, 0.07), transparent);
  content: '';
  height: 100%;
  position: absolute;
  pointer-events: none;
  right: 0;
  opacity: 1;
  top: 0;
  transition: opacity 300ms;
  width: 20px;
  z-index: 2;

  &.is-showing {
    opacity: 0;
  }
}

.Tabs-container {
  display: inline-flex;
}
</style>

<template>
  <div class="container">
    <div>
      <tabs
        :tabs="tabs"
        :default-index="defaultIndex"
        @change="onChange"
        class="tabs"
      >
        <slot name="tabs"></slot>
      </tabs>
    </div>
    <!--<div
      v-show="activeIndex === index"
      v-for="(tab, index) in tabs"
      :key="index"
      :aria-labelledby="tab.id"
      :aria-hidden="activeIndex === index"
      role="tabpanel"
    >
      {{ tab }}
    </div>-->
    <image-compare v-bind="activeTab"></image-compare>
  </div>
</template>

<script>
export default {
  components: {
    ImageCompare: require('@/components/ImageCompare').default,
    Tabs: require('@/components/Tabs').default,
  },
  data() {
    return {
      activeIndex: this.$props.defaultIndex || 0,
    }
  },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    json(value) { return JSON.stringify(value)},
    onChange(index, id) {
      this.activeIndex = index
    },
  },
  computed: {
    activeTab() {
      return this.tabs[this.activeIndex]
    },
  },
}

</script>

<style lang="scss" scoped>
.mom {
  display: flex;
}

.container {
  position: relative;
}
</style>

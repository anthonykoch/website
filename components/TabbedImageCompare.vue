<template>
  <div class="container">
    <div class="TabbedImageCompare-tabsContainer">
      <tabs
        :tabs="tabs"
        :default-index="defaultIndex"
        @change="onChange"
        class="tabs"
      >
        <slot name="tabs"></slot>
      </tabs>
      <!--<div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M396.795 396.8H320V448h128V320h-51.205zM396.8 115.205V192H448V64H320v51.205zM115.205 115.2H192V64H64v128h51.205zM115.2 396.795V320H64v128h128v-51.205z"/></svg>
      </div>-->
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
.container {
  position: relative;
}

.TabbedImageCompare-tabsContainer {
  display: flex;
  flex-wrap: nowrap;
  /* position: absolute; */
  /* z-index: 7; */
}

.tabs-container {
  display: flex;
  flex-wrap: nowrap;
}
</style>

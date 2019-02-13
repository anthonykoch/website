<template>
  <scroll-shadow>
    <div class="Tabs">
      <div
        ref="tabs"
        class="Tabs-container"
        role="tablist"
      >
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
              @selected="onSelected(index, tab.id)"
            >
            </tabs-item>
          </slot>
        </div>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import _ from 'lodash'

export default {
  components: {
    ScrollShadow: require('@/components/ScrollShadow.vue').default,
    TabsItem: require('@/components/TabsItem.vue').default,
  },
  data() {
    return {
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
  methods: {
    onSelected(index, id) {
      this.activeIndex = index
      this.$emit('change', index, id)
    }
  },
}
</script>

<style lang="scss" scoped>

.Tabs {
  position: relative;
}

.Tabs-container {
  display: inline-flex;
}
</style>

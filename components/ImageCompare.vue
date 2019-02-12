<template>
  <div class="ImageCompare" ref="container">
    <!-- <div slot="swap">TODO</div> -->
    <div
      :style="{ 'padding-bottom': aspectFill }"
      class="ImageCompare-aspectFill"
      @pointermove="onActivityDebounced"
      @pointerleave="onActivityLostDebounced"
    >
      <div
        :url="actualRight.url"
        class="ImageCompare-container is-right"
      >
        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span class="ImageCompare-tag is-right" v-show="isUserInteracting">{{ actualRight.tag || 'after' }}</span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <img :src="actualRight.url" :alt="actualRight.alt">
        </div>
      </div>
      <div
        :style="imageContainerStyleAfter"
        :url="actualLeft.url"
        class="ImageCompare-container is-left"
      >
        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span class="ImageCompare-tag is-left" v-show="isUserInteracting">{{ actualLeft.tag || 'before' }}</span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <img :src="actualLeft.url" :alt="actualLeft.alt">
        </div>
      </div>
      <drag
        :on-drag-start="onDragStart"
        :on-dragging="onDragging"
        class="ImageCompare-grabContainer"
      >
        <div
          class="ImageCompare-grab"
          :style="{
            transform: `translateX(${handleOffset}px)`,
          }"
        >
          <div class="ImageCompare-grabBar"
          ></div>
          <div
            class="ImageCompare-grabHandle"
          ></div>
        </div>
      </drag>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import * as utils from '@/core/utils'
// TODO: implement https://github.com/pelotoncycle/resize-observer

const ACTIVITY_TIMEOUT = 1000

export default {
  name: 'image-compare',
  components: {
    Drag: require('@/components/Drag').default,
  },
  created() {
    this.onActivityDebounced = _.debounce(this.onActivity, 100)
    this.onActivityLostDebounced = _.debounce(this.onActivityLost, 100)
    this.onWindowResizeDebounced = _.debounce(this.onWindowResize, 120)
  },
  mounted() {
    this.isMounted = true
    this.containerWidth = this.$refs.container.offsetWidth

    if (typeof this.dragHandleOffset === 'string') {
      this.handleOffset = this.containerWidth / 2
    }

    Promise.all(
      [this.left.url, this.right.url]
        .map((url) => utils.preloadImage(url))
      ).then(([left, right]) => {
        this.dimensions.right = {
          width: right.img.naturalWidth,
          height: right.img.naturalHeight,
        }

        this.dimensions.left = {
          width: left.img.naturalWidth,
          height: left.img.naturalHeight,
        }

        this.isPreloaded = true
      })

    window.addEventListener('resize', this.onWindowResizeDebounced)
  },
  destroyed() {
    this.isMounted = false

    window.removeEventListener('resize', this.onWindowResizeDebounced)
  },
  data() {
    return {
      isUserInteracting: true,
      isPreloaded: false,
      dimensions: {},
      handleOffset: 0,
      containerWidth: null,
      isMounted: false,
    }
  },
  props: {
    dragHandleOffset: {
      type: [String, Number],
      default: '50%',
    },
    swap: Boolean,
    width: Number,
    height: Number,
    left: {
      type: Object,
      required: true,
      validator(value) {
        return value && value.url
      },
    },
    right: {
      type: Object,
      required: true,
      validator(value) {
        return value && value.url
      },
    },
  },
  methods: {
    onWindowResize() {
      this.containerWidth = this.$refs.container.offsetWidth
    },
    onDragStart(start) {
      this.handleOffsetStart = this.handleOffset
    },
    onDragging(e, difference) {
      this.handleOffset =
        Math.min(
          Math.max(
            this.handleOffsetStart + difference.x,
            0
          ),
          this.containerWidth
        )
    },
    getAspectRatioPercentage() {
      if (this.isPreloaded) {
        return this.dimensions.left.height / this.dimensions.right.width
      }

      return this.height / this.width
    },
    getRenderedPercentage() {
      const offsetWidth = this.containerWidth
      const difference = Math.abs(offsetWidth - this.width)

      return difference / this.width
    },
    getImageContainerDimensions() {
      // TODO: Maybe preload and get image dimensions from that?
      const renderPercentage = this.getRenderedPercentage()
      const imageHeight = this.height - (this.height * renderPercentage)
      const difference = Math.abs(this.containerWidth - this.width)

      return {
        height: imageHeight,
        width: this.containerWidth,
      }
    },
    onActivityLost() {
      // console.log('no');
      clearTimeout(this.interactivityId)

      this.interactivityId = setTimeout(() => {
        this.isUserInteracting = false
      }, ACTIVITY_TIMEOUT)
    },
    onActivity() {
      // console.log('yes');

      this.isUserInteracting = true
    },
  },
  computed: {
    actualRight() {
      return this.swap ? this.left : this.right
    },
    actualLeft() {
      return this.swap ? this.right : this.left
    },
    imageContainerStyleAfter() {
      if (this.isMounted) {
        const dim = this.getImageContainerDimensions()

        return {
          width: `${this.handleOffset}px`,
          height: `${dim.height}px`,
        }
      }
    },
    imageStyle() {
      if (this.isMounted) {
        const dim = this.getImageContainerDimensions()

        return {
          width: `${dim.width}px`,
          height: `${dim.height}px`,
        }
      }
    },
    aspectFill() {
      return `${this.getAspectRatioPercentage() * 100}%`;
    }
  },
}
</script>

<style lang="scss" scoped>

.ImageCompare {
  position: relative;
}

.ImageCompare-aspectFill {
  cursor: grab;
  position: relative;
}

.ImageCompare-container {
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;

  &.is-before {
    z-index: 1;
  }

  &.is-left {
    /* opacity: 0.4;
    opacity: 0.2; */
    z-index: 2;
  }
}

.ImageCompare-image {
  left: 0;
  position: absolute;
  top: 0;
  user-select: none;
}

.ImageCompare-grab {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: translateX(0);
  user-select: none;
}

.ImageCompare-grabBar {
  background-color: white;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 1px;

  &:before {
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    width: 14px;
  }
}

.ImageCompare-grabContainer {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.ImageCompare-tag {
  background-color: rgba(white, 0.05);
  border: 1px solid rgba(white, 0.1);
  color: white;
  font-size: 13px;
  padding: 3px 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: transformY(-50%);
  z-index: 2;

  &.is-left {
    left: 0;
  }

  &.is-right {
    right: 0;
  }
}
</style>

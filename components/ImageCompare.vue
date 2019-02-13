<template>
  <div class="ImageCompare" ref="container">
    <!-- <div slot="swap">TODO</div> -->
    <div
      :style="{ 'padding-bottom': aspectFill }"
      class="ImageCompare-aspectFill"
      @pointermove="onActivityDebounced"
      @pointerleave="onActivityLostDebounced"
    >
      <transition name="tr-fade">
        <slot name="placeholder" v-if="!actualLeft.isShowing">
          <div class="ImageCompare-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M457.6 140.2l-82.5-4-4.8-53.8c-1-11.3-11.1-19.2-22.9-18.3L51.5 88.4c-11.8 1-20.3 10.5-19.4 21.7l21.2 235.8c1 11.3 11.2 19.2 22.9 18.3l15-1.2-2.4 45.8c-.6 12.6 9.2 22.8 22.4 23.5L441.3 448c13.2.6 24.1-8.6 24.8-21.2L480 163.5c.6-12.5-9.3-22.7-22.4-23.3zm-354.9 5.3l-7.1 134.8L78.1 305 62 127v-.5-.5c1-5 4.4-9 9.6-9.4l261-21.4c5.2-.4 9.7 3 10.5 7.9 0 .2.3.2.3.4 0 .1.3.2.3.4l2.7 30.8-219-10.5c-13.2-.4-24.1 8.8-24.7 21.3zm334 236.9l-84.8-99.5-37.4 34.3-69.2-80.8-122.7 130.7L133 168v-.4c1-5.4 6.2-9.3 11.9-9l291.2 14c5.8.3 10.3 4.7 10.4 10.2 0 .2.3.3.3.5l-10.1 199.1z"/><path d="M384 256c17.6 0 32-14.4 32-32s-14.3-32-32-32c-17.6 0-32 14.3-32 32s14.3 32 32 32z"/></svg>
            <div class="ImageCompare-placeholderText">Loading</div>
          </div>

        </slot>
      </transition>
      <div
        :url="actualRight.url"
        class="ImageCompare-container is-right"
      >
        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span class="ImageCompare-tag is-right" v-show="isUserInteracting && hasIntersected">{{ actualRight.tag || 'after' }}</span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <transition name="tr-fade">
            <img :src="actualRight.url" :alt="actualRight.alt" v-if="actualRight.isShowing">
          </transition>
        </div>
      </div>
      <div
        :style="imageContainerStyleAfter"
        :url="actualLeft.url"
        class="ImageCompare-container is-left"
      >
        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span class="ImageCompare-tag is-left" v-show="isUserInteracting && hasIntersected">{{ actualLeft.tag || 'before' }}</span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <transition name="tr-fade">
            <img :src="actualLeft.url" :alt="actualLeft.alt" v-if="actualLeft.isShowing">
          </transition>
        </div>
      </div>
      <drag
        :on-drag-start="onDragStart"
        :on-dragging="onDragging"
        class="ImageCompare-grabContainer"
      >
        <transition name="tr-fade">
          <div
            v-show="hasIntersected"
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
        </transition>
      </drag>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import * as utils from '@/core/utils'
// TODO: implement https://github.com/pelotoncycle/resize-observer

const ACTIVITY_TIMEOUT = 1000

if (process.env.isClient) {
  require('intersection-observer')
}

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
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
        }

        this.hasIntersected = this.hasIntersected || entry.isIntersecting
      })
    }, {
      threshold: 0,
    });

    this.observer.observe(this.$refs.container)

    this.isMounted = true
    this.containerWidth = this.$refs.container.offsetWidth

    if (typeof this.dragHandleOffset === 'string') {
      this.handleOffset = this.containerWidth / 2
    }

    window.addEventListener('resize', this.onWindowResizeDebounced)
  },
  beforeDestroy() {
    this.observer.unobserve(this.$refs.container)
    this.observer.disconnect()
  },
  destroyed() {
    this.isMounted = false
    window.removeEventListener('resize', this.onWindowResizeDebounced)
  },
  data() {
    return {
      hasIntersected: false,
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
      return {
        ...this.swap ? this.left : this.right,
        isShowing: this.hasIntersected,
      }
    },
    actualLeft() {
      return {
        ...this.swap ? this.right : this.left,
        isShowing: this.hasIntersected,
      }
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

@import '../assets/styles/bootstrap';

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

@keyframes dance {
  0% {
    transform: translate(-40%, -50%) rotate(10deg);
  }

  50% {
    transform: translate(-50%, -50%) rotate(-10deg);

  }

  100% {
    transform: translate(-40%, -50%) rotate(10deg);
  }
}

.ImageCompare-placeholder {
  background-color: #eeeeee;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  svg {
    /* animation: dance 2s 1s infinite cubic-bezier(0.215, 0.61, 0.355, 1); */
    fill: rgba(black, 0.1);
    height: auto;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
  }
}

.ImageCompare-placeholderText {
  color: rgba(black, 0.1);
  font-size: 14px;
  font-weight: 700;
  font-family: $app-font-family-1;
  left: 50%;
  letter-spacing: 1px;
  position: absolute;
  text-transform: uppercase;
  top: calc(50% + 4rem);
  transform: translate(-50%, -50%);
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

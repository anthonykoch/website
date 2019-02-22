<template>
  <div class="ImageCompare" ref="container">
    <transition name="tr-fade">
      <div class="Notice" v-show="isOverlayNoticeShowing">
        <div class="Notice-panel">
          <p>
            <b>Tip:</b> Click the image or press Enter to toggle between images.
          </p>
        </div>
      </div>
    </transition>
    <transition name="tr-fade">
      <div class="Notice" v-show="isDragNoticeShowing">
        <div class="Notice-panel">
          <p>
            <b>Tip:</b> Drag the slider to reveal more or less of the before image.
          </p>
        </div>
      </div>
    </transition>
    <div
      :style="{ 'padding-bottom': aspectFill }"
      :class="{ 'is-grabbable': !isModeOverlayEnabled }"
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
        :style="imageContainerStyleBefore"
        :url="actualRight.url"
        class="ImageCompare-container is-right"
        @mousedown="isImageOverlayToggled = !isImageOverlayToggled"
      >
        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span
              class="ImageCompare-tag is-right"
              v-show="isUserInteracting && hasIntersected"
              v-if="!isModeOverlayEnabled"
            >
              {{ actualRight.tag || 'after' }}
            </span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <transition name="tr-fade">
            <img :src="actualRight.url" :alt="actualRight.alt" v-if="actualRight.isShowing">
          </transition>
        </div>
      </div>
      <div
        :url="actualLeft.url"
        :style="imageContainerStyleAfter"
        ref="leftContainer"
        class="ImageCompare-container is-left"
        @click.left="isImageOverlayToggled = !isImageOverlayToggled"
        @keydown.enter="isImageOverlayToggled = !isImageOverlayToggled"
        tabindex="0"
      >

        <slot name="tagRight" :is-user-active="isUserInteracting">
          <transition name="tr-fade">
            <span
              class="ImageCompare-tag is-left"
              v-show="isUserInteracting && hasIntersected"
              v-if="!isModeOverlayEnabled"
            >
              {{ actualLeft.tag || 'before' }}
            </span>
          </transition>
        </slot>
        <div class="ImageCompare-image" :style="imageStyle">
          <transition name="tr-fade">
            <img :src="actualLeft.url" :alt="actualLeft.alt" v-if="actualLeft.isShowing">
          </transition>
        </div>
      </div>
      <transition name="tr-fade">
        <span
          class="ImageCompare-tag is-right"
          v-show="hasIntersected"
          v-if="isModeOverlayEnabled"
        >
          {{ isImageOverlayToggled ?  actualRight.tag || 'after' : actualLeft.tag || 'before' }}
        </span>
      </transition>
      <transition name="tr-fade">
        <drag
          :on-drag-start="onDragStart"
          :on-dragging="onDragging"
          class="ImageCompare-grabContainer"
          v-if="!isModeOverlayEnabled"
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
      </transition>
    </div>
    <div class="Toolbar">
      <div class="ToolbarList">
        <div class="ToolbarList-item">
          <button
            class="Toolbar-button"
            title="Hide the toolbars"
            @click.left="isToolbarShowing = !isToolbarShowing"
          >
            <icon-arrow-drop-left
              :class="{ 'is-active': isToolbarShowing }"
              class="Toolbar-icon is-hide"
            >
            </icon-arrow-drop-left>
          </button>
        </div>
        <transition name="tr-toolbar-list">
          <div class="ToolbarList-item" v-if="isToolbarShowing">
            <div
              class="Toolbar-button"
              :title="`Toggles between overlay and drag mode (active: ${isModeOverlayEnabled ? 'overlay' : 'drag'}).`"
              for="toggle-image-compare-mode"
              tabindex="0"
              @click="onToggleModeClick"
            >
              <input
                v-model="isModeOverlayEnabled"
                id="toggle-image-compare-mode"
                type="checkbox"
                style="opacity: 0; pointer-events: none;position: absolute;"
                class="ToolbarToggle-input"
              >
              <div
                class="ToolbarToggle-button"
              >
                <svg class="Toolbar-icon is-dualPane" viewBox="0 0 44 47" xmlns="http://www.w3.org/2000/svg"
                fill="#FFFFFF" fill-rule="evenodd">
                  <g id="dual-pane" stroke="none" stroke-width="1">
                    <rect
                      id="left" style="opacity: 0.4" x="-22" y="0" width="44" height="47">
                    </rect>
                    <rect
                      id="right" style="opacity: 0.20" fill-rule="nonzero" x="22" y="0" width="22" height="47">
                    </rect>
                  </g>
                </svg>
                <!-- <icon-dual-pane
                  class="Toolbar-icon is-dualPane"
                ></icon-dual-pane> -->
              </div>
            </div>
          </div>
        </transition>
        <transition name="tr-toolbar-list">
          <div class="ToolbarList-item" v-if="isToolbarShowing">
            <div class="Toolbar-button" @click.left="showNotice">
              <icon-help
                class="Toolbar-icon is-help"
              ></icon-help>
            </div>
          </div>
        </transition>
      </div>
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
    Overlay: require('@/components/Overlay').default,
    IconHelp: require('@/assets/images/icons/help.svg').default,
    IconSwap: require('@/assets/images/icons/swap.svg').default,
    IconArrowDropLeft: require('@/assets/images/icons/arrow-dropleft.svg').default,
    IconDualPane: require('@/assets/images/icons/dual-pane.svg').default,
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

              this.observer.unobserve(this.$refs.container)
              this.observer.disconnect()
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
      console,
      isOverlayNoticeShowing: false,
      isDragNoticeShowing: false,
      isImageOverlayToggled: false,
      isModeOverlayEnabled: false,
      activeOverlayIndex: 1,
      isToolbarShowing: true,
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
    theme: {
      type: Object,
      default: () => ({
        isToolbarDark: false,
      }),
    },
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
    onToggleModeClick() {
      this.toggleMode()

      if (this.isModeOverlayEnabled) {
        this.showNotice()
      }
    },
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
    toggleMode() {
      this.isModeOverlayEnabled = !this.isModeOverlayEnabled
      this.$nextTick(() => {
        this.$refs.leftContainer.focus()
      })
    },
    showNotice() {
      this.isDragNoticeShowing = false
      this.isOverlayNoticeShowing = false

      if (!this.isModeOverlayEnabled) {
        this.isDragNoticeShowing = true
      } else {
        this.isOverlayNoticeShowing = true
      }

      clearTimeout(this.helpModelTimeout)

      this.helpModelTimeout = setTimeout(() => {

        if (!this.isModeOverlayEnabled) {
          this.isDragNoticeShowing = false
        } else {
          this.isOverlayNoticeShowing = false
        }
      }, 4000)
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
      clearTimeout(this.interactivityId)

      this.interactivityId = setTimeout(() => {
        this.isUserInteracting = false
      }, ACTIVITY_TIMEOUT)
    },
    onActivity() {
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
    imageContainerStyleBefore() {
      const opacity = this.isImageOverlayToggled ? 1 : 0

      return {
        'opacity': this.isModeOverlayEnabled ? opacity : 1,
      }
    },
    imageContainerStyleAfter() {
      const opacity = !this.isImageOverlayToggled ? 1 : 0

      const defaultStyles = {
        'opacity': this.isModeOverlayEnabled ? opacity : 1,
      }

      if (this.isModeOverlayEnabled) {
        return {
          ...defaultStyles,
          height: '100%',
          width: '100%',

        }
      }

      if (this.isMounted) {
        const dim = this.getImageContainerDimensions()

        return {
          ...defaultStyles,
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

.Notice {
  color: rgba(black, 0.6);
  font-size: 14px;
  left: 0;
  line-height: 1.4;
  position: absolute;
  text-align: center;
  top: 20px;
  width: 100%;
  z-index: 100;
  pointer-events: none;
}

.Notice-panel {
  background-color: rgba(white, 0.5);
  border-radius: 3px;
  box-shadow: 0 16px 40px -9px rgba(black, 0.4);
  margin: 0 auto;
  max-width: 100%;
  padding: 10px 20px;
  width: 500px;
  pointer-events: auto;
}

.ImageCompare {
  position: relative;
}

.ImageCompare-aspectFill {
  position: relative;

  &.is-grabbable {
    cursor: grab;
  }
}

.ImageCompare-container {
  height: 100%;
  left: 0;
  outline: 0;
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

.Toolbar {
  left: 0;
  position: absolute;
  top: 0;
  z-index: 10;

  &.is-dark {
    svg {
      fill:rgba(black, 0.3);
    }
  }
}

.ToolbarList {
  display: flex;
}

.ToolbarList-item {
  background-color: transparent;


}

.Toolbar-button {
  @include reset-button;
  background-color: rgba(white, 0.1);
  background-color: transparent;
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 30px;
  width: 30px;

  &:hover {
    background-color: rgba(white, 0.2);
  }
}

.ToolbarToggle-button {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  position: relative;

  rect {
    transition: 300ms;
    transform: none;
  }
}

.ToolbarToggle-input:checked + .ToolbarToggle-button rect {
  transform: translateX(50%);
}

.ToolbarToggle-selection {
  background-color: rgba(white, 0.2);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 300ms;
  width: 50%;
  z-index: -1;
}

.ToolbarToggle-option {
  @include reset-button;
  align-items: center;
  background-color: transparent;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 30px;

  &:hover {
    background-color: rgba(white, 0.3);
  }
}

.Toolbar-icon {
  fill: rgba(white, 0.4);
  filter: drop-shadow(4px 4px 40px);
  transition: transform 300ms;

  &.is-swap {
    width: 20px;
  }

  &.is-hide {
    transform: rotate(180deg);
    width: 20px;

    &.is-active {
      transform: rotate(0deg);
    }
  }

  &.is-dualPane {
    width: 17px;
  }

  &.is-help {
    width: 20px;
  }
}

.tr-toolbar-list-enter-active,
.tr-toolbar-list-leave-active {
  transition: transform 400ms, opacity 400ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.tr-toolbar-list-leave,
.tr-toolbar-list-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.tr-toolbar-list-enter,
.tr-toolbar-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

</style>

<template>
  <div class="LazyLoad" ref="container">
    <div
      :style="{
        'padding-bottom': dimensions == null ? '0%' : `${dimensions.height / dimensions.width * 100}%`,
      }"
      class="LazyLoad-aspectFill"
    >
      <transition name="tr-lazyload">
        <img
          v-show="isLoaded"
          v-if="!background"
          :src="src || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='"
          :alt="alt"
          class="LazyLoad-media is-image"
        >
         <slot
          v-if="background"
          :src="src"
          :url="`url(${src})`"
        >
          <div
            class="LazyLoad-media is-background"
            :style="{ 'background-image': `url(${src})` }"
          ></div>
        </slot>
      </transition>
      <noscript inline-template>
        <!-- Included because SSR -->
        <img :src="src" :alt="alt" class="LazyLoad-media is-image">
      </noscript>
    </div>
  </div>
</template>

<script>
import * as utils from '@/core/utils'

if (process.env.isClient) {
  require('intersection-observer')
}

export default {
  mounted() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          utils.preloadImage(this.src)
            .then(({ img }) => {
              this.realDimensions = {
                width: img.naturalWidth,
                height: img.naturalHeight,
              }

              this.isLoaded = true
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
  },
  props: {
    background: {
      type: Boolean,
      default: false,
    },
    alt: String,
    src: {
      type: String,
      required: true,
    },
    size: {
      validator(value) {
        return value == null || (value && Number.isFinite(value.width) && Number.isFinite(value.height))
      },
    },
    transition: Object,
  },
  data() {
    return {
      realDimensions: null,
      isLoaded: false,
    }
  },
  computed: {
    dimensions() {
      if (this.realDimensions) {
        return this.realDimensions
      }

      return this.size
    }
  },
}
</script>

<style lang="scss" scoped>

.tr-lazyload-enter-active,
.tr-lazyload-leave-active {
  transition: opacity 500ms;
}

.tr-lazyload-leave,
.tr-lazyload-enter-to {
  opacity: 1;
}

.tr-lazyload-enter,
.tr-lazyload-leave-to {
  opacity: 0;
}



.LazyLoad {
  position: relative;
}

.LazyLoad-aspectFill,
.LazyLoad-media {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>

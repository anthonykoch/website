<template>
  <div ref="container"><slot></slot></div>
</template>

<script>
export default {
  destroyed() {
    window.removeEventListener('click', this.onWindowClick)
  },
  mounted() {
    window.addEventListener('click', this.onWindowClick)
  },
  props: {
    images: {
      type: [Function, Boolean],
    },
  },
  methods: {
    defaultCheck(image) {
      const isAllowedFullscreen =
        image.classList.contains('is-allowedFullscreen') ||
        image.previousElementSibling.hasAttribute('data-allow-fullscreen')

      return isAllowedFullscreen && this.isContained(image)
    },
    isContained(el) {
      return this.$refs.container && this.$refs.container.contains(el)
    },
    onWindowClick(e) {
      const { images = this.defaultCheck } = this

      if (images === true || (typeof images === 'function' && images(e.target))) {
        this.showFullscreenImage(e.target)
      }
    },
    allowsFullscreen(image) {
      return (
        image.hasAttribute('data-allow-fullscreen') ||
        (image.previousElementSibling && image.previousElementSibling.hasAttribute('data-allow-fullscreen'))
      )
    },
    getAttributes(image) {
      const previousDataset =
        image.previousElementSibling && image.previousElementSibling.hasAttribute('data-allow-fullscreen')
          ? image.previousElementSibling.dataset
          : {}

      return {
        sizes: image.dataset.sizes || previousDataset.sizes,
        srcset: image.dataset.srcset || previousDataset.srcset,
        style: image.dataset.style || previousDataset.style || { 'max-height': '97vh' },
      }
    },
    showFullscreenImage(image, force = false) {
      if (force || this.allowsFullscreen(image)) {
        const attributes = this.getAttributes(image)

        this.$store.dispatch('fullscreenImage/setImage', {
          attributes: {
            src: image.src,
            alt: image.alt,
            ...attributes,
          },
        });
      }
    },
  },
}
</script>


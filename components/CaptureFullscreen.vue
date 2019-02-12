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
    getSettingsData(image) {
      console.log(this.allowsFullscreen(image));

      const previousDataset =
        image.previousElementSibling && image.previousElementSibling.hasAttribute('data-allow-fullscreen')
          ? image.previousElementSibling.dataset
          : {}

      return {
        maxWidth: image.dataset.maxWidth || previousDataset.maxWidth,
      }
    },
    showFullscreenImage(image, force = false) {
      if (force || this.allowsFullscreen(image)) {
        const settings = this.getSettingsData(image)

        this.$store.dispatch('fullscreenImage/setImage', {
          src: image.src,
          alt: image.alt,
          ...settings,
        });
      }
    },
  },
}
</script>


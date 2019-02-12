<template>
  <div
    @pointerdown="startDrag"
    ref="container"
    class="container"
  >
    <slot></slot>
  </div>
</template>

<script>
// TODO: Implement mobile touch events https://www.npmjs.com/package/pepjs
export default {
  name: 'drag',
  props: {
    which: {
      type: Array,
      default: () => [1],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    onDragStart: Function,
    onDragging: Function,
    onDragEnd: Function,
  },
  methods: {
    startDrag(e) {
      if (!this.enabled || !this.which.includes(e.which)) {
        return
      }

      this.start = {
        x: e.clientX,
        y: e.clientY,
      }

      this.isDragging = true
      this.onDragStart && this.onDragStart(this.start)
      e.preventDefault()

      this.$refs.container.addEventListener('pointermove', this.onWindowMouseMove)
      window.addEventListener('pointerup', this.onWindowMouseUp)
    },
    stopDrag(e) {
      this.onDragEnd && this.onDragEnd(e, {
          x: e.clientX,
          y: e.clientY,
        }, this.start)

      this.isDragging = false
      this.$refs.container.removeEventListener('pointermove', this.onWindowMouseMove)
    },
    onWindowMouseUp(e) {
      this.stopDrag(e)
    },
    onWindowMouseMove(e) {
      this.onDragging && this.onDragging(e, {
          x: e.clientX - this.start.x,
          y: e.clientY - this.start.y,
        }, this.start)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  touch-action: pan-y;
}
</style>

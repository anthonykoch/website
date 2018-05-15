<template>
  <!-- TODO: See if page is a thing that can be done -->
  <!-- TODO: Make hero into a component -->
  <div class="Hero">
    <div>
      <div class="Hero__caption" v-if="$slots.caption">
        <slot name="caption"></slot>
      </div>

      <div class="Hero__description" v-if="$slots.description">
        <slot name="description"></slot>
      </div>
    </div>

    <div slot="social"></div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
};
</script>

<style>

</style>

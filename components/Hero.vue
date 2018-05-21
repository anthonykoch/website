<template>
  <div class="Hero">
    <div>
      <div class="Hero__caption" v-if="$slots.caption">
        <slot name="caption"></slot>
      </div>

      <div class="Hero__description" v-if="$slots.description">
        <slot name="description"></slot>
      </div>
    </div>

    <slot name="social"></slot>
  </div>
</template>

<script>
export default {
  name: 'Hero',
};
</script>

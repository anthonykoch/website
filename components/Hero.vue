<template>
  <div class="Hero u-siteWrapper u-px5">
    <div class="">
      <div class="Hero__caption" v-if="$slots.caption">
        <slot name="caption"></slot>
      </div>

      <div class="Hero__description" v-if="$slots.description">
        <slot name="description"></slot>
      </div>
      <slot name="social"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
};
</script>

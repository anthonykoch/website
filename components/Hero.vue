<template>
  <div class="Hero u-siteWrapper u-px5">
    <div>
      <div class="Hero__caption" v-if="$slots.heroCaption">
        <slot name="heroCaption"></slot>
      </div>

      <div class="Hero__description" v-if="$slots.heroDescription">
        <slot name="heroDescription"></slot>
      </div>
      <slot name="heroLower"></slot>
      <slot name="heroSocial"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
};
</script>

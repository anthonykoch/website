<template>
  <div>
    <slot name="heroBefore"></slot>
    <div class="u-siteWrapper">
      <div
        class="Hero"
        :class="{
          'Container is-smallWidth u-mxauto u-gutter': isSmallWidth,
          'u-px5@sm u-gutter': !isSmallWidth,
        }"
      >
        <div>
          <div class="Hero-caption [ Heading is-type2 ]" v-if="$slots.heroCaption">
            <slot name="heroCaption"></slot>
          </div>

          <div class="Hero-description" v-if="$slots.heroDescription">
            <slot name="heroDescription"></slot>
          </div>
          <slot name="heroLower"></slot>
          <slot name="heroSocial"></slot>
        </div>
      </div>
    </div>
    <slot name="heroAfter"></slot>
  </div>
</template>

<script>
export default {
  name: 'Hero',

  props: {
    isSmallWidth: {
      type: Boolean,
      default: false,
    },
  },

};
</script>

<template>
  <ul class="IconList  u-line-height-0">
    <li v-for="item in social" class="IconList__item">
      <a
        :href="item.href"
        :title="item.title"
        class="IconList__link"
      >
        <svg class="svg-icon">
          <use :xlink:href="'#' + item.icon.class"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SocialIcons',

  props: {
    social: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>

</style>

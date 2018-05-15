<template>
  <footer class="SiteFooter">
    <app-social-icons :social="social"></app-social-icons>
  </footer>
</template>

<script>
export default {
  props: {
    social: {
      type: Array,
      required: true,
    },
  },
};
</script>

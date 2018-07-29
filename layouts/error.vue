<template>
  <page
    :showFooter="false"
    :showSocial="false"
    :theme="theme"
  >
    <div slot="heroLower">
      <div class="[ Heading is-type2 ] u-textCenter u-mb4">
        <p style="font-size: 2rem">
          Welp, this page doesn't exist.
        <a
          class="Link is-light  u-block u-inlineBlock@sm"
          href="/"
          style="font-size: 2rem"
        >
          Go back home<span class="u-letterSpacing0">?</span>
        </a>
        </p>
      </div>
      <div class="u-textCenter">
        <div>
          <app-social-icons></app-social-icons>
        </div>
      </div>
    </div>
    <slot></slot>
  </page>
</template>

<script>
export default {
  components: {
    page: require('@/layouts/main.vue').default,
  },

  data() {
    return {
      theme: {
        siteHeader: {
          isFullHeight: true,
        },
      },
    };
  },
}
</script>


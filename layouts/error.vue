<template>
  <page
    :showFullHeightHeader="true"
    :showFooter="false"
    :showSocial="false"
  >
    <div slot="heroLower">
      <div class="Title Title--alternate u-textCenter">
        <p style="font-size: 2rem" class="u-mb">
          Welp, this page doesn't exist.
        <a
          class="Link Link--light Link--underline  u-mb4"
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
  </page>
</template>

<script>
import page from '@/layouts/main.vue';

export default {
  components: {
    page,
  },
}
</script>


<template>
  <div>
    <app-site-header :background="backgroundStyles"
    >
      <app-hero
        slot="lower"
        :social="$store.getters['social/getMediaItems']"
      >
        <div slot="caption">Work</div>
        <div slot="description">
          A small selection of my past works.
        </div>
      </app-hero>
    </app-site-header>

    <div class="u-flex u-justify-center u-items-center">
      <div class="u-6of12">
        <router-link :to="{ name: 'work-plaid' }">
          <img
            src="~/assets/images/logos/plaid-horizontal.svg"
            alt="plaid technologies inc."
            width="250px"
          >
        </router-link>
      </div>
      <div class="u-6of12">
        <router-link :to="{ name: 'work-modern-fertility' }">
          <img
            src="~/assets/images/logos/mf-vertical-lockup.svg"
            alt="modern fertility"
            width="235px"
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {



};
</script>

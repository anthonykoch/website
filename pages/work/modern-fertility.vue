<template>
  <div>

    <app-site-header :background="backgroundStyles"
    >
      <app-hero
        slot="lower"
        :social="$store.getters['social/getMediaItems']"
      >
        <div slot="caption">Modern Fertility</div> - a case study
        <div slot="description">

        </div>
      </app-hero>
    </app-site-header>

    <div class="row">
      <div class="Band Band--small">
        <img src="~/assets/images/logos/mf-m.svg" alt="" width="200px">
      </div>
    </div>
  </div>

</template>

<script>
export default {

  computed: {
    backgroundStyles() {
      return {
        backgroundImage: `url(${require('~/assets/images/logos/mf-m.svg')})`,
        // backgroundColor: 'transparent',
      }
    },
  },

};
</script>

<style lang="scss"></style>

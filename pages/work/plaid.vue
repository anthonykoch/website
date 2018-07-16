<template>
  <div>

    <app-site-header :background="backgroundStyles"
    >
      <app-hero
        slot="lower"
        :social="$store.getters['social/getMediaItems']"
      >
        <div slot="caption">A sample of my works for</div>
        <div slot="description">

        </div>
      </app-hero>
    </app-site-header>

    <div class="row" style="max-width: 960px">
      <div class="Band Band--small">

        <div class="u-flex">
          <div class="u-size3of12">
            <div>
              <img
                src="~/assets/images/logos/plaid-horizontal.svg"
                alt="plaid technologies inc."
                style="margin-bottom: 2rem"
                width="200px"
              >
            </div>
            <p>
              <b>Role:</b> Front-end Developer
            </p>
          </div>
          <div class="u-size9of12">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque harum ipsum dolor iusto, quae, magnam cumque optio? Nesciunt eligendi magni esse incidunt laboriosam expedita asperiores dolore corrupti perferendis. Ipsa, recusandae!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit hic rerum libero officia, placeat facere eius distinctio labore recusandae fuga, explicabo alias nulla, repellat minus. Repellendus ipsa, repudiandae, quo voluptatum deleniti libero minus eligendi neque rem. Temporibus incidunt quia in?
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque tenetur adipisci illum necessitatibus libero harum voluptates quos facilis nemo aspernatur a magni veritatis voluptatibus deleniti accusantium quam perferendis, praesentium magnam.
            </p>
          </div>
          <div class="u-size12of12">
            <h2 class="Title">From blank canvas to completed page</h2>
            <p>
              This is a sample of pages I developed from a blank canvas to completion.
            </p>
          </div>
          <div class="u-size12of12">
            <figure>
              <figcaption>Pricing</figcaption>
              <img src="http://localhost:3020/plaid/screenshots/june 19 2018/pricing.png" alt="">
            </figure>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
export default {

  computed: {
    backgroundStyles() {
      return {
        backgroundImage: `url(${require('~/assets/images/logos/plaid-vertical-white.svg')})`,
        backgroundPosition: '90% 200px',
        backgroundSize: '500px',
        backgroundSize: '800px auto',

        // backgroundColor: 'transparent',
      }
    },
  },

};
</script>

<style lang="scss"></style>

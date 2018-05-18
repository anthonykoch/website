<template>
  <div>
    <!-- <app-site-header>
      <app-hero
        slot="lower"
      >
        <div slot="caption">My writings</div>
        <div slot="description">
          These are my various writings, mostly on topics surrounding front-end development.
        </div>
        <app-social-icons
          slot="social"
          :social="$store.getters['social/getMediaItems']"
        ></app-social-icons>
      </app-hero>
    </app-site-header> -->

    <!-- <section class="Band">
      <div class="row row--readable">
        <ul class="PostList">
          <li class="PostList__item" v-for="post in posts">
            <app-post-preview :post="post"></app-post-preview>
          </li>
        </ul>
      </div>
    </section> -->

    <!-- <app-site-footer></app-site-footer> -->
  </div>
</template>

<script>
export default {
  components: {
    AppPostPreview: require('@/components/PostPreview').default,
    AppHero: require('@/components/Hero').default,
    AppSiteHeader: require('@/components/SiteHeader').default,
    AppSiteFooter: require('@/components/SiteFooter').default,
  },
};
</script>

<template>
    <header
      :style="background"
      :class="{ 'has-default-background': background == null }"
      class="SiteHeader"
      role="banner"
      data-page="TODO"
    >
      <div class="SiteHeader__container">
        <div class="Logo">
          <nuxt-link
            active-class="is-active"
            exact
            to="/"
            class="Logo__link u-px6"
          >
            <span>Anthony </span>
            <span>Koch</span>
          </nuxt-link>
        </div>

        <nav class="SiteNav" role="navigation">
          <ul class="SiteNav__list">
            <li
               v-for="(link, index) of $store.state.navigation.links"
              class="SiteNav__list__item"
              :key="index"
            >
              <!-- TODO: Active blog link should be active if -->
              <nuxt-link
                active-class="is-active"
                :to="link.href"
                class="SiteNav__list__item__link"
              >
                {{ link.text }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="SiteHeader__lower">
        <slot name="lower"></slot>
      </div>
    </header>
</template>

<script>
export default {
  props: {
    background: {
      type: Object,
    },
  },
};
</script>

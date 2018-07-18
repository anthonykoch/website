<template>
    <header
      :style="background"
      :class="{
        'has-dark-background': hasDarkbackground,
        'is-collapsed': isCollapsed,
        'is-fullHeight': fullHeight,
      }"
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
            :class="{
              'is-dark': hasDarkLinks,
              'is-fixed': isLogoFixed,
              'is-active': forceLogoActiveClass,
            }"
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
                :active-class="siteNavLinkActiveClass"
                :to="link.href"
                :class="{
                  'is-dark': hasDarkLinks,
                }"
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
    hasDarkbackground: {
      type: Boolean,
      default: true,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    allowNavLinkActiveClass: {
      type: Boolean,
      default: false,
    },
    forceLogoActiveClass: {
      type: Boolean,
      default: false,
    },
    isLogoFixed: {
      type: Boolean,
      default: false,
    },
    hasDarkLinks: {
      type: Boolean,
      default: false,
    },
    background: {
      type: Object,
    },
    fullHeight: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    siteNavLinkActiveClass() {
      return this.allowNavLinkActiveClass ? 'is-active' : null;
    },
  },
};
</script>

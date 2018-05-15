<template>
  <div class="site-header-wrapper" data-page="TODO">
    <header class="SiteHeader" role="banner">
      <div class="SiteHeader__container">

        <div class="Logo">
          <nuxt-link
            active-class="is-active"
            exact
            to="/"
            class="Logo__link"
          >
            <span>Anthony</span>
            <span>Koch</span>
          </nuxt-link>
        </div>

        <nav class="SiteNav" role="navigation">
          <ul class="SiteNav__list">
            <li
               v-for="link of $store.state.navigation.links"
              class="SiteNav__list__item"
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

      <slot name="lower"></slot>
    </header>
  </div>
</template>

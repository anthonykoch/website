<template>
    <header
      :class="{
        'has-darkBackground': hasDarkbackground,
        'has-blogBackground': hasBlogBackground,
        'is-collapsed': isCollapsed,
        'is-fullHeight': isFullHeight,
        'is-floating': isFloating,
      }"
      class="SiteHeader"
      role="banner"
      data-page="TODO"
    >
      <div class="SiteHeader-container">
        <div class="Logo">
          <nuxt-link
            active-class="is-active"
            exact
            to="/"
            class="Logo-link u-px6"
            :class="{
              'is-light': hasLightLinks,
              'is-fixed': isLogoFixed,
              'is-active': forceLogoActiveClass,
            }"
          >
            <span>Anthony </span>
            <span>Koch</span>
          </nuxt-link>
        </div>

        <nav class="SiteNav" role="navigation">
          <ul class="SiteNav-list">
            <li
              v-for="(link, index) of $store.state.navigation.links"
              class="SiteNav-listItem"
              :key="index"
            >
              <nuxt-link
                v-scroll-to="link.scrollTo"
                :active-class="siteNavLinkActiveClass"
                :to="link.href"
                :class="{
                  'is-light': hasLightLinks,
                }"
                class="SiteNav-link"
              >
                {{ link.text }}
              </nuxt-link>
            </li>
            <li
              class="SiteNav-listItem has-icon"
            >
              <a
                :class="{
                  'is-dark': hasLightLinks,
                }"
                href="https://github.com/anthonykoch?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                class="SiteNav-iconLink is-github"
              >
                <icon-octocat style="margin-top: -1px; fill: rgba(255, 255, 255, 0.8)"></icon-octocat>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="SiteHeader-lower">
        <slot name="lower"></slot>
      </div>
    </header>
</template>

<script>

export default {
  props: {
    background: {
      type: Object,
      default() {
        return {};
      },
    },
    hasBlogBackground: {
      type: Boolean,
      default: true,
    },
    hasDarkbackground: {
      type: Boolean,
      default: true,
    },
    isFloating: {
      type: Boolean,
      default: false,
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
    hasLightLinks: {
      type: Boolean,
      default: false,
    },
    isFullHeight: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconOctocat: require('@/assets/images/icons/octocat.svg').default,
  },
  computed: {
    siteNavLinkActiveClass() {
      return this.allowNavLinkActiveClass ? 'is-active' : null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/bootstrap';

@mixin site-nav-link {
  $padding-v: $app-site-nav-link-padding-v;
  border-top: $app-site-nav-link-border-width solid transparent;
  display: block;
  filter: drop-shadow(3px 4px 7px rgba(black, 0.2));
  font-family: $app-site-nav-link-font-family;
  font-size: rem(15px);
  font-weight: 600;
  padding: calc(#{$padding-v} - #{$app-site-nav-link-border-width}) $app-site-nav-link-padding-h $padding-v;
  text-transform: uppercase;
  transition: background-color, color;
  transition-duration: $app-transition-duration;

  &:link,
  &:visited {
    color: #dddddd;
  }

  &:hover,
  &:active,
  &.is-active {
    color: #333333;
    background: $app-site-nav-link-background--active;
    border-color: white;
    // color: $app-site-nav-link-foreground--active
  }
}





.Logo {
  font-size: rem(14px);
  letter-spacing: rem(4px);
  width: $app-logo-width;
}

.Logo-link {
  @include site-nav-link;
  display: inline-block;
}




.SiteNav {
  flex: 1;
  text-align: right;
}

.SiteNav-list {
  align-items: center;
  display: inline-flex;
}

.SiteNav-link {
  @include site-nav-link;
  letter-spacing: rem(2px);
}

.SiteNav-iconLink {
  align-items: center;
  display: flex;
  padding: 0.5rem;

  &.is-github {
    max-width: 4.5rem;

    svg {
      width: rem(22px);
      margin: 0 auto;
    }
  }

  &.is-dark {
    svg {
      fill: $app-site-nav-link-foreground;
    }
  }
}



.SiteHeader {
  // 1. Just enough to make the header a uniform height throughout all pages.
  min-height: rem(500px); // [1]
  position: relative;
  transition: all 300ms;
  width: 100%;
  z-index: $app-layer-site-header;

  &.is-collapsed {
    min-height: 0;
  }

  &.is-floating {
    left: 0;
    position: absolute;
    top: 0;
  }

  &.has-darkBackground {
    &:before {
      @include absolute-fill;
      content: '';
      z-index: -1;
    }
  }

  &.has-darkBackground {
    background-color: $app-site-header-background;

    &:before {
      background-attachment: fixed;
      background-image: url('~assets/images/background-1+c.jpg');
      background-position: 100% 80%;
      background-size: cover;
      opacity: 0.12;
    }

    &.is-fullHeight {
      min-height: 100vh;
    }
  }
}


.SiteHeader-inner {
  padding: 0 0 3rem 0;
  position: relative;
  width: 100%;
  z-index: $app-layer-site-header;
}

.SiteHeader-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  position: relative;
  width: 100%;
}


@include app-breakpoint-min(lg) {
  .Logo-link {
    &.is-fixed {
      position: fixed;
    }
  }
}





//
// Breaks the site navigation and "logo" onto two separate lines.
// The breakpoint is targeted for the point at which the site nav
// and logo layouts start breaking.
//
@media (max-width: 730px){
  .SiteHeader {
    &.has-darkBackground {
      &:before {
        background-position: 80% 50%;
        background-size: cover;
        // background-position: 100% 100%
      }
    }
  }

  .SiteHeader-container {
    display: block;
  }

  .Logo,
  .Logo-link {
    width: 100%;
  }

  .Logo-link {
    &:link,
    &:visited {
      background: $app-site-nav-link-background--active;
      color: $app-site-nav-link-foreground--active;
    }
  }

  .Logo,
  .SiteNav {
    padding-left: 0;
    text-align: center;
  }

  .SiteNav-list {
    display: flex;
  }

  .SiteNav-listItem {
    flex: 1;
    text-align: center;
    margin: 0;

    &.has-icon {
      max-width: 4rem;
    }
  }

  .Logo-link,
  .SiteNav-link {
    padding-left: 0;
    padding-right: 0;
  }

  .SiteNav-link {
    padding-bottom: 10px;
    padding-top: 10px;
  }
}

</style>

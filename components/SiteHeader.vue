<template>
    <header
      :class="{
        'has-darkBackground': background === 'dark',
        'has-defaultBackground': background === 'default',
        'has-imageBackground': background === 'image',
        'is-collapsed': isCollapsed,
        'is-fullHeight': isFullHeight,
        'is-floating': isFloating,
      }"
      class="SiteHeader"
      role="banner"
      data-page="TODO"
    >
      <div class="SiteHeader-background"></div>
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
            <li class="SiteNav-listItem">
              <nuxt-link
                to="/#work"
                :class="{ 'is-light': hasLightLinks }"
                class="SiteNav-link"
                @click.native="onWorkClick"
              >
                Work
              </nuxt-link>
            </li>
            <li class="SiteNav-listItem">
              <nuxt-link
                active-class="/blog"
                to="/blog"
                :class="{ 'is-light': hasLightLinks }"
                class="SiteNav-link"
              >
                Blog
              </nuxt-link>
            </li>
            <li class="SiteNav-listItem">
              <nuxt-link
                active-class="/contact"
                to="/contact"
                :class="{ 'is-light': hasLightLinks }"
                class="SiteNav-link"
              >
                Contact
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
                <icon-octocat style="margin-top: -1px;"></icon-octocat>
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
  components: {
    IconOctocat: require('@/assets/images/icons/octocat.svg').default,
  },
  props: {
    background: {
      type: String,
      default: 'default',
      validator(value) {
        return ['background', 'default', 'image', 'none'].includes(value)
      },
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
  methods: {
    onWorkClick(e) {
      if (window.location.pathname === '/') {
        e.preventDefault()
        this.$scrollTo('#work')
      }
    },
  },
  computed: {
    siteNavLinkActiveClass() {
      return this.allowNavLinkActiveClass ? 'is-active' : null
    },
  },
}
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
    max-width: 100%;
    width: 54px;

    svg {
      fill: rgba(255, 255, 255, 0.8);
      margin: 0 auto;
      width: rem(22px);
    }

    &:hover {
      svg {
        fill: $app-color-1;
      }
    }
  }

  &.is-dark {
    &.is-github {
      svg {
        fill: $app-site-nav-link-foreground;
      }
    }
  }
}



.SiteHeader {
  min-height: rem($app-site-header-height-mobile);
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
    .SiteHeader-background {
      background-color: $app-site-header-background;
    }
  }

  &.has-defaultBackground {
    background-color: $app-site-header-background;

    .SiteHeader-background {
      background-attachment: fixed;
      background-size: cover;
      background-image: url('~assets/images/mobile-header@2x.png');
      background-position: 70% 50px;
      opacity: 0.4;
      /* opacity: 0.12; */
    }
  }

  &.is-fullHeight {
    min-height: 100vh;
  }
}

.SiteHeader-background {
  @include absolute-fill;
  background-size: cover;
  z-index: -1;
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


@include app-breakpoint-min(sm) {
  .Logo-link {
    &.is-fixed {
      position: fixed;
    }
  }
}

@include app-breakpoint-min(md) {
  .SiteHeader {
    min-height: rem($app-site-header-height);

    &.has-defaultBackground {
      .SiteHeader-background {
        background-image: url('~assets/images/background-1+c.jpg');
        background-position: 90% -260px;
      }
    }
  }
}

@include app-breakpoint-min(xlg) {
  .SiteHeader {
    min-height: rem($app-site-header-height);

    &.has-defaultBackground {
      .SiteHeader-background {
        background-position: 85% -300px;
      }
    }
  }
}

@media (min-width: 1600px) {
  .SiteHeader {
    min-height: rem($app-site-header-height);

    &.has-defaultBackground {
      .SiteHeader-background {
        background-position: 85% -420px;
      }
    }
  }
}

@media (max-width: 730px){
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

<!--<style lang="scss">
@import '../assets/styles/bootstrap';

@include app-breakpoint-min(xsm) {
/* @media (min-width: 300px) { */
  body {
    background-color: red !important;
  }
}
</style>-->

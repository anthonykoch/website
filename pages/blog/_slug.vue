
<template>
  <page
    :showSocial="false"
    :theme="theme"
  >
    <blog-toolbar slot="before" :top="top"></blog-toolbar>

    <article class="Post" id="post">
      <div class="Post-container">
        <div class="Post-headerBackground">
          <transition name="tr-fade">
            <header
              ref="header"
              v-if="meta && meta.title"
              class="Post-header u-gutter"
              style="transition-delay: 1s"
            >
              <h1 class="Post-title">
                <a :href="$route.path">
                  {{ meta.title }}
                </a>
              </h1>
              <div class="u-mxauto">
                <p class="PostMeta">
                  <span class="PostMeta-date">
                    {{ meta.humanized.created_at }}
                  </span>
                  <span class="PostMeta-author">
                    by Anthony Koch
                  </span>
                </p>
              </div>
            </header>
          </transition>
        </div>
        <div class="Post-content">
          <capture-fullscreen :images="true">
            <Component
              :is="body"
              @mount="console.log('lol')"
              ref="body"
              class="Post-body md"
              style="animation-delay: 0.3s"
            ></Component>
          </capture-fullscreen>
          <div class="u-gutter">
            <div class="Meme" v-if="body">
              <nuxt-link class="Meme-item is-left" v-if="next" :to="next.url">
                <icon-arrow-round-left class="Meme-arrow is-left"></icon-arrow-round-left>
                <p>{{ next.title }}</p>
              </nuxt-link>
              <nuxt-link class="Meme-item is-right" v-if="previous" :to="previous.url">
                <p>{{ previous.title }}</p>
                <icon-arrow-round-right class="Meme-arrow is-right"></icon-arrow-round-right>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </article>
  </page>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import TabbedImageCompare from '@/components/TabbedImageCompare.vue'

import * as api from "@/core/api"

const VISIBILITY_OFFSET = 1200

export default {
  async asyncData({ params, error, store: $store }) {
    await $store.dispatch('posts/loadAllMeta')

    return {
      slug: params.slug,
    }
  },
  components: {
    IconArrowRoundRight: require('@/assets/images/icons/arrow-round-right.svg').default,
    IconArrowRoundLeft: require('@/assets/images/icons/arrow-round-left.svg').default,
    page: require('@/layouts/main').default,
    CaptureFullscreen: require('@/components/CaptureFullscreen').default,
    BlogToolbar: require('@/components/BlogToolbar').default,
    IconGithub: require('@/assets/images/icons/octocat.svg').default,
  },
  head() {
    let attrs = {}

    if (this.meta) {
      return attrs = {
        ...attrs,
        title: this.meta.title,
      }
    }

    return attrs
  },
  data() {
    return {
      top: null,
      theme: {
        siteHeader: {
          isFloating: true,
          isCollapsed: true,
          isLogoFixed: false,
          allowNavLinkActiveClass: false,
          background: 'none',
          hasDarkLinks: false,
          forceLogoActiveClass: true,
        },
      },
    };
  },
  computed: {
    ...mapState({
      allMeta: state => state.posts.allMeta,
    }),
    skipText() {
      return this.meta.skip && this.meta.skip.text ? this.meta.skip.text : "Skip the backstory"
    },
    metaIndex() {
      return this.allMeta.findIndex((meta) => meta.slug === this.slug)
    },
    meta() {
      return this.allMeta.find((meta) => meta.slug === this.slug)
    },
    next() {
      return this.allMeta[this.metaIndex + 1]
    },
    previous() {
      return this.allMeta[this.metaIndex - 1]
    },
  },
  methods: {
    getToolbarOffset() {
      const offsetTop =
        this.$refs.header.getBoundingClientRect().top
        + this.$refs.header.offsetHeight
        + document.body.scrollTop
        + VISIBILITY_OFFSET;

      return offsetTop
    },
  },
  beforeCreate() {
    this.imports = {
      body: api.getPost(this.$route.params.slug),
    }

    this.body = () => this.imports.body
  },
  mounted() {
    this.top = this.getToolbarOffset()

    this.imports.body.then(() => {
      this.$nextTick(() => {
        // TODO: Turn this functionality into a component
        const links = [...this.$refs.body.$el.querySelectorAll('a')];

        links.forEach((link) => {
          if (link.host !== window.location.host && link.hash.trim() === '') {
            link.setAttribute('rel', 'noreferrer noopener');
            link.setAttribute('target', '_blank');
          }
        })
      })

    })
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/bootstrap';

.Post-content {
  background-color: hsla(0, 0%, 98%, 1);
  min-height: 100vh;
}

.Meme {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  margin: 0 auto;
  max-width: 640px;
  padding-bottom: 40px;
}

.Meme-item {
  align-items: center;
  background-size: cover;
  background-color: $app-color-4;
  /* border: 2px solid #f7bc0d; */
  /* border-radius: 3px; */
  box-shadow: 0 24px 60px -9px rgba(black, 0.2);
  display: flex;
  font-family: $app-font-family-1;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.4;
  justify-content: center;
  padding: 16px 20px;
  transition: color 300ms, background-color 300ms;
  position: relative;
  z-index: 1;

  &:link,
  &:visited {
    fill: currentColor;
    color: inherit;
    color: white;
  }

  &:hover {
    background-color: $app-color-1;
    color: inherit;
  }

  p {
    flex: 1;
    position: relative;
  }
}

.Meme-arrow {
  fill: inherit;
  width: 28px;

  &.is-right {
    margin-left: 8px;
  }

  &.is-left {
    margin-right: 8px;
  }
}

@include app-breakpoint-min(md) {
  .Meme {
    grid-template-columns: 1fr 1fr;
    padding-bottom: 60px;
    padding-top: 60px;
  }
}

</style>


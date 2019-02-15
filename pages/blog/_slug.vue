
<template>
  <page
    :showSocial="false"
    :theme="theme"
  >
    <!--<aside class="Sidebar" slot="sidebar">
      <div class="Sidebar-inner">
        <nuxt-link :to="next.url" class="SidebarButton u-mb3" v-if="next">
          <span class="SidebarButton-upper">Next:</span>
          <span class="SidebarButton-lower">{{ next.title }}</span>
        </nuxt-link>

        <nuxt-link :to="previous.url" class="SidebarButton u-mb3" v-if="previous">
          <span class="SidebarButton-upper">Previous:</span>
          <span class="SidebarButton-lower">{{ previous.title }}</span>
        </nuxt-link>

        <div class="Sidebar-footer  u-textCenter">
          <div class="u-py4 u-px3" v-if="meta.skip">
            <a
              :href="meta.skip.section"
              title="Skip the back story and get to the meat and potatoes"
              class="Button has-lightBackground is-sizeSmall u-block u-w600"
              v-scroll-to="meta.skip.section"
            >
              {{ skipText }}
            </a>
          </div>

          <app-social-icons></app-social-icons>
        </div>
      </div>
    </aside>-->

    <blog-toolbar slot="before" :top="top"></blog-toolbar>

    <article class="Post" id="post" ref="post">
      <div class="Post__container">
        <div class="Post-background">
          <header class="Post-header u-gutter" ref="header">
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
        </div>
        <capture-fullscreen :images="true" >
          <component
            :is="content"
            v-if="content"
            ref="body"
            class="Post-body md"
            style="animation-delay: 0.3s"
          ></component>
        </capture-fullscreen>
      </div>
    </article>
  </page>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex';

import * as api from "@/core/api";

const VISIBILITY_OFFSET = 1200;

export default {
  async asyncData({ params, error, store: $store }) {
    await $store.dispatch('posts/loadMeta');

    return {
      slug: params.slug,
    }
  },

  components: {
    page: require('@/layouts/main').default,
    CaptureFullscreen: require('@/components/CaptureFullscreen').default,
    BlogToolbar: require('@/components/BlogToolbar').default,
  },

  head() {
    return {
      title: this.meta.title,
    };
  },

  data() {
    return {
      theme: {
        siteHeader: {
          isFloating: true,
          isCollapsed: true,
          isLogoFixed: false,
          allowNavLinkActiveClass: false,
          hasDarkbackground: false,
          hasDarkLinks: false,
          forceLogoActiveClass: true,
        },
      },
    };
  },
  computed: {
    ...mapState({
      allMeta: state => state.posts.meta,
    }),
    top() {
      if (this.$refs.header == null) {
        return null
      }

      const offsetTop =
        this.$refs.header.getBoundingClientRect().top
        + this.$refs.header.offsetHeight
        + document.body.scrollTop
        + VISIBILITY_OFFSET;

      return offsetTop
    },
    skipText() {
      return this.meta.skip && this.meta.skip.text ? this.meta.skip.text : "Skip the backstory"
    },
    metaIndex() {
      return this.allMeta.findIndex((meta) => meta.slug === this.slug)
    },
    meta() {
      return this.allMeta.find((meta) => meta.slug === this.slug)
    },
    content() {
      // HACK: asyncData gives a max stack exceeded error when passing a component
      return () => import(`@/_posts/${this.meta.importBasename}.md`)
    },
    next() {
      return this.allMeta[this.metaIndex + 1]
    },
    previous() {
      return this.allMeta[this.metaIndex - 1]
    },
  },

  async mounted() {
    await this.content()

    // TODO: Turn this functionality into a component
    const links = [...this.$refs.post.querySelectorAll('a')];

    links.forEach((link) => {
      if (link.host !== window.location.host) {
        link.setAttribute('rel', 'noreferrer noopener');
        link.setAttribute('target', '_blank');
      }
    });

    // const images = this.images = [...this.$refs.post.querySelectorAll('img')];

    // images.forEach((image) => {
    //   image.classList.add('Image');
    //   image.classList.add('is-allowedFullscreen');
    //   image.addEventListener('click', this.onImageClick);
    // });
  },
};
</script>

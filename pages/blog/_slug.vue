
<template>
  <page
    :showSocial="false"
    :showFooter="false"
    :theme="theme"
  >

    <div class="Sidebar" slot="sidebar">
      <div class="Sidebar-inner">
        <a :href="next.url" class="SidebarButton u-mb3" v-if="next">
          <span class="SidebarButton-upper">Next:</span>
          <span class="SidebarButton-lower">{{ next.title }}</span>
        </a>

        <a :href="previous.url" class="SidebarButton u-mb3" v-if="previous">
          <span class="SidebarButton-upper">Previous:</span>
          <span class="SidebarButton-lower">{{ previous.title }}</span>
        </a>

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
    </div>

    <div slot="before" class="BlogToolbar">
      <div
        :style="{ opacity: isBlogToolbarVisible ? 1 : 0 }"
        style="transition: opacity 300ms"
        @mouseenter="onToolbarMouseEnter"
        @mouseleave="onToolbarMouseLeave"
      >
          <div>
            <!-- I don't think there's a point in having this when there's a "back to top" button -->
            <!--<button class="BlogToolbar-menu BlogToolbar-button" title="open menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 322 222"><path d="M2 95h320v32H2zM2-1h320v32H2zM2 191h320v32H2z"/></svg>
            </button>-->
          </div>

        <div>
          <button
            class="BlogToolbar-backToTop BlogToolbar-button"
            title="Back to top"
            v-scroll-to="'#post'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205 328"><path d="M195.7 94.8c-3.1 3.1-8 3-11.3 0L110 28.4V313c0 4.4-3.6 8-8 8s-8-3.6-8-8V28.4L19.6 94.7c-3.4 2.9-8.1 3.2-11.2.1-3.1-3.1-3.3-8.5-.1-11.4 0 0 87-79.2 88-80S99.1 1 102 1s4.9 1.6 5.7 2.4 88 80 88 80c1.5 1.5 2.3 3.6 2.3 5.7s-.8 4.1-2.3 5.7z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <article class="Post" id="post" ref="post">
      <div class="Post__container">
        <header class="Post-header u-gutter" ref="postHeader">
          <div class="u-sizeReadable u-mxauto">
              <h1 class="Post-title">
                <a :href="$route.path" class="Link is-dark">
                  {{ meta.title }}
                </a>
              </h1>
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
        <div>
          <component
            :is="content"
            v-if="content"
            ref="body"
            class="Post-body md"
            style="animation-delay: 0.3s"
          ></component>
        </div>
      </div>
    </article>
  </page>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

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
  },

  methods: {
    onToolbarMouseEnter() {
      this.isBlogToolbarVisible = true
      clearTimeout(this.toolbarTimeout)
    },

    onToolbarMouseLeave() {
      this.updateBlogToolbarVisiblity()
    },

    /**
     * Returns true if the window has scrolled past the bottom of the post header
     */
    getBlogToolbarVisiblity() {
      if (!process.browser) {
        return false;
      }

      const offsetTop =
        this.$refs.postHeader.getBoundingClientRect().top
        + this.$refs.postHeader.offsetHeight
        + document.body.scrollTop
        + VISIBILITY_OFFSET;

      return document.documentElement.scrollTop > offsetTop;
    },

    updateBlogToolbarVisiblity() {
      this.isBlogToolbarVisible = this.getBlogToolbarVisiblity();

      // Automatically hide it after a period of time
      clearTimeout(this.toolbarTimeout);
      this.toolbarTimeout = setTimeout(() => {
        this.isBlogToolbarVisible = false;
      }, 2000);
    },

    onImageClick(e) {
      const image = e.currentTarget

      this.$store.dispatch('fullscreenImage/setImage', {
        src: image.src,
        alt: image.alt,
        maxWidth: image.getAttribute('data-max-width'),
      });
    },
  },

  head() {
    return {
      // title: this.post.title,
    };
  },

  data() {
    return {
      isBlogToolbarVisible: false,
      theme: {
        siteHeader: {
          isCollapsed: true,
          isLogoFixed: true,
          allowNavLinkActiveClass: false,
          hasDarkbackground: false,
          hasDarkLinks: true,
          forceLogoActiveClass: true,
        },
      },
    };
  },

  computed: {
    ...mapState({
      allMeta: state => state.posts.meta,
    }),
    skipText() {
      return this.post.skip && this.post.skip.text ? this.post.skip.text : "Skip the backstory"
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

  destroyed() {
    return
    window.removeEventListener('scroll', this.updateBlogToolbarVisiblityThrottled);
    window.removeEventListener('resize', this.updateBlogToolbarVisiblityThrottled);

    this.images.forEach(image => image.removeEventListener('click', this.onImageClick));
    this.images = null;
  },

  created() {
    return
    this.updateBlogToolbarVisiblityThrottled =
      throttle(this.updateBlogToolbarVisiblity, 500, { trailing: true })
  },

  mounted() {
    return
    window.addEventListener('scroll', this.updateBlogToolbarVisiblityThrottled);
    window.addEventListener('resize', this.updateBlogToolbarVisiblityThrottled);

    const links = [...this.$refs.post.querySelectorAll('a')];

    links.forEach((link) => {
      if (link.host !== window.location.host) {
        link.setAttribute('rel', 'noreferrer noopener');
        link.setAttribute('target', '_blank');
      }
    });

    const images = this.images = [...this.$refs.post.querySelectorAll('img')];

    images.forEach((image) => {
      image.classList.add('Image');
      image.classList.add('is-allowedFullscreen');
      image.addEventListener('click', this.onImageClick);
    });
  },
};
</script>

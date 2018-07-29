
<!-- Disqus Comments -->
<!--
<div class="[ Row Row--large ]  disqus_thread">
  <div id="disqus_thread"></div>
</div>

<script type="text/javascript">
    /* * * CONFIGURATION VARIABLES * * */
    var disqus_shortname  = '';
    var disqus_identifier = {{ page.path | remove:'_posts/' | jsonify }};
    var disqus_title      = {{ page.title | jsonify }};

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
</script>

<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
-->

<template>
  <page
    :showSocial="false"
    :showFooter="false"
    :theme="theme"
  >
    <div class="Sidebar" slot="sidebar">
      <div class="Sidebar-inner">
        <div class="Meme u-mb3">
          <span class="Meme-upper">Next:</span>
          <span class="Meme-lower">Understanding JavaScript Prototypes</span>
        </div>
        <div class="Meme u-mb3">
          <span class="Meme-upper">Previous:</span>
          <span class="Meme-lower">Medium style image loading</span>
        </div>

        <div class="Sidebar-social  u-textCenter">
          <app-social-icons></app-social-icons>
        </div>
      </div>
    </div>

    <div slot="before" class="BlogToolbar">
      <transition name="tr-fade" :duration="250">
        <div v-show="isBlogToolbarVisible">

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
      </transition>
    </div>

    <article class="Post" id="post">
      <div class="Post__container">
        <header class="Post-header u-gutter" ref="postHeader">
          <div class="u-sizeReadable u-mxauto">
              <h1 class="Post-title">
                <a :href="$route.path" class="Link is-dark">
                  {{ post.title }}
                </a>
              </h1>
            <p class="PostMeta">
              <span class="PostMeta-date">
                {{ post.humanized.created_at }}
              </span>
              <span class="PostMeta-author">
                by Anthony Koch
              </span>
            </p>
          </div>
        </header>
        <div>
          <div
            class="Post-body  md"
            style="animation-delay: 0.3s"
            v-html="post.contents"
          >
          </div>
        </div>
      </div>
    </article>

    <!-- {{ disqusUrl }} -->
    <!-- <vue-disqus
      v-if="this.post"
      :shortname="disqusShortname"
      :identifier="disqusId"
      :url="disqusUrl"
    >
    </vue-disqus> -->
  </page>
</template>

<script>
import { mapState } from 'vuex';
import Disqus from 'vue-disqus'
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import * as api from "@/core/api";

const VISIBILITY_OFFSET = 1200;

export default {
  components: {
    page: require('@/layouts/main').default,
  },

  methods: {
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

    onScroll: debounce(function () {
    }, 300, { trailing: true }),

    updateBlogToolbarVisiblity: throttle(function () {
      console.log(this.getBlogToolbarVisiblity());

      this.isBlogToolbarVisible = this.getBlogToolbarVisiblity();

      // Automatically hide it after a period of time
      clearTimeout(this.toolbarTimeout);
      this.toolbarTimeout = setTimeout(() => {
        this.isBlogToolbarVisible = false;
      }, 2000);
    }, 400, { trailing: true }),
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
    disqusShortname() {
      return process.env.app.disqusShortname;
    },

    disqusId() { // env used to avoid re-use from dev to production
      return '${process.env.NODE_ENV}-${this.disqusShortname}-${this.post.id}'
    },

    disqusUrl() {
      return this.$route.path;
    },
  },

  asyncData({ params, error }) {
    return api.getPost(params.slug)
      .then(({ status, data: post }) => {
        return {
          post,
        };
      })
      .catch(err => {
        error({ statusCode: 404, message: 'Post not found' });
      });
  },

  destroyed() {
    window.removeEventListener('scroll', this.updateBlogToolbarVisiblity);
    window.removeEventListener('resize', this.updateBlogToolbarVisiblity);
  },

  mounted() {
    window.addEventListener('scroll', this.updateBlogToolbarVisiblity);
    window.addEventListener('resize', this.updateBlogToolbarVisiblity);
  },
};
</script>

<template>
  <div class="Page">

    <!--
      Hi, since you're already here, I'd like to inform you on the if/elseif statements of various programming languages.

      Ruby: elsif
      PHP: elseif
      Sass: elseif or else if
      JavaScript: else if
      Python: elif
      VB: ElseIf

      Like, wtf.
     -->

    <!-- TODO: Twitter cards -->
    <!--
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="{{ site.social.twitter.handle }}" />
    <meta name="twitter:title" content="{{ page.title }}" />
    <meta name="twitter:description" content="{{ page.description }}" />
    <meta name="twitter:url" content="{{ page.url }}">
     -->

    <!-- vendor.js -->
    <!-- app.js -->
    <!--
      TODO: import() this link
     <script async src="//assets.codepen.io/assets/embed/ei.js"></script>
   -->

    <slot name="before"></slot>

    <slot name="sidebar"></slot>

    <app-icons></app-icons>

    <div class="Page-inner">
      <div>
        <app-site-header
          v-bind="theme.siteHeader"
          :full-height="showFullHeightHeader"
        >
          <app-hero slot="lower" v-if="isHeroShowing" v-bind="theme.hero">
            <slot name="heroCaption" slot="heroCaption"></slot>
            <slot name="heroDescription" slot="heroDescription"></slot>
            <app-common-social
              v-if="showSocial"
              slot="heroSocial"
            ></app-common-social>
            <slot name="heroLower" slot="heroLower"></slot>
          </app-hero>
        </app-site-header>

        <div
          :class="{
            'has-sidebar': $slots.sidebar != null,
          }"
          class="Page-content"
        >
          <slot></slot>
        </div>

        <app-site-footer v-if="showFooter"></app-site-footer>
      </div>
    </div>

    <slot name="after"></slot>
  </div>
</template>

<script>
import Vue from 'vue';

// Just to make things easier so tha
Vue.component('app-hero', require('@/components/Hero').default);
Vue.component('app-common-social', require('@/components/CommonSocial').default);
Vue.component('app-icons', require('@/components/Icons').default);
Vue.component('app-site-header', require('@/components/SiteHeader').default);
Vue.component('app-site-footer', require('@/components/SiteFooter').default);
Vue.component('app-social-icons', require('@/components/SocialIcons').default);
Vue.component('app-project-preview', require('@/components/ProjectPreview').default);
Vue.component('app-project-preview-list', require('@/components/ProjectPreviewList').default);
Vue.component('app-ripple', require('@/components/Ripple').default);
Vue.component('app-overlay', require('@/components/Overlay').default);
Vue.component('app-post-preview', require('@/components/PostPreview').default);
Vue.component('app-input', require('@/components/Input').default);
Vue.component('app-text-area', require('@/components/TextArea').default);

export default {
  props: {
    theme: {
      type: Object,
      default() {
        return {};
      },
    },
    showSocial: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showFullHeightHeader: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isHeroShowing() {
      return this.$slots.heroCaption || this.$slots.heroDescription || this.$slots.heroLower;
    },
  },

  components: {
    //
  },
};

</script>

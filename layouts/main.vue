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
    <div :aria-hidden="fullscreenImage.isShowing">
      <transition
        name="tr-fade"
      >
        <app-overlay
          v-show="fullscreenImage.isShowing"
          @request-close="$store.dispatch('fullscreenImage/hideImage')"
          :is-showing-close="true"
        >
          <div class="FullscreenImageContainer">
            <img
              v-bind="fullscreenImage.attributes"
              class="Image is-fullscreen"
              v-show="fullscreenImage.isShowing"
            >
          </div>
        </app-overlay>
      </transition>
    </div>

    <slot name="before"></slot>
    <slot name="sidebar"></slot>

    <div class="Page-inner">
      <div>
        <app-site-header
          v-bind="theme.siteHeader"
          :full-height="showFullHeightHeader"
        >
          <app-hero slot="lower" v-if="isHeroShowing" v-bind="theme.hero">
            <slot name="heroCaption" slot="heroCaption"></slot>
            <slot name="heroDescription" slot="heroDescription"></slot>
            <app-social-icons
              v-if="showSocial"
              slot="heroSocial"
            ></app-social-icons>
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
import { mapState } from 'vuex';

// Just to make things easier so tha
Vue.component('app-hero', require('@/components/Hero').default);
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

  data() {
    return {
      console,
    };
  },

  computed: {
    ...mapState({
      fullscreenImage: state => state.fullscreenImage,
    }),
    isHeroShowing() {
      return this.$slots.heroCaption || this.$slots.heroDescription || this.$slots.heroLower;
    },
  },

  components: {
    //
  },
};

</script>

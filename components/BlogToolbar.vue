<template>
  <div class="BlogToolbar">
    <div
      :style="{
        opacity: isBlogToolbarVisible ? 1 : 0,
        'pointer-events': isBlogToolbarVisible ? 'auto' : 'none',
      }"
      style="transition: opacity 300ms"
    >
        <!--<div>
            I don't think there's a point in having this when there's a "back to top" button
          <button class="BlogToolbar-menu BlogToolbar-button" title="open menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 322 222"><path d="M2 95h320v32H2zM2-1h320v32H2zM2 191h320v32H2z"/></svg>
          </button>
        </div>-->

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
</template>

<script>
import _ from 'lodash'

export default {
  created() {
    this.updateBlogToolbarVisiblityThrottled =
      _.throttle(this.updateBlogToolbarVisiblity, 500, { trailing: true })
  },
  mounted() {
    setTimeout(() => {
      this.updateBlogToolbarVisiblity()
    }, 100)

    window.addEventListener('scroll', this.updateBlogToolbarVisiblityThrottled);
    window.addEventListener('resize', this.updateBlogToolbarVisiblityThrottled);
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateBlogToolbarVisiblityThrottled);
    window.removeEventListener('resize', this.updateBlogToolbarVisiblityThrottled);
  },
  data() {
    return {
      isBlogToolbarVisible: false,
    }
  },
  props: {
    top: {
      type: Number,
    },
  },
  methods: {
    onToolbarMouseLeave() {
      this.updateBlogToolbarVisiblity()
    },

    /**
     * Returns true if the window has scrolled past the bottom of the post header
     */
    getBlogToolbarVisiblity() {
      if (!process.browser || this.top == null) {
        return false;
      }

      return document.documentElement.scrollTop > this.top;
    },

    updateBlogToolbarVisiblity() {
      this.isBlogToolbarVisible = this.getBlogToolbarVisiblity();
    },
  },
}
</script>

<style lang="scss" scoped>

@import '../assets/styles/bootstrap';

.BlogToolbar {
  position: fixed;
  right: spacing(1);
  text-align: center;
  top: 20px;
  z-index: $app-layer-blog-toolbar;
}

.BlogToolbar-button {
  background-color: transparent;
  border: 1px solid color('background', 'dark');
  border-radius: 3px;
  display: inline-block;
  margin-bottom: 1rem;
  outline: 0;
  padding: 14px 0;
  transition: 200ms border-color;
  width: 30px;

  svg {
    fill: color('background', 'dark');
    transition: fill 200ms;
  }

  &:hover {
    border-color: color('primary');

    svg {
      fill: #dddddd;
      fill: color('primary');
    }
  }
}

.BlogToolbar-menu {
  svg {
    display: block;
    margin: 0 auto;
    width: 18px;
  }
}

.BlogToolbar-backToTop {
  width: 30px;

  svg {
    margin: 0 auto;
    width: 10px;
    display: block;
  }
}

@include app-breakpoint-min(lg) {
  .BlogToolbar {
    right: 50px;
    top: 50px;
  }

  .BlogToolbar-button {
    padding: 18px 0;
    width: 38px;
  }

  .BlogToolbar-backToTop {
    svg {
      width: 11px;
    }
  }
}
</style>


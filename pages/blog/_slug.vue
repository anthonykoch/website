
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
  >
    <article class="Post">


    <div class="BlogSidebar">
      <div class="BlogSidebar-inner">
        <div class="BlogSidebar-next">
          <span class="BlogSidebar-nextUpper">Next:</span>
          <span class="BlogSidebar-nextLower">Understanding JavaScript Prototypes</span>
        </div>
      </div>
    </div>

      <div class="Post__container">
        <div class="u-sizeReadable u-mxauto">
          <header class="Post__header  u-sizeSm">
              <h1 class="Post__title">
                <a :href="$route.path" class="Link Link--dark">
                  {{ post.title }}
                </a>
              </h1>
            <ul class="Post__meta-list">
              <li class="TODO-POSTMETA" >
                {{ post.humanized.created_at }}
              </li>
            </ul>
          </header>
        </div>
        <div
          class="Post__body"
          style="animation-delay: 0.3s"
          v-html="post.contents"
        >
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

<style lang="scss">

@import '../../assets/styles/variables';

.BlogSidebar {
  position: fixed;
  background-color: #f2f2f2;
  overflow: hidden;
  width: 300px;
  height: 100vh;
  top:  0;
  left: 0;
}

.Site {
  // padding-left: 300px;
}

.BlogSidebar-inner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin-top: 90px;
  background-image: url(https://images.unsplash.com/photo-1522980811-53cc29445e08?ixlib=rb-0.3.5&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;s=74050b81ff13d8e6fdf7720a855c43d3&amp;auto=format&amp;fit=crop&amp;w=3160&amp;q=80);
  background-size: cover;
}

.BlogSidebar-next {
  border: 1px solid rgba(white, 0.5);
  border-radius: 4px;
  background-color: transparent;
  color: rgba(white, 0.7);
  cursor: pointer;
  font-family: $app-font-family-1;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 1rem;
  text-align: left;
  transition: background-color 300ms;

  &:hover {
    background-color: rgba($color-primary, 0.8);
    border-color: rgba($color-primary, 0.8);
    color: rgba(black, 0.6);
  }

  > span {
    display: block;
    padding: 4px 10px;
  }
}

.BlogSidebar-nextUpper {
  font-family: $app-font-family-1;
  font-size: 14px;
  display: block;
}

.BlogSidebar-nextLower {

}

</style>

<script>
import { mapState } from 'vuex';
import Disqus from 'vue-disqus'

export default {
  scrollToTop: true,

  components: {
    page: require('@/layouts/main').default,
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

    post() {
      // console.log(Object.keys(this.$store.state.posts.postsById))
      const post = this.$store.getters['posts/getBySlug'](this.$route.params.slug);

      if (post == null) {
        throw new Error('the fuck is happening: ' + this.$route.params.slug)
      }

      // console.log({
      //   slug: this.$route.params.slug,
      //   posts: this.$store.getters['posts/getPosts'],
      //   post,
      // })

      return post;
    },
  },

  async fetch({ store: $store, params }) {
    await $store.dispatch('posts/loadPost', { slug: params.slug });
  },
};
</script>

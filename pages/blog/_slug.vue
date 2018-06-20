
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
  <div>
    <app-site-header></app-site-header>

    <article class="Post">
      <div class="Post__container">
        <header class="Post__header">
          <h1 class="Post__title">
            <a href="$route.path" class="Link Link--dark">
              {{ post.title }}
            </a>
          </h1>
          <ul class="Post__meta-list">
            <li class="TODO-POSTMETA" >
              {{ post.humanized.created_at }}
            </li>
          </ul>
        </header>
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Disqus from 'vue-disqus'

export default {
  scrollToTop: true,

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

<template>
  <article class="PostPreview">
    <span class="PostPreview-meta">{{ meta.humanized.created_at }}</span>
    <h4 class="PostPreview-title">
      <nuxt-link :to="meta.url" class="PostPreview-link">
        {{ meta.title }}
      </nuxt-link>
    </h4>
    <div
      class="PostPreview-body"
      v-html="content"
    >
    </div>
    <a :href="meta.url" class="PostPreview-more">read more &nbsp;&nbsp;&rarr;</a>
  </article>

</template>

<script>
import _ from 'lodash';

export default {
  props: {
    meta: {
      type: Object,
      require: true,
    },
  },

  computed: {
    content() {
      return _.truncate(this.meta.excerpt.content, {
        length: 250,
      });
    },
  },
};
</script>

<template>
  <article class="PostPreview  u-collapse@medium">
    <ul class="PostPreview__meta">
      {{ meta.humanized.created_at }}
    </ul>
    <h4 class="PostPreview__title">
      <nuxt-link :to="meta.url" class="PostPreview__link">
        {{ meta.title }}
      </nuxt-link>
    </h4>
    <div
      class="PostPreview__body  row row--medium  u-margin-0 u-collapse-last"
      v-html="content"
    >
    </div>
    <a :href="meta.url" class="PostPreview__more">read more &rarr;</a>
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

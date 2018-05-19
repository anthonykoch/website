<template>
  <transition-group
    name="tr-ripple"
    tag="div"
    :aria-hidden="true"
    class="Ripple"
    @after-enter="onAfterTransition"
    @enter-cancelled="onAfterTransition"
  >
    <div
      v-for="item of ripples"
      :style="item.styles"
      :key="item.id"
      :data-id="item.id"
      class="Ripple-item"
    >
    </div>
  </transition-group>
</template>

<script>

import cuid from 'cuid';

import * as utils from '@/core/utils';

export default {

  props: {
    allowMultipleRipples: {
      type: Boolean,
      default: true,
    },

    container: {
      validator(value) {
        return value == null || (value && value.nodeType === 1);
      },
    },

    ripple: {
      required: true,
      validator: (value) => {
        return (
          value == null ||
          (value && Number.isFinite(value.pageX) && Number.isFinite(value.pageY))
        );
      },
    },
  },

  data() {
    return {
      console,
      isExpanding: false,
      ripples: [],
    };
  },

  watch: {
    ripple(data) {
      if (data != null) {
        this.$nextTick(() => {
          this.addRipple(this.createRipple(data));
        });
      }
    },
  },

  methods: {
    getContentElement() {
      return this.$slots.default[0].elm;
    },

    removeRipple(ids) {
      // console.log('removing', ids, 'from', this.ripples.map(r => r.id))

      this.ripples =
        this.ripples.filter(ripple => {
          return ids.every(id => id !== ripple.id);
        });

      // console.log('after', this.ripples.map(r => r.id))
    },

    addRipple(ripple) {
      this.ripples.push(Object.freeze({ ...ripple }));
      // console.log('adding', {...ripple})
    },

    createRipple({ pageX, pageY }) {
      const parent =
        this.container != null
          ? this.container
          : this.$el.parentNode;

      const parentRect = parent.getBoundingClientRect();

      const {
        top: offsettop,
        left: offsetleft,
      } = utils.getElementOffset(parent);

      const top  = pageY - offsettop;
      const left = pageX - offsetleft;

      return Object.freeze({
        id: cuid(),
        from: {
          left: pageX,
          top: pageY,
        },
        styles: {
          top: `${top}px`,
          left: `${left}px`,
        },
      });
    },

    onAfterTransition(el) {
      this.removeRipple([el.dataset.id]);
    },

    onContentClick(e) {
      this.addRipple(this.createRipple({
        pageX: e.pageX,
        pageY: e.pageY,
      }));
    },
  },
};
</script>

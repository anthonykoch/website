<template>
  <a
    :class="{ 'is-active': isActive }"
    :aria-selected="isActive"
    :id="id"
    :href="'#' + id"
    @click="onSelected"
    @keyup="onKeydown"
    class="Tabs-item"
    role="tab"
  >
    <slot>{{ text }}</slot>
  </a>
</template>

<script>
export default {
  props: {
    // ariaControls: {
    //   type: String,
    //   required: true,
    // },
    text: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    notify() {
      this.$emit('selected', this.id)
    },
    onSelected(e) {
      e.preventDefault()

      if (e.which === 1) {
        this.notify()
      }
    },
    onKeydown(e) {
      if (e.which === 32) {
        this.notify()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.Tabs-item {
  align-items: center;
  background-color: transparent;
  box-shadow: none;
  border: 1px solid transparent;
  border-bottom: 1px solid #E6E8EB;
  color: #42484e;
  cursor: pointer;
  display: flex;
  font-weight: 600;
  font-size: 12px;
  min-height: 37px; // TODO: I should really fix the twitching properly
  outline: 0;
  padding: 5px 14px 6px;
  transition: all 400ms;
  user-select: none;
  white-space: nowrap;

  &:hover,
  &:focus {
    &:before {
      height: 6px;
      width: 6px;
    }
  }

  &:before {
    background-color: #e0d2a5;
    content: '';
    border-radius: 100%;
    display: block;
    height: 0;
    font-size: 0px;
    margin-right: 5px;
    margin-top: 2px;
    transition: all 300ms;
    width: 0;
  }

  &.is-active {
    border: 1px solid rgba(black, 0.1);
    border-top: 2px solid #e0d2a5;
    box-shadow: 0 16px 46px -4px rgba(black, 0.3);
    background-color: white;
    color: #191e24;
    position: relative;
    z-index: 1;

     &:before {
      height: 0 !important;
      width: 0 !important;
    }
  }
}
</style>

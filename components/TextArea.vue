<template>
  <div class="InputGroup">
    <textarea
      @focus="onFocus"
      @blur="onBlur"
      @keyup="onChange"
      :class="{
        'has-label-lifted': isInputFocused || hasText
      }"
      class="TextArea"
      ref="input"
      v-bind="$props.input"
    ></textarea>
    <slot name="label">
      <label class="Label" :for="input.name">{{ label }}</label>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    input: {
      type: Object,
      validator(input) {
        return typeof input.name === 'string';
      },
      required: true,
    },
  },

  data() {
    return {
      hasText:
        typeof this.input.value === 'string'
          ? this.input.value.trim() !== ''
          : false,

      isInputFocused: false,
    };
  },

  methods: {
    update() {
      this.hasText = this.$refs.input.value.trim() !== '';
    },

    onChange(e) {
      this.update();
    },

    onBlur() {
      this.isInputFocused = false;
    },

    onFocus() {
      this.isInputFocused = true;
    },
  },

  mounted() {
    this.update();
  },
}
</script>

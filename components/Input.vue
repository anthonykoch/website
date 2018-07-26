<template>
  <div class="InputGroup">
    <input
      @focus="onFocus"
      @blur="onBlur"
      @keyup="onChange"
      :class="{
        'has-label-lifted': isInputFocused || hasText
      }"
      ref="input"
      class="Input"
      type="text"
      value=""
      v-bind="input"
      :id="input.id"
    >
    <slot name="label">
      <label
        :for="input.name"
        class="Label"
      >
        {{ label }}
      </label>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    input: {
      type: Object,
      validator(input) {
        return [input.name, input.id].every(value => typeof value === 'string');
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

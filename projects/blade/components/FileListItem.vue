<template>
  <li class="br-FilesList-item">
    <div class="br-File">
      <div
        class="br-File-name"
        tabindex="0"
        @keyup.enter.self="updateActiveFile(file.id)"
        @click.self="updateActiveFile(file.id)">

        <span>{{ filePath }}</span>

        <input class="br-File-inputEditText"
          type="text"
          value=""
          autocomplete="off"
          ref="input"
          tabindex="-1"
          :value="filePath"
          v-show="isEditingPath"
          @keyup="path = $event.target.value"
          @keyup.enter="updateFilePath"
          @keyup.esc="isEditingPath = false"
          @focusout="isEditingPath = false">
      </div>

      <div class="br-FileActions">
        <button
          class="br-FileActions-button"
          @click="deleteFile(file)"
        >
          <svg class="br-FileActions-icon is-delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/></svg>
        </button>
        <button
          class="br-FileActions-button"
          @click="enableEditingPath"
        >
          <svg class="br-FileActions-icon is-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 368v80h80l235.727-235.729-79.999-79.998L64 368zm377.602-217.602c8.531-8.531 8.531-21.334 0-29.865l-50.135-50.135c-8.531-8.531-21.334-8.531-29.865 0l-39.468 39.469 79.999 79.998 39.469-39.467z"/></svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
export default {
	props: ['file'],

	data() {
		return {
			isEditingPath: false,
			path: this.file.path,
		};
	},

	computed: {
		filePath() {
			return this.file.path;
		}
	},

	methods: {
		deleteFile() {
			this.$emit('file:delete', this.file);
		},

		enableEditingPath() {
			this.isEditingPath = true;

			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},

		updateActiveFile() {
			this.$emit('file:set-current', this.file.id);
			this.$emit('pane:update', 'code');
    },

		updateFilePath() {
			console.log(this.file.path, this.path);

			if (this.file.path !== this.path) {
				this.$emit('file:update-path', this.file.id, this.path);
			}

			this.$refs.input.blur();
		}
	},
};

</script>


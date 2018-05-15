<template>
  <ul
    class="ProjectPreviewList"
  >
    <li
      v-for="project in projects"
      :key="project.title"
      class="ProjectPreviewList__item"
    >
      <transition name="fadeIn">
        <app-project-preview
          :style="getStyle(project)"
          :project="project"
          ref="project"
        ></app-project-preview>
      </transition>
    </li>
  </ul>
</template>

<script>

const TRANSITION_DELAY = 200;
const MIN_TRANSITION_DELAY = 300;

export default {
  components: {
    //
  },

  props: {
    projects: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    setTimeout(() => {
      this.projectStates.forEach(state => {
        state.isShowing = true;
      });
    }, 0);
  },

  data() {
    return {
      projectStates: this.projects.map((project) => {
        return {
          id: project.id,
          isShowing: false,
        };
      }),
    };
  },

  methods: {
    getIndex(project) {
      return this.projects.findIndex(p => p.id === project.id);
    },
  },

  computed: {
    getStyle() {
      return (project) => {
        const { isShowing } = this.projectStates.find(p => p.id === project.id);
        const index = this.getIndex(project) + 1;

        return {
          opacity: isShowing ? 1 : 0,
          'transition-delay': `${index * TRANSITION_DELAY + MIN_TRANSITION_DELAY}ms`,
          // 'transition-duration': `${TRANSITION_DURATION}ms`,
          'pointer-events': isShowing ? 'auto' : 'none',
        };
      };
    },
  },
};
</script>

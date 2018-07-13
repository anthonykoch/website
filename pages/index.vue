<template>
  <page>
    <div slot="heroCaption">Front-End Developer</div>
    <div slot="heroDescription">
      Hello, my name is Anthony Koch. I'm a front-end developer specializing in responsive design, web performance, and custom web development. I'm a lover of JavaScript, Python, and simple code.
    </div>

    <transition
      name="tr-fade"
      @after-enter="navigateToProject"
      @enter-cancelled="navigateToProject"
    >
      <app-overlay
        ref="projectsOverlay"
        :background="overlays.projects.background"
        v-show="overlays.projects.isShowing"
      ></app-overlay>
    </transition>

    <section id="projects" class="u-flex">
      <!-- <div class="u-size4of12"></div>
      <div class="Slider u-size4of12 u-mxauto">
        <div class="Slider-container" style="width: 500%">
          <div class="Slider-slide" style="width: 20%">
            <div class="WorkImage is-1"></div>
          </div>
          <div class="Slider-slide" style="width: 20%">
            <div class="WorkImage is-2"></div>
          </div>
          <div class="Slider-slide" style="width: 20%">
            <div class="WorkImage is-3"></div>
          </div>
          <div class="Slider-slide" style="width: 20%">
            <div class="WorkImage is-4"></div>
          </div>
        </div>
      </div>
      <div class="u-size4of12"></div> -->
    </section>

    <section id="codepen">
      <div class="u-siteWrapper u-pt7 u-px5">
        <h2 class="Title Title--alternate Title--dark">
          <span>Codepen</span>
          <span class="Title__caption">
            My various codepen projects and experiments
          </span>
        </h2>
      </div>

      <div class="CodepenProjects">
        <div class="u-siteWrapper u-px5">
          <app-project-preview-list
            :projects="projects"
            @navigate="setNavigatedProject"
          >
          </app-project-preview-list>
          <div class="u-textCenter">
            <a
              href="https://codepen.io/anthonykoch/"
              class="Button Button--light Button--large Button--hover-stripe-bottom"
            >
              View more on Codepen &rarr;
            </a>
            <!-- <a href="https://codepen.io/anthonykoch/" class="ViewMore">View more of my projects on Codepen &rarr;</a> -->
          </div>
        </div>
      </div>
    </section>

    <!-- /Users/tony/Documents/Github/companies/plaid/screenshots -->
    <!-- <img src="http://localhost:3020/plaid/screenshots/june 19 2018/pricing.png" alt=""> -->

    <app-site-footer></app-site-footer>
  </page>
</template>

<script>

import { mapState } from 'vuex';

export default {
  props: {
    //
  },

  components: {
    page: require('@/layouts/main').default,
  },

  data() {
    return {
      navigatedProject: null,
      overlays: {
        projects: {
          isShowing: false,
          background: 'is-white',
        },
      },
    };
  },

  head() {
    return {
      title: `Anthony Koch`,
      description: `Hello, my name is Anthony Koch. I'm a front-end developer specializing in responsive design, web performance, and custom web development.`,
    };
  },

  computed: {
    ...mapState({
      projects: state => state.projects.codepen,
      featuredProject: state => state.projects.github.editorconnect,
    }),

    images() {
      return {
        plaidHorizontal: require('~/assets/images/logos/plaid-horizontal.svg'),
        mfVerticalLockup: require('~/assets/images/logos/mf-vertical-lockup.svg'),
      };
    },
  },

  methods: {
    navigateToProject(e) {
      // TODO: Make this triggerable by vue attribute
      this.overlays.projects.isShowing = true;

      setTimeout(() => {
        window.location = this.navigatedProject.href;
      }, 100)
    },

    setNavigatedProject(e, project) {

      this.navigatedProject = project;
      this.overlays.projects.isShowing = true;
      this.overlays.projects.background = project.fade;
    },
  },
};
</script>

<style>

</style>

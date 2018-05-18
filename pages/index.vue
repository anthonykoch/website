<template>
  <div>
    <app-site-header>
      <app-hero
        slot="lower"
        :social="$store.getters['social/getMediaItems']"
      >
        <div slot="caption">Front-End Developer</div>
        <div slot="description">
          Hello, my name is Anthony Koch. I'm a front-end developer specializing in responsive design, web performance, and custom web development. I'm a lover of JavaScript, Python, and simple code.
        </div>
      </app-hero>
    </app-site-header>

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

    <section class="Band Band--small u-collapse-bottom">
      <div class="row row--xxlarge">
        <h2 class="Title Title--alternate Title--dark">
          <span>Codepen</span>
          <span class="Title__caption">
            My various codepen projects and experiments
          </span>
        </h2>
      </div>

      <div class="CodepenProjects">
        <div class="row row--xxlarge">
          <app-project-preview-list
            :projects="projects"
            @navigate="setNavigatedProject"
          >
          </app-project-preview-list>
          <div class="u-text-center">
            <a href="https://codepen.io/anthonykoch/" class="Button Button--light Button--large">View more on Codepen &rarr;</a>
            <div class="Band"></div>
            <!-- <a href="https://codepen.io/anthonykoch/" class="ViewMore">View more of my projects on Codepen &rarr;</a> -->
          </div>
        </div>
      </div>
    </section>
<!--
    editorconnect:
  title: Editor Connect
  subtitle: Node script
  icon:
    name: icon-nodejs
  description: |
      <p>
        This is a plugin (more of a node script) which was created to eliminate the back and forth checks between the text editor and a gulp process.
        <em>It has not yet been published to npm.</em>
      </p>
      <p>
        With every gulp task that errors out, a message is sent to text editor for it to display the error message. Errors are removed an redisplayed after every task error. This works for Sass, React, or anything that emits an error with a line number.
      </p>
      <p>
        Some of the features including scrolling to the line where the error occurred and showing an icon on the line the error occurred. Currently only Sublime Text 3 is supported.
      </p>
  links:
    repository: https://github.com/anthonykoch/editor-connect
  tags: ['NodeJS', 'Javascript', 'Python']
  quote: 'No more switching between the text editor and a gulp process!'
  image:
    url: './projects/jsx.png'
    alt: 'A JSX error showing in Sublime Text'
  thumbnail:
    url: '/projects/jsx--thumb.png'
    height: 18
    width: 30
    blur: 5
    intrinsic: 60%
 -->

    <section>
      <!-- <div class="Projects">
        <header class="Projects__header">
          <div class="row row--xxlarge">
            <h3 class="Title Title--alternate">
              <span>Github Projects</span>
              <span class="Title__caption Title__caption--light">
                Various plugins and scripts
              </span>
            </h3>
          </div>
          <div class="row row--xlarge">
            <p class="Projects__header__quote">
              Connecting the editor and GulpJS for error reporting
            </p>
          </div>
        </header>

        <ul class="ProjectList">
          <li class="ProjectList__item row row--xlarge">
            <div class="Project Project--first">

              <div class="Project__media  u-size6of12 u-size12of12@xlarge">
                <a
                  :href="featuredProject.links.repository"
                  class="Project__link"
                >
                  <img
                    class="Project__image"
                    :src="contexts.image(featuredProject.image.url)"
                    :alt="featuredProject.image.alt">
                </a>
              </div>
              <div class="Project__details
                    Project__details--is-inside-first
                    u-size6of12 u-size12of12@xlarge">

                <div class="Project__title-container">
                  <div class="Project__subtitle">
                    {{ featuredProject.subtitle }}
                  </div>
                  <h3 class="Project__title">
                    <a
                      :href="featuredProject.links.repository"
                      class="Project__title__link"
                    >
                      {{ featuredProject.title }}
                    </a>

                    <div
                      v-if="featuredProject.icon"
                      class="Project__icon u-foreground-node-fg"
                    >
                      <svg class="svg-icon">
                        <use xlink:href="'#' + featuredProject.icon.name"></use>
                      </svg>
                    </div>
                  </h3>
                </div>
                <div
                  v-html="featuredProject.description"
                  class="Project__description  Paragraphs Paragraphs--light  u-collapse-last"
                >
                </div>
              </div>
            </div>
          </li>

          <li class="ProjectList__item">
            <div class="Project Project--other  Band">
              <div class="row row--xlarge">
                <h2 class="Title Title--alternate Title--dark  u-text-center">
                  <span>Other Notable Projects</span>
                </h2>

                <ul class="ProjectOtherList">
                  <li class="ProjectOtherList__item">
                    <h3 class="Project__title">
                      <a href="https://github.com/anthonykoch/bladejs" class="ProjectOtherTitle">BladeJS</a>
                    </h3>
                    <div class="Paragraphs Paragraphs--light Paragraphs--small">
                      <p>
                        An implementation of Laravel's Blade templating engine in JavaScript. This project was written purely for fun on my off days. It took a couple of months as I also wrote Blade Expression at the same time.
                      </p>
                    </div>
                  </li>
                  <li class="ProjectOtherList__item">
                    <h3 class="Project__title">
                      <a href="https://github.com/anthonykoch/blade-expression" class="ProjectOtherTitle">
                        Blade Expression
                      </a>
                    </h3>
                    <div class="Paragraphs Paragraphs--light Paragraphs--small">
                      <p>
                        A parser for JavaScript expressions created according to the ES6 specification. This parser was written for BladeJS so that Blade could output errors at compile time. It continues to be a work in progress.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="row row--full">
                <div class="u-text-center">
                  <a href="/blade" class="Button Button--large">
                    Try BladeJS live
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div> -->
    </section>

    <app-site-footer :social="$store.getters['social/getMediaItems']"></app-site-footer>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  props: {
    //
  },

  components: {
    //
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
  },

  methods: {
    navigateToProject(e) {
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

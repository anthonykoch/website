<template>
  <div>
    <app-site-header>
      <app-hero slot="lower">
        <div slot="caption">Front-End Developer</div>
        <div slot="description">
          Hello, my name is Anthony Koch. I'm a front-end developer specializing in responsive design, web performance, and custom web development. I'm a lover of JavaScript, Python, and simple code.
        </div>
        <app-social-icons
          slot="social"
          :social="$store.getters['social/getMediaItems']"
        ></app-social-icons>
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

    <section class="Band Band--small u-mb0 u-pb0">
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

    <!-- <section id="work" class="Band Band--small">
      <div class="row">
        <h2 class="Title Title--alternate Title--dark">Work</h2>
        <ul class="u-flex u-items-center">
          <li class="WorkList__item  u-size3of12">
            <router-link
              :to="{ name: 'work-plaid' }"
              class="WorkList__link"
            >
              <img
                src="~/assets/images/logos/plaid-horizontal.svg"
                alt="plaid technologies inc."
                width="163px"
                class="WorkList__image is-plaid"
              >
            </router-link>
          </li>
          <li class="WorkList__item  u-size3of12">

            <router-link
              :to="{ name: 'work-modern-fertility' }"
              class="WorkList__link"
            >
              <img
                src="~/assets/images/logos/mf-vertical-lockup.svg"
                alt="modern fertility"
                width="237px"
                class="WorkList__image"
              >
            </router-link>
          </li>
        </ul>
      </div>
    </section> -->

    <section id="projects">
      <div class="Projects">
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              <!-- A vue component wrapper around codemirror showing JavaScript expression feedback -->
            </p>
          </div>
        </header>

        <div class="Project__side">
          <a
            href="/"
            onclick="return false;"
            class="u-block"
          >
          <!-- <video
            src="~assets/videos/howitworks2.mp4"
            class="Project__asset"
            autoplay=""
            loop=""
            width="560"
          ></video> -->
            <img src="~assets/images/scuffka3.png" alt="awd" width="560" class="Project__asset">
          </a>
        </div>


        <ul class="ProjectList">
          <!-- <li class="ProjectList__item row row--xlarge">
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
                  class="Project__description  Paragraphs Paragraphs--light  u-collapse-last"
                >
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
                </div>
              </div>
            </div>
          </li> -->

          <!-- <li class="ProjectList__item">
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
                        An implementation of Laravel's Blade templating engine in JavaScript. This project was written purely for fun on my off days. It took a couple of months as I also wrote JSParse at the same time.
                      </p>
                    </div>
                  </li>

                  <li class="ProjectOtherList__item">
                    <h3 class="Project__title">
                      <a href="https://github.com/anthonykoch/JSParse" class="ProjectOtherTitle">
                        JSParse
                      </a>
                    </h3>
                    <div class="Paragraphs Paragraphs--light Paragraphs--small">
                      <p>
                        A parser for JavaScript expressions created according to the ES6 specification. This parser was written for BladeJS so that Blade could output errors at compile time. It continues to be a work in progress.
                      </p>
                    </div>
                  </li>

                  <li class="ProjectOtherList__item">
                    <h3 class="Project__title">
                      <a href="https://github.com/anthonykoch/JSParse" class="ProjectOtherTitle">
                        JSParse
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
          </li> -->
        </ul>
      </div>
    </section>

    <app-site-footer></app-site-footer>
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

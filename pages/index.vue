<template>
  <page
    :showSocial="false"
  >
    <!--<div slot="heroLower">
      <div class="meme"></div>
    </div>-->
    <!--<div slot="heroCaption">Front-End Developer</div>-->
    <!--<div slot="heroDescription">
      Hello, my name is Anthony Koch. I'm a front-end developer specializing in responsive design, web performance, and custom web development. I'm a lover of JavaScript, Python, and simple code.
    </div>-->

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

    <div slot="heroLower">
      <div class="s-Hero">
        <div>
          <div class="s-Hero-title">
            <span>Need a </span>
            <transition
              name="tr-vertical-text-rotate"
              @afterEnter="onHeroShowing"
              @afterLeave="onHeroHidden"
            >
              <span
                class="s-Hero-titlePart"
                v-show="isHeroShowing"
                style="transition-delay: 100ms"
              >
                {{ activeHero.title }}
              </span>
            </transition>
          </div>
        </div>
        <div>
          <transition
            name="tr-vertical-text-rotate"
          >
            <p
              class="s-Hero-caption"
              v-show="isHeroShowing"
            >
              {{ activeHero.caption }}
            </p>
          </transition>
        </div>
        <!--<div>
          <transition
            name="tr-vertical-text-rotate"
          >
            <button
              class="s-Hero-cta"
            >
               v-show="isHeroShowing"
              Get in touch
               {{ activeHero.cta }}
            </button>

          </transition>
        </div>-->
      </div>
    </div>

    <section id="work">
      <div class="u-siteWrapper u-pt7 u-px5">
        <div class="FeatureWork">
          <h2 class="Title Title--alternate Title--dark">
            <span>Featured Work</span>
            <span class="Title__caption">
              Samples of my work
            </span>
          </h2>

          <div class="FeaturedWork-section">
            <div class="FeaturedWork-images">
              <div>
                <div class="WorkImages">
                  <div class="MemeTag  WorkImages-tag">Website Development</div>
                  <div class="WorkImages-container">
                    <img src="~/assets/images/work/mf-1@2x.png" alt="" class="WorkImages-image">
                  </div>
                </div>
              </div>
              <!-- <div class="FeaturedWork-imageItem">
                <div></div>
              </div>
              <div class="FeaturedWork-imageItem">
                <div></div>
              </div>
              <div class="FeaturedWork-imageItem">
                <div></div>
              </div>
              <div class="FeaturedWork-imageItem">
                <div></div>
              </div> -->
            </div>
            <div class="FeaturedWork-about">
              <div class="FeatureWork-title">
                Modern Fertility
              </div>
              <p class="FeatureWork-text">
                Modern Fertility contacted me to help develop their website. At the time, I was the sole front-end developer, working alongside Tom Chokel to help Carly and Afton to help get their idea out to the world.
              </p>
              <ul class="FeaturedWork-list">
                <li>Front-end development</li>
                <li>Integrating a checkout system</li>
                <li>Developed several landing pages </li>
              </ul>

              <p class="FeaturedWork-footnote">
                Note: Their website has changed quite a bit recently. However, their current landing page (as of July, 2018) was still largely developed by me.
              </p>
              <button class="FeaturedWork-cta">View Website</button>
            </div>
          </div>
        </div>
      </div>
    </section>

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
            Various projects and experiments
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
      console,
      activeHeroIndex: 0,
      isHeroShowing: true,
      heroItems: [
        {
          cta: 'Get in touch',
          title: 'mobile ready website?',
          caption: 'I develop websites that work excellently across a wide range of devices.',
        },
        {
          cta: 'Hire me',
          title: 'pixel perfect landing page?',
          caption: 'Have a design that needs implementation? I can bring the design to life.',
        },
        {
          cta: '',
          title: 'help on a project?',
          caption: 'I work in React, Vue, jQuery, or just vanilla JavaScript.',
        },
      ],
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

    activeHero() {
      return this.heroItems[this.activeHeroIndex];
    },

    images() {
      return {
        plaidHorizontal: require('~/assets/images/logos/plaid-horizontal.svg'),
        mfVerticalLockup: require('~/assets/images/logos/mf-vertical-lockup.svg'),
      };
    },
  },

  methods: {
    onMeme() {
      console.log('hey ma dude');
    },

    showNextHero() {
      this.activeHeroIndex =
        this.activeHeroIndex + 1 >= this.heroItems.length
          ? 0
          : this.activeHeroIndex + 1;
    },

    onHeroHidden() {
      console.log('hidden');
      this.showNextHero();
      setTimeout(() => {
        this.isHeroShowing = true;
      }, 100);
    },

    onHeroShowing() {
      console.log('showing');
      this.hideHero();
    },

    hideHero() {
      setTimeout(() => {
        this.isHeroShowing = false;
      }, 3500);
    },

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

  mounted() {
    // this.showPreviousHero();
    this.hideHero();
    console.log(this.activeHeroIndex);
  },
};
</script>

<style>

</style>

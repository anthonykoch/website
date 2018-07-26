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
      <div class="LandingHero">
        <div>
          <p class="LandingHero-availability">Available for projects</p>
          <div class="LandingHero-title">
            <span>Need a </span>
            <transition
              name="tr-vertical-text-rotate"
              @afterEnter="onHeroShowing"
              @afterLeave="onHeroHidden"
            >
              <span
                class="LandingHero-titlePart"
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
              class="LandingHero-caption"
              v-show="isHeroShowing"
            >
              {{ activeHero.caption }}
            </p>
          </transition>
        </div>
      </div>
    </div>

    <section id="work">
      <div class="u-siteWrapper u-pt7 u-px5">
        <div class="FeatureWork">
          <h2 class="Title type-1">
            <span>Featured Work</span>
          </h2>

          <div class="FeaturedWork-section">
            <div class="FeaturedWork-images">
              <div>
                <div class="WorkImages">
                  <div class="WorkImages-container">
                    <div class="WorkImages-aspectFill">
                      <img
                        src="~/assets/images/work/mf-work-1@2x.png"
                        alt=""
                        class="WorkImages-image"
                      >
                      <!--<img
                        src="~/assets/images/work/mf-work-2@2x.png"
                        alt=""
                        class="WorkImages-image"
                      >-->
                    </div>
                    <div class="[ Tag is-absolute ]  WorkImages-tag">Web Development</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="FeaturedWork-about">
              <div class="FeatureWork-title">
                Modern Fertility
              </div>
              <p class="FeatureWork-text">
                Modern Fertility contacted me to help develop their website. At the time, I was the sole front-end developer, working alongside Tom Chokel to help Carly and Afton to help get their idea out to the world.
              </p>
              <ul class="FeaturedWork-list">
                <li>Fully responsive website</li>
                <li>Integrated checkout system</li>
                <li>Landing page development </li>
                <li>Dashboard development</li>
              </ul>

              <!--<p class="FeaturedWork-footnote">
                Note: Their website has changed quite a bit recently. However, their current landing page (as of July, 2018) was still largely developed by me.
              </p>-->
              <button class="FeaturedWork-cta">View Website</button>
            </div>
          </div>


          <div class="FeaturedWork-section  u-mb6 u-itemsCenter">
            <div class="FeaturedWork-images  u-order1">
              <div>
                <div class="WorkImages">
                  <div class="WorkImages-container has-dark-shadow">
                    <div class="WorkImages-aspectFill">
                      <img src="~/assets/images/work/plaid-work-1@2x.png" alt="" class="WorkImages-image">
                      <div class="[ Tag is-absolute ]  WorkImages-tag ">Web Development</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="FeaturedWork-about">
              <div class="FeatureWork-title">
                Plaid Technologies
              </div>
              <p class="FeatureWork-text">
                I was brought on by Plaid Technologies as a remote front-end developer. Responsibilities included creating pages from scratch, improving documention, and maintenance.
              </p>
              <!--<button class="FeaturedWork-cta">View Website</button>-->
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

    <section id="codepen" v-show="true" style="max-width: 1140px;" class="u-mxauto">
      <div class="u-siteWrapper u-pt7 u-px5">
        <h2 class="Title type-1">
          <span>Personal Projects</span>
          <!--<span class="Title__caption">
            Various projects and experiments
          </span>-->
        </h2>
      </div>

      <div class="CodepenProjects" style="background-color: transparent">
        <div class="u-siteWrapper u-px5">
          <app-project-preview-list
            :projects="projects"
            @navigate="setNavigatedProject"
          >
          </app-project-preview-list>
          <div class="u-textCenter">
            <a
              href="https://codepen.io/anthonykoch/"
              class="Button has-lightBackground has-hoverEffect1 is-sizeLarge"
            >
              View more on Codepen &rarr;
            </a>
            <!-- <a href="https://codepen.io/anthonykoch/" class="ViewMore">View more of my projects on Codepen &rarr;</a> -->
          </div>
        </div>
      </div>
    </section>

    <section id="contact">
      .
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
          title: 'design developed?',
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

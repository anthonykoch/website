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
          <p class="LandingHero-availability">
            <nuxt-link to="contact" class="Link is-white">Available for projects</nuxt-link>
          </p>
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
      <div class="u-siteWrapper u-pt4 u-pt7@lg u-gutter">

        <div class="FeatureWork">
          <h2 class="Title type-1  u-pl5@lg u-textCenter u-textLeft@lg">
            <span>Featured Work</span>
          </h2>

          <div class="FeaturedWork-grid">
            <div class="FeaturedWork-column is-left">
              <div class="FeaturedWork-media u-pl2 u-pl0@lg">
                <div class="WorkImages">
                  <div class="WorkImages-container">
                    <div class="WorkImages-aspectFill">
                      <transition name="tr-fade">
                        <a
                          href="https://modernfertility.com/"
                          class="WorkImages-link"
                          rel="noreferrer noopener"
                          target="_blank"
                          v-show="activeMFImageIndex === 0"
                        >
                          <img
                            src="~/assets/images/work/mf-work-1@2x.png"
                            alt="modern fertility landing page"
                            class="WorkImages-image"
                          >
                        </a>
                      </transition>
                      <transition name="tr-fade">
                        <a
                          href="https://modernfertility.com/"
                          class="WorkImages-link"
                          target="_blank"
                          rel="noreferrer noopener"
                          v-show="activeMFImageIndex === 1"
                        >
                          <img
                            src="~/assets/images/work/mf-work-2@2x.png"
                            alt="modern fertility landing page"
                            class="WorkImages-image"
                          >
                        </a>
                      </transition>
                    </div>
                    <div class="[ Tag is-absolute ]  WorkImages-tag">Web Development</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="FeaturedWork-column is-right is-pushedRight has-paddingLeft">
              <div>
                <div class="FeatureWork-title">
                  Modern Fertility
                </div>
                <p class="FeatureWork-text">
                  Modern Fertility approached me to assist them in developing their website. At the time, I was the sole front-end developer, working alongside Tom Chokel to help Carly and Afton to help get their new business concept out to the world.
                </p>
                <p>
                </p>
                <ul class="FeaturedWork-list">
                  <li>Developed design into responsive website</li>
                  <li>Developed checkout system</li>
                  <li>Landing page development </li>
                  <li>Dashboard development</li>
                </ul>

                <!--<p class="FeaturedWork-footnote">
                  Note: Their website has changed quite a bit recently. However, their current landing page (as of July, 2018) was still largely developed by me.
                </p>-->
                <div class="u-textCenter u-textLeft@lg">
                  <a
                    href="https://modernfertility.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="FeaturedWork-cta"
                  >
                    View Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!--<div class="u-mxauto u-textCenter" style="max-width: 500px; margin: 60px 0">
            <p></p>
          </div>-->


          <div class="FeaturedWork-grid u-mb8 u-itemsCenter">
            <div class="FeaturedWork-column is-left  u-order1@lg">
              <div class="FeaturedWork-media u-pl2 u-pl0@lg">
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
            <div class="FeaturedWork-column is-right is-pushedLeft has-paddingRight">
              <div class="FeatureWork-title">
                Plaid Technologies
              </div>
              <p class="FeatureWork-text">
                I was brought on by Plaid Technologies as a remote front-end developer. Responsibilities included turning designs into pixel perfect code, developing various features around the site, and improving load performance for the site.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>


    <!--<section id="projects" class="u-flex">

       <div class="u-size4of12"></div>
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
      <div class="u-size4of12"></div>
    </section>-->

    <section id="contact" class="u-pb8">
      <div class="u-textCenter">
        <h2 class="Title2 Title  u-gutter">
          Have a project in mind?
        </h2>
        <nuxt-link
          to="contact"
          class="Button has-lightBackground has-hoverEffect1 is-sizeLarge"
        >
          Get in touch
        </nuxt-link>
      </div>
    </section>

    <section id="codepen" v-show="true" style="max-width: 1140px;" class="u-mxauto">
      <div class="u-siteWrapper u-px5@lg u-px0  u-textCenter u-textLeft@lg">
        <h2 class="Title type-1">
          <span>Personal Projects</span>
        </h2>
      </div>

      <div class="CodepenProjects" style="background-color: transparent">
        <div class="u-siteWrapper u-px5">
          <app-project-preview-list
            :projects="projects"
            @navigate="setNavigatedProject"
            ref="projects"
          >
          </app-project-preview-list>
          <div class="u-textCenter">
            <a
              href="https://codepen.io/anthonykoch/"
              class="Button has-lightBackground has-hoverEffect1 is-sizeLarge"
            >
              View more on Codepen &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
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
      activeMFImageIndex: 0,
      activeHeroIndex: 0,
      isHeroShowing: true,
      heroItems: [
        {
          title: 'website?',
          caption: 'I develop websites that work excellently across a wide range of devices.',
        },
        {
          title: 'design developed?',
          caption: 'Have a design that needs implementation? I can bring the design to life.',
        },
        {
          title: 'hand on a project?',
          caption: `I'm experienced with React, Vue, and vanilla JS, but am always excited to take on new challenges.`,
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
      };
    },
  },

  methods: {
    loopImages() {
      setTimeout(() => {
        this.activeMFImageIndex += 1;

        if (this.activeMFImageIndex > 1) {
          this.activeMFImageIndex = 1;
        }

        this.loopImages();
      }, 3000);
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

    hideHero(delay=3500) {
      setTimeout(() => {
        this.isHeroShowing = false;
      }, delay);
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
    this.hideHero(2000);
  },
};
</script>

<style>

</style>

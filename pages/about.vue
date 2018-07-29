<template>
  <page
    :show-social="false"
  >
    <div slot="heroCaption">Freelance developer</div>
    <div slot="heroDescription">
      I'm freelance developer working remotely with companies all over the world. I started out writing JavaScript in Notepad for fun, and tried to recreate things like jQuery in order to gain understanding of the syntax and concepts of the language. I've since found myself really enjoying front-end development, and have made various projects, some of which I've put on my <a href="http://codepen.io/anthonykoch/">codepen</a> and <a href="https://github.com/anthonykoch">github</a>.
    </div>

    <!--<div class="u-flex">
      <div class="side-image about-office-background u-size12of12 u-size6of12@sm"></div>
      <section class="u-size12of12 u-size6of12@sm u-textCenter">
        <div class="u-px5 u-py8">
          <h2 class="Heading Heading--small">
            Always learning
          </h2>
          <div class="u-sizeReadable u-textLeft@md Paragraphs Paragraphs--small Paragraphs--light">
            <p>
              I believe writing maintainable and expressive code is important. There's lot of learning involved with this though. To keep current with the latest best practices as well as web technologies, I often read articles and other such material from various places around the internet such as CSSWizardy, Site Point, and Smashing Magazine.
            </p>
          </div>
        </div>
      </section>
    </div>-->

    <!--<div class="u-flex">
      <div class="side-image about-jekyll-background u-size12of12 u-size6of12@lg u-order1 u-order2@lg"></div>
      <section class="u-size12of12 u-size6of12@sm u-textCenter">
        <div class="u-px5 u-py8">
          <h2 class="[ Heading Heading--small ]  u-textCenter">About this website</h2>
          <div class="u-sizeReadable u-textLeft@md  [ Paragraphs Paragraphs--small Paragraphs--light ]">
            <p>
              This site is built with Jekyll and is hosted with Github Pages. The repository can be found <a href="https://github.com/anthonykoch/anthonykoch.github.io">here</a>.
              It was made with <b>performance</b> and <b>best practices</b> in mind. The assets are minified and compressed, and are also gzipped by Github. Each page uses a fluid layout and should display well on most mobile devices.
            </p>
            <p>
              I used <b>Sass</b> as a pre-processor, and the naming convention I used for selectors is BEM, mixed with a little bit of SUIT. Although BEM may be ugly, I've found it a great way to reduce specificity as well as give semantic meaning to the selectors. Plus, it makes naming classes a lot easier.
            </p>
          </div>
        </div>
      </section>
    </div>-->
  </page>
</template>

<script>

export default {
  components: {
    page: require('@/layouts/main').default,
    AppHero: require('@/components/Hero').default,
    AppSiteHeader: require('@/components/SiteHeader').default,
    AppSiteFooter: require('@/components/SiteFooter').default,
  },

  head() {
    return {

    };
  },
};
</script>

<style>

</style>

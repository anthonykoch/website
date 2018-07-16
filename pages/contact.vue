<template>
  <page
  >
    <!-- :show-footer="false" -->
    <div slot="heroCaption">Contact me</div>
    <div slot="heroDescription">
      If you have any questions for me or just want to say hello, you can get in touch with me through the contact form below. (Hey, that rhymed!)
    </div>

    <div class="u-py5 u-textCenter meme">
      <div>
        <input type="text" class="input u-mb4" placeholder="Name/Company">
      </div>
      <div>
        <input type="text" class="input u-mb4" placeholder="Email">
      </div>
      <div style="margin-bottom: 500px"></div>
    </div>

    <!-- <section class="Band">
      <div class="row row--medium">
        <app-contact-form></app-contact-form>
      </div>
    </section> -->
  </page>
</template>

<style lang="scss">

@import '../assets/styles/variables';

.meme {
  background-color: #f2f2f2
}

.input {
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid white;
  font-size: 20px;
  outline: 0;
  width: 460px;
  max-width: 100%;

  border-bottom: 2px solid rgba(black, 0.5);
  font-family: $app-font-family-2;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  padding: 13px 20px 13px 0;

  &:focus {
    border-bottom-color: $color-primary;
  }

  &::placeholder {
    color: rgba(black, 0.7);
  }
}

</style>

<script>
export default {
  components: {
    page: require('@/layouts/main').default,
    AppContactForm: require('@/components/ContactForm').default,
  },

  head() {
    return {
      title: 'Contact',
      meta: [
        { hid: 'description', name: 'description', content: 'If you have any questions for me or just want to say hello, you can get in touch with me through the contact form below.' },
      ],
    };
  },
};
</script>

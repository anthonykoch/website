<template>
  <page
    :showFooter="false"
    :showFullHeightHeader="true"
  >
    <div slot="heroCaption">Contact me</div>
    <div slot="heroDescription">
      If you have any questions for me or just want to say hello, you can get in touch with me through the contact form below. (Hey, that rhymed!)
    </div>

    <div class="u-py5" slot="heroLower">
      <!-- <input type="text" class="input"> -->
    </div>

    <!-- <section class="Band">
      <div class="row row--medium">
        <app-contact-form></app-contact-form>
      </div>
    </section> -->
  </page>
</template>

<style lang="scss">

.input {

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

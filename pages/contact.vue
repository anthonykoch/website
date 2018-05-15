<template>
  <div>
    <app-site-header>
      <app-hero
        slot="lower"
      >
        <div slot="caption">Contact me</div>
        <div slot="description">
          If you have any questions for me or just want to say hello, you can get in touch with me through the contact form below. (Hey, that rhymed!)
        </div>
        <app-social-icons
          slot="social"
          :social="$store.getters['social/getMediaItems']"
        ></app-social-icons>
      </app-hero>
    </app-site-header>

    <section class="Band">
      <div class="row row--medium">
        <app-contact-form></app-contact-form>
      </div>
    </section>
  </div>

</template>

<script>
export default {
  components: {
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

<style>

</style>

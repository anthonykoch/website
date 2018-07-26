<template>
  <page
    :theme="theme"
  >
    <span slot="heroCaption">Contact me</span>
    <p slot="heroDescription">
      Have a project in mind or just a general question? You can get in touch with me through the contact form below or email me at
      <a href="mailto:hello@anthonykoch.com">hello@anthonykoch.com</a>
    </p>

    <section id="contact" class="u-pb7 u-pt7">
      <form action="" class="Container is-formWidth u-mxauto">
        <div class="u-flex u-mb4">
          <div class="u-size6of12">
            <app-input
              label="Name or Company Name *"
              :input="{
                required: true,
                name: 'full_name',
                id: 'full_name',
              }"
            ></app-input>
          </div>
          <div class="u-size6of12">
            <app-input
              label="Subject"
              :input="{
                type: 'text',
                name: 'subject',
                id: 'subject',
              }"
            ></app-input>
          </div>
        </div>
        <div class="u-mb4">
          <app-input
              label="Email"
              :input="{
                required: true,
                type: 'email',
                name: 'email',
                id: 'email',
              }"
            ></app-input>
        </div>
        <div class="u-mb4">
          <app-text-area
            label="Message"
            :input="{
              required: true,
              name: 'message',
              id: 'message',
            }"
          ></app-text-area>
        </div>
        <button class="Button has-lightBackground is-sizeLarge has-hoverEffect1">
          Send message
        </button>
      </form>
    </section>
  </page>
</template>

<script>
export default {
  components: {
    page: require('@/layouts/main').default,
  },

  data() {
    return {
      theme: {
        hero: {
          isSmallWidth: true,
        },
      },
    };
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

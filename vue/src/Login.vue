<template lang="pug">
.modal(v-bind:class="{'is-active': isPopupVisible}")
  .modal-background
  .modal-content
    .columns.is-mobile
      .column.is-8.is-offset-2.window
        .columns
          .column.has-text-centered
            h1.title.has-text-weight-bold.is-4 Log in to DevTube
            p.description ...and unlock some superpowers
            .form
              br
              button.button.is-info.is-fullwidth.is-medium(@click="login('github')")
                span.icon
                  font-awesome-icon(:icon="['fab', 'github']")
                span Github
              br
              button.button.is-info.is-fullwidth.is-medium(@click="login('google')")
                span.icon
                  font-awesome-icon(:icon="['fab', 'google']")
                span Google
              br
              small
                em
                  font-awesome-icon.has-text-danger(:icon="['far', 'heart']")  
                  |  We use your email just to know it's you. We won't email you anything. Ever.
    .modal-close.is-large(aria-label="close" @click="hidePopup()")
</template>
<style scoped>
.title {
  letter-spacing: -1px;
}
.description {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.15rem;
}
</style>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters("auth", ["isPopupVisible"])
  },
  methods: {
    ...mapActions("auth", ["login", "hidePopup"])
  }
};
</script>

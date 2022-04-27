<template lang="pug">
  .modal(v-bind:class="{ 'is-active': loginInProgress }")
    .modal-background
    .modal-content
      .columns.is-mobile
        .column.is-8.is-offset-2.register
          .columns
            .column.has-text-centered
              h1.title.has-text-weight-bold.is-4 Log in to DevTube
              p.description We'll send you a magic link for authentication.
              .form
                .field
                  .control
                    input.input.is-medium(type='email' placeholder='Email' v-model="email")
                button.button.is-primary.is-fullwidth.is-medium(v-bind:class="{'is-loading': link === 'flying'}" :disabled="!isSendButtonEnabled" @click="magicLink()") {{buttonTitle}}
                br
                small
                  em
                    font-awesome-icon.has-text-danger(:icon="['far', 'heart']")  
                    |  We use your email just to know it's you. We won't email you anything. Ever.
      .modal-close.is-large(aria-label="close" @click="login(false); reset()")
</template>
<style scoped>
.register {
  margin-top: 5rem;
  background: white;
  border-radius: 10px;
  padding: 4.5rem;
}

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
import { api } from "./api";
import { mapState, mapActions } from "vuex";
export default {
  watch: {
    loginInProgress: loginInProgress => {
      const classes = document.documentElement.classList;
      if (loginInProgress) {
        classes?.add("is-clipped");
      } else {
        classes?.remove("is-clipped");
      }
    }
  },
  data: () => {
    return {
      email: undefined,
      link: "default"
    };
  },
  computed: {
    isSendButtonEnabled() {
      return this.email?.match("^(.+)@(.+)\\.(.+)$") && this.link === "default";
    },
    buttonTitle() {
      const titles = {
        default: "Send me a magic link",
        flying: "Sending...",
        emailed: "Emailed.",
        error: "Something went wrong."
      };
      return titles[this.link];
    },
    ...mapState("auth", ["loginInProgress"])
  },
  methods: {
    reset() {
      this.link = "default";
    },
    magicLink() {
      this.link = "flying";
      api
        .post(`/magic/send`, { email: this.email })
        .then(() => {
          this.link = `emailed`;
        })
        .catch(() => {
          this.link = `error`;
        });
    },
    ...mapActions("auth", ["login"])
  }
};
</script>

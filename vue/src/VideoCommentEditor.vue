<template lang="pug">
article.media
    figure.media-left
      p.image.is-rounded.is-32x32
        img.is-rounded(:src='$store.state.auth.avatar')
    .form(style="width: 100%")
      .field
        p.control
          textarea.textarea.is-small(:disabled="!hasYoutubeAccess()" placeholder='Type something here...' v-model="text" )
      .field
        .columns.is-vcentered
          .column.is-narrow(v-if="hasYoutubeAccess()")
            a.button.is-small(@click="postComment()" :disabled="!text.length" v-bind:class="{ 'is-loading': isWorking }") Post
          .column(v-else)
            .columns.is-vcentered.is-mobile
              .column.is-narrow
                a(@click="youtubeLogin()")
                  #goog(alt="Signin with Google")
              .column
                span  to post comments 
          .column
            span.help(v-if="error") 
              | Oops. something went wrong. 
              a(@click="youtubeLogin()") Sign in to YouTube
              |  and try again.
</template>
<style scoped lang="scss">
#goog {
  background-image: url(/btn_google_signin_light_normal_web@2x.png);
  background-size: contain;
  height: 36px;
  width: 150px;
  &:hover {
    background-image: url(/btn_google_signin_light_focus_web@2x.png);
  }
  &:active {
    background-image: url(/btn_google_signin_light_pressed_web@2x.png);
  }
}
</style>
<script>
import { api } from "./api";
export default {
  props: {
    replyUrl: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      disabled: false,
      isWorking: false,
      text: "",
      error: ""
    };
  },
  methods: {
    postComment() {
      this.isWorking = true;
      api
        .post(this.replyUrl, { text: this.text })
        .then(({ data }) => {
          this.text = "";
          this.$emit("commented", data);
        })
        .catch(e => (this.error = e))
        .finally(() => (this.isWorking = false));
    },
    youtubeLogin() {
      this.$store.dispatch("auth/login", "google");
    },
    hasYoutubeAccess() {
      return this.$store.getters["auth/hasYoutubeAccess"];
    }
  }
};
</script>

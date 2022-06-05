<template lang="pug">
article.media
    figure.media-left
      p.image.is-rounded.is-32x32
        img.is-rounded(:src='$store.state.auth.avatar')
    .form
      .field
        p.control
          textarea.textarea.is-small(:disabled="!hasYoutubeAccess()" placeholder='Type something here...' v-model="text")
      .field
        .columns.is-vcentered
          .column.is-narrow(v-if="hasYoutubeAccess()")
            a.button.is-small(@click="postComment()" :disabled="!text.length" v-bind:class="{ 'is-loading': isWorking }") Post
          .column(v-else)
            a(@click="youtubeLogin()") Sign in to YouTube
            span  to post comments 
          .column
            span.help(v-if="error") 
              | Oops. something went wrong. 
              a(@click="youtubeLogin()") Sign in to YouTube
              |  and try again.
</template>

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

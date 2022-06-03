<template lang="pug">
.modal.is-active
  .modal-background
  .modal-content
    .columns.is-mobile
      .column.is-10.is-offset-1.modal-body.p6
        .columns
          .column
            .field
              .control
                textarea.is-small.textarea(rows="25" type="text", v-model="prettyVideo")
        br
        br
        .columns
          .column
            .field
              .control
                .buttons.is-pulled-right
                  button.button.is-success(@click="saveVideo()" v-bind:class="{'is-loading': saving}" :disabled="!newVideo") Save
                  button.button(@click="close()") Cancel
    .modal-close.is-large(aria-label="close" @click="close()")
</template>
<script>
export default {};
</script>
<style scoped>
.modal-body {
  margin-top: 5rem;
  background: white;
  border-radius: 10px;
  padding: 4.5rem;
}
</style>
<script>
import { api } from "../src/api";
export default {
  props: {
    video: { type: Object, required: true }
  },
  data: () => {
    return {
      saving: false,
      prettyVideo: ""
    };
  },
  created() {
    this.prettyVideo = JSON.stringify(
      this.video,
      Object.keys(this.video).sort(),
      2
    );
  },
  computed: {
    newVideo() {
      try {
        return JSON.parse(this.prettyVideo);
      } catch {
        return undefined;
      }
    }
  },
  methods: {
    saveVideo() {
      this.saving = true;
      api
        .put("/videos/", this.newVideo)
        .then(() => {
          this.close();
        })
        .finally(() => (this.saving = false));
    },
    close() {
      this.$emit("close");
      const classes = document.documentElement.classList;
      classes?.remove("is-clipped");
    }
  }
};
</script>

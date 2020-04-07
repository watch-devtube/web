<template lang="pug">
  a.button.is-text.is-small(:href="'//twitter.com/intent/tweet?text=' + thanksOrBlank + encodedTitle + '&via=WatchDevTube&hashtags=' + csvTags + '&url=' + url" target="_blank" aria-label="twitter")
    font-awesome-icon(:icon="['far', 'heart']").has-text-danger
    | &nbsp; say thanks
</template>
<style lang="scss" scoped>
a {
  text-decoration: none !important;
}
.share a:hover {
  color: white;
}
</style>
<script>
export default {
  props: {
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    channel: { type: String, required: true },
    tags: { type: Array, required: false, default: () => [] },
  },
  computed: {
    thanksOrBlank() {
      return `Thanks @${this.speaker} for `;
    },
    csvTags() {
      let tags = this.tags.slice();
      tags.push("devtube");
      tags.push(this.channel);
      return tags.map((t) => t.replace(" ", "")).join(",");
    },
    encodedTitle() {
      return encodeURIComponent(this.title);
    },
    url() {
      return `https://dev.tube/video/${this.videoId}`;
    },
  },
};
</script>

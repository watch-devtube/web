<template lang="pug">
  a.button.is-text.is-small(:href="'//twitter.com/intent/tweet?text=' + thanks + encodedTitle + '&hashtags=' + csvTags + '&url=' + url" target="_blank" aria-label="twitter")
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
    speaker: { type: Array, required: true },
    channel: { type: String, required: true },
    tags: { type: Array, required: false, default: () => [] },
  },
  computed: {
    thanks() {
      const firstName = (name) => {
        const [first] = name.split(" ");
        return first.trim();
      };
      return `Thank you, ${this.speaker
        .map((it) => firstName(it.name) + " (" + "@" + it.twitter + ")")
        .join(", ")} for amazing `;
    },
    csvTags() {
      let tags = this.tags.slice();
      tags.push("DevTube");
      tags.push(this.channel.replace(/\s/g, ""));
      return tags.map((t) => t.replace(" ", "")).join(",");
    },
    encodedTitle() {
      return encodeURIComponent('"' + this.title + '"');
    },
    url() {
      return `https://dev.tube/video/${this.videoId}`;
    },
  },
};
</script>

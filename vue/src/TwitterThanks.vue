<template lang="pug">
a.button(
  :href="'//twitter.com/intent/tweet?text=' + text + '&url=' + url + '&via=WatchDevTube'",
  target="_blank",
  aria-label="twitter"
)
  span.icon
    font-awesome-icon.has-text-info(:icon="['fab', 'twitter']")
  span great talk!
</template>
<script>
export default {
  props: {
    video: { type: Object, required: true }
  },
  computed: {
    text() {
      return (
        `🚀 Great talk ` +
        this.encodedTitle +
        " by " +
        this.names +
        " " +
        this.twitters
      );
    },
    twitters() {
      return this.video.speakerTwitters.map(twitter => "@" + twitter).join(" ");
    },
    names() {
      return this.video.speakerNames
        .map(name => name)
        .reduce(
          (text, value, i, array) =>
            text + (i < array.length - 1 ? ", " : " and ") + value
        );
    },
    encodedTitle() {
      return encodeURIComponent('"' + this.video.title + '"');
    },
    url() {
      return `https://dev.tube/video/${this.video.objectID}`;
    }
  }
};
</script>

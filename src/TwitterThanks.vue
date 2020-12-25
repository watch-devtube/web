<template lang="pug">
a.button.is-text.is-small(
  :href="'//twitter.com/intent/tweet?text=' + text + '&hashtags=' + hashtags + '&url=' + url + '&via=WatchDevTube'",
  target="_blank",
  aria-label="twitter"
)
  span
    font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
    | &nbsp;
    | say thanks
</template>
<script>
export default {
  props: {
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: Array, required: true },
    channel: { type: String, required: true }
  },
  computed: {
    text() {
      return this.thanks + this.encodedTitle + " " + this.mentions;
    },
    mentions() {
      return this.speaker.map(it => "@" + it.twitter).join(" ");
    },
    hashtags() {
      const tags = [this.channel];
      return tags.map(t => t.replace(/\s|\./g, "")).join(",");
    },
    thanks() {
      const firstName = name => {
        const [first] = name.split(" ");
        return first.trim();
      };
      const everyone = this.speaker
        .map(it => firstName(it.name))
        .reduce(
          (text, value, i, array) =>
            text + (i < array.length - 1 ? ", " : " and ") + value
        );
      return `Kudos to ${everyone} for amazing `;
    },
    encodedTitle() {
      return encodeURIComponent('"' + this.title + '"');
    },
    url() {
      return `https://dev.tube/video/${this.videoId}`;
    }
  }
};
</script>

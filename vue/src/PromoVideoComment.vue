<template lang="pug">
article.media
  figure.media-left
    MagicCircle(:width='32')
      a.image.is-32x32(href="https://devternity.com?utm_source=devtube" target="_blank")
        img.is-rounded(src="/devternity.png" alt="DevTernity logo")
  .media-content
    .content
      p
        strong DevTernity Conference
        span.ml-1.mr-1 &middot; {{new Date() | ago}}
        br
        span
          b {{speaker || "Scott Hanselman"}} 
          | and other legends of software development are speaking at 
          b
            a(href="https://devternity.com?utm_source=devtube" target="_blank") DevTernity 2023
          | .
        br
</template>
<script>
import MagicCircle from "./MagicCircle.vue";

export default {
  components: { MagicCircle },
  props: {
    video: { type: Object, required: true }
  },
  data: function() {
    return {
      speaker: undefined
    };
  },
  created() {
    fetch(
      "https://raw.githubusercontent.com/devternity/devternity.com.src/master/src/event.yml"
    )
      .then(response => response.text())
      .then(event => {
        const speakerIndex = this.video.speakerTwitters.findIndex(
          speakerTwitter => event.includes(`twitter: ${speakerTwitter}`)
        );
        if (speakerIndex >= 0) {
          this.speaker = this.video.speakerNames[speakerIndex];
        }
      });
  }
};
</script>

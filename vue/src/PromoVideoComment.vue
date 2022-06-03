<template lang="pug">
article.media
  figure.media-left
    MagicCircle(:width='32')
      a.image.is-32x32(href="https://devternity.com?utm_source=devtube&utm_medium=popup" target="_blank")
        img.is-rounded(src="https://devternity.com/favicon.jpg" alt="DevTernity logo")
  .media-content
    .content
      p
        strong DevTernity Conference
        span.ml-1.mr-1 &middot; {{new Date() | ago}}
        br
        span
          b {{speaker || "Robert Martin"}} 
          | and other legends of software development will be speaking at 
          b
            a(href="https://devternity.com?utm_source=devtube&utm_medium=popup" target="_blank") DevTernity 2022
          | .
          br
          br
          | Claim your 10% discount voucher: AWSM_DEVTUBE
        br
</template>
<script>
import axios from "axios";
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
    axios
      .get(`https://devternity.com/js/event.js`)
      .then(({ data }) => data[0].program[1].schedule)
      .then(schedule => {
        this.speaker = schedule.find(({ twitter }) =>
          this.video.speakerTwitters.includes(twitter)
        )?.name;
      });
  }
};
</script>

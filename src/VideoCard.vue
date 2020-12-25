<template lang="pug">
.video
  .card
    .shadow
      VideoToggles(:videoId="id")
      router-link(:to="{ name: 'video', params: { id } }")
        .image.is-16by9(
          :style="'background-image: url(//img.youtube.com/vi/' + id + '/hqdefault.jpg)'"
        )
  br
  .videoTitle
    h1.title.is-6 {{ title | truncate(68) }}
  .columns.is-mobile
    .column
      span.has-text-grey.title.is-size-7
        span(v-if="isFeatured")
          font-awesome-icon.has-text-danger(:icon="['far', 'heart']") 
        |
        | {{ duration | duration }} · {{ recordingDate | published }}
    .column.has-text-right
      span(v-for="(each, index) in speaker")
        span.has-text-grey.title.is-size-7
          router-link(:to="'/@' + each.twitter") {{ each.name }}
        br
</template>
<style lang="scss">
.video {
  width: 318px;
}

.videoTitle {
  min-height: 4em !important;
}

.image {
  background-size: cover;
}

.shadow {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3), 0 2px 4px 0 rgba(0, 0, 0, 0.3);
}
</style>
<script>
import VideoToggles from "./VideoToggles.vue";
import dayjs from "dayjs";

export default {
  components: { VideoToggles },
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    channel: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    views: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    recordingDate: { type: Number, required: true },
    creationDate: { type: Number, required: true },
    speaker: {
      type: Array,
      required: true
    }
  },
  computed: {
    isNew() {
      const today = dayjs();
      const videoCreated = dayjs.unix(this.creationDate);
      const videoAgeInDays = today.diff(videoCreated, "days");
      return videoAgeInDays <= 7;
    }
  }
};
</script>

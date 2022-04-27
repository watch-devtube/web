<template lang="pug">
.related-videos
  .columns.is-multiline.is-mobile
    .column.is-narrow(v-for="video in hits")
      VideoCard(
        :isFeatured="video.featured",
        :speaker="video.speaker",
        :creationDate="video.creationDate",
        :recordingDate="video.recordingDate",
        :duration="video.duration",
        :views="video.views",
        :language="video.language",
        :satisfaction="video.satisfaction",
        :title="video.title",
        :id="video.objectID",
        :channel="video.channelTitle"
      )
</template>
<script>
import { api } from "./api";
import VideoCard from "./VideoCard.vue";
import { mapGetters } from "vuex";

export default {
  components: { VideoCard },
  props: {
    videoId: { type: String, required: true },
    channel: { type: String, required: true },
    speaker: { type: Array, required: true }
  },
  data() {
    return {
      hits: []
    };
  },
  computed: {
    ...mapGetters("videos", ["watchedIds"])
  },
  created() {
    const refinement = {
      speakers: this.speaker.map(it => it.twitter),
      channels: [this.channel]
    };
    const excludes = this.watchedIds.concat([this.videoId]);

    api
      .post(`/s`, {
        refinement,
        excludes
      })
      .then(({ data }) => data.hits)
      .then(hits => this.shuffle(hits).slice(0, 4))
      .then(hits => {
        this.hits = hits;
      });
  }
};
</script>

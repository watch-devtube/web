<template lang="pug">
  .related-videos
    .columns.is-multiline
      .column.is-6.is-3-widescreen.shrinkIfEmpty(v-for="video in hits")
        VideoCard(:tags="video.tags" :isFeatured="video.featured" :speaker="video.speaker" :likes="video.likes + (video.dtLikes || 0)" :dislikes="video.dislikes  + (video.dtDislikes || 0)" :creationDate="video.creationDate" :recordingDate="video.recordingDate" :duration="video.duration" :views="video.views" :satisfaction="video.satisfaction" :title="video.title" :id="video.objectID" :channel="video.channelTitle")
</template>
<style lang="scss">
.shrinkIfEmpty:empty {
  display: none !important;
}
</style>
<script>
import axios from "axios";
import VideoCard from "./VideoCard.vue";
import { mapGetters } from "vuex";

export default {
  components: { VideoCard },
  props: {
    videoId: { type: String, required: true },
    channel: { type: String, required: true },
    speaker: { type: Array, required: true },
    tags: { type: Array, required: false, default: () => [] },
  },
  computed: {
    ...mapGetters("videos", ["watchedIds"]),
  },
  asyncComputed: {
    hits() {
      const watchedIds = this.watchedIds;

      if (!this.videoId) {
        return [];
      }

      const refinement = this.speaker.length
        ? {
            "speaker.twitter": {
              $containsAny: this.speaker.map((it) => it.twitter),
            },
          }
        : this.tags.length
        ? { tags: { $containsAny: this.tags } }
        : { channelTitle: this.channel };

      console.log(refinement);
      return axios
        .post(`/api/search`, {
          requests: [
            {
              params: {
                refinement: refinement,
                sortOrder: "-satisfaction",
                excludes: watchedIds.concat([this.videoId]),
              },
            },
          ],
        })
        .then((response) => response.data.results[0].hits)
        .then((hits) => this.shuffle(hits).slice(0, 4))
        .then((hits) => {
          this.$Progress.finish();
          return hits;
        });
    },
  },
};
</script>

<template lang="pug">
.related-videos
  .columns.is-multiline.is-mobile
      VideoCard.is-12(v-for="video in hits"
        :video="video"
        :key="video.objectID"
      )
</template>
<script>
import { api } from "./api";
import VideoCard from "./VideoCard.vue";

export default {
  components: { VideoCard },
  props: {
    video: { type: Object, required: true }
  },
  data() {
    return {
      hits: []
    };
  },
  created() {
    const watched = this.$store.state.user.watched || [];
    const watchingNow = this.video.objectID;
    const irrelevant = [...watched, watchingNow];

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    api.post(`/s`).then(({ data: { videos } }) => {
      const relevantVideos = videos.filter(
        video => !irrelevant.includes(video.objectID)
      );
      this.hits = shuffle(relevantVideos).slice(0, 4);
    });
  }
};
</script>

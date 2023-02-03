<template lang="pug">
.watch
  section.section(v-if="error")
    .container
      article.message.is-danger
        .message-header
          p Error
        .message-body {{ error }}
  section.section
    .container
      .columns
        .column
          .videoWrapper.shadow
            iframe(
              :src="`https://www.youtube-nocookie.com/embed/${id}`",
              title="Embedded video",
              frameborder="0",
              allow="autoplay; encrypted-media" allowfullscreen
            )
      .columns
        .column
          span.has-text-grey.title.is-size-7 
            span.mr-4 {{ video.duration | durationFull }}
            span.mr-3 {{ video.recordingDate | published }}
            WatchingNow(:video="video" v-if="video.objectID" :minimumWatching="1")
            span(v-if="video.series")
              br
              router-link.mr-4(v-for="(serie, index) in video.series" :key="serie" :to="{ name: 'video', params: { id: serie } }" v-bind:class="{ 'has-text-grey': serie === id }") Part {{ index + 1 }}
            br
            span.mr-4(v-for="(speakerTwitter, speakerIndex) in video.speakerTwitters")
              router-link(:to="'/@' + speakerTwitter") {{ video.speakerNames[speakerIndex] }}
        .column
          .is-pulled-right.has-text-right
            VideoActions(:video="video" v-if="video.objectID")
            br
            TwitterThanks(:video="video" v-if="video.objectID")
          .clearfix
  section.section(v-if="video.objectID")
    .container
      VideoComments(:video="video" :key="video.objectID")
</template>
<style scoped lang="scss">
.shadow {
  box-shadow: 6px 6px 6px 0 rgba(0, 0, 0, 0.3), 6px 6px 6px 0 rgba(0, 0, 0, 0.3);
}

.videoWrapper {
  position: relative;
  padding-bottom: 51.6%;
  height: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
<script>
import { api } from "./api";
import RelatedVideos from "./RelatedVideos.vue";
import TwitterThanks from "./TwitterThanks.vue";
import WatchingNow from "./WatchingNow.vue";
import VideoActions from "./VideoActions.vue";
import VideoComments from "./VideoComments.vue";
export default {
  components: {
    RelatedVideos,
    TwitterThanks,
    VideoActions,
    VideoComments,
    WatchingNow
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      error: undefined,
      video: {
        speakerNames: []
      }
    };
  },
  watch: {
    $route: "fetch"
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      api
        .get("/videos/" + this.id)
        .then(({ data }) => {
          this.video = data;
          this.$emit("updateHead");
        })
        .catch(() => (window.location.href = "https://dev.tube/404.html"));
    }
  },

  head: {
    title() {
      return {
        inner: this.video.objectID
          ? this.video.title + " by " + this.video.speakerNames.join(", ")
          : this.id
      };
    },
    script() {
      return [
        {
          id: "json/ld",
          t: "application/ld+json",
          i: JSON.stringify({
            "@context": "http://schema.org/",
            "@type": "VideoObject",
            "@id": "https://dev.tube/video/" + this.id,
            uploadDate: this.video.recordingDate,
            duration: this.video.duration,
            name: this.video.title,
            description: this.video.title,
            thumbnailURL: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`,
            thumbnail: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`,
            interactionCount: this.video.likes,
            author: this.video.speakerNames.map(name => ({
              "@type": "Person",
              name
            }))
          })
        }
      ];
    }
  }
};
</script>

<template lang="pug">
.column.video.mb-6
  .columns.is-mobile.is-multiline(v-bind:class="{'is-watched': listedIn('watched'), 'has-background-danger-light': video.status === 'submitted'}")
    .column.is-3-desktop.is-3-tablet.is-12-mobile
      span.has-text-grey.is-size-7 {{addedAgo(video)}}&nbsp;
      br.is-hidden-mobile
      span.has-text-weight-bold.has-text-grey.is-size-7 thanks to @{{video.contributor}}
    .column.is-narrow
      router-link(:to="'/@' + video.speakerTwitters[speakerIndex]" :title="video.speakerNames[speakerIndex]")
          figure.image.is-48x48
            img.avatar.is-rounded(:src="avatar(video, speakerIndex)" :alt="video.speakerNames[speakerIndex]")
    .column
      h1.is-4.title
        router-link.has-text-grey-darker(:to="{ name: 'video', params: { id: video.objectID } }") 
          | {{ video.title }} ({{video.recordingDate | year}})
          | — 
          | {{video.speakerNames[speakerIndex]}}
      .tags
        router-link.has-text-weight-bold.has-text-grey.tag(v-for="topic in video.topics" :key="topic" :to="'/~' + encodeURIComponent(topic)") {{topic}}
        WatchingNow(:video="video")
      .columns
        .column
          VideoActions(:video="video")
</template>
<style lang="scss" scoped>
h1 {
  letter-spacing: -1px;
}

.avatar {
  opacity: 0.8;
  object-fit: cover;
  width: 48px;
  height: 48px;
}

.is-watched {
  .title,
  .avatar,
  .tags {
    opacity: 0.4;
  }
}
</style>
<script>
import VideoActions from "./VideoActions.vue";
import WatchingNow from "./WatchingNow.vue";
import { avatar, addedAgo } from "./helpers/videos";
export default {
  components: { VideoActions, WatchingNow },
  props: {
    video: { type: Object, required: true },
    speakerIndex: { type: Number, default: 0 }
  },
  methods: {
    avatar,
    addedAgo,
    listedIn(list) {
      const videoID = this.video.objectID;
      return this.$store.state.user[list]?.includes(videoID);
    }
  }
};
</script>

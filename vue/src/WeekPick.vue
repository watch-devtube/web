<template lang="pug">
.column.card.has-text-light
  h2.title.is-4.has-text-weight-bold.has-text-light(style="letter-spacing: -1px")
    font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
    |  Video of the week
  .columns.is-mobile.is-multiline
    .column.is-12-tablet.is-3-desktop.is-12-mobile
      span.is-size-7 expires {{expiresIn()}}
      span &nbsp;
      br.is-hidden-mobile
      a.subscribe.is-loadable.has-text-weight-bold.is-size-7(v-if="subscribedForUpdates" @click="unsubscribe()" v-bind:class="{ 'is-loading': subscriptionWip }" rel="noopener noreferrer nofollow") unsubscribe
      a.subscribe.is-loadable.has-text-weight-bold.is-size-7(v-else @click="subscribe()" v-bind:class="{ 'is-loading': subscriptionWip }" rel="noopener noreferrer nofollow") subscribe for updates
    .column.is-narrow
      MagicCircle(:width="48")
        router-link(:to="'/@' + video.speakerTwitters[speakerIndex]" :title="video.speakerNames[speakerIndex]")
          figure.image.is-48x48
            img.avatar.is-rounded(:src="avatar(video, speakerIndex)" :alt="video.speakerNames[speakerIndex]" width="48px")
    .column
      h1.title.is-size-4
        router-link.has-text-light(:to="{ name: 'video', params: { id: video.objectID } }") 
          | {{ video.title }} ({{video.recordingDate | year}})
          | — 
          | {{video.speakerNames[speakerIndex]}}
      .tags
        router-link.has-text-weight-bold.tag.tag-border.is-transparent(v-for="topic in video.topics" :key="topic" :to="'/~' + encodeURIComponent(topic)") {{topic}}
        WatchingNow(:video="video" :minimumWatching="50" :darkMode="true")
      .columns
        .column
          VideoActions(:video="video" :darkMode="true")
</template>
<style lang="scss" scoped>
.subscribe {
  color: white;
  text-decoration: underline;
}
a:hover {
  color: #dbdbdb;
}
.tag {
  text-decoration: none;
  color: white;
}
.tag-border {
  border: 1px solid #4a4a4a !important;
}
h1 {
  letter-spacing: -1px;
}
</style>
<script>
import { avatar, addedAgo, expiresIn } from "./helpers/videos";
import VideoActions from "./VideoActions";
import MagicCircle from "./MagicCircle";
import WatchingNow from "./WatchingNow";

avatar;
export default {
  components: { MagicCircle, WatchingNow, VideoActions },
  props: {
    speakerIndex: { type: Number, default: 0 },
    video: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
      subscriptionWip: false
    };
  },
  computed: {
    subscribedForUpdates() {
      return this.$store.state.user.subscribedToWeekly;
    }
  },
  methods: {
    avatar,
    addedAgo,
    expiresIn,
    subscribe() {
      if (this.requireLogin()) {
        this.subscriptionWip = true;
        this.$store
          .dispatch("user/subscribeWeekly")
          .finally(() => (this.subscriptionWip = false));
      }
    },
    unsubscribe() {
      if (this.requireLogin()) {
        this.subscriptionWip = true;
        this.$store
          .dispatch("user/unsubscribeWeekly")
          .finally(() => (this.subscriptionWip = false));
      }
    },
    requireLogin() {
      const loggedIn = this.$store.getters["auth/isLoggedIn"];
      if (!loggedIn) {
        this.$store.dispatch("auth/showPopup");
      }
      return loggedIn;
    }
  }
};
</script>

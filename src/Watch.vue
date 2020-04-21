<template lang="pug">
.watch
  section.section.body
    .container
      .columns
        .column
          .section.section(v-if="loaded && !video.objectID")
            p.is-size-1.is-size-5-mobile.has-text-centered
              | ¯\_(ツ)_/¯
              br
              br
              | There is no video with ID {{id}}.
              br
              | Try
              |
              a(href="https://dev.tube") resetting
              |
              | your criteria.
          .card(v-else)
            .card-image
              VideoToggles(:videoId="id")
              a(@click="toggleWatched(id)" v-if="auth.user")
              .videoWrapper
                iframe(:src="`https://www.youtube.com/embed/${id}?modestbranding=1&showinfo=0&rel=0`" title="Embedded video" frameborder="0" allowfullscreen)
            .card-content
                  nav.level.is-mobile
                    .level-item.has-text-centered
                      div
                        .multiple(v-if="video.speaker && video.speaker.length")
                          .media(v-for="each in video.speaker")
                              .media-left
                                  figure.image.is-32x32.is-marginless
                                    img.avatar(:src="'https://avatars.io/twitter/' + each.twitter" :alt="each.name + ' avatar'")
                              .media-content
                                .content
                                  p.title.is-6(style="margin-bottom: 1.2em")
                                    | {{each.name}}
                                  p.subtitle.is-7: a(:href="'/@' + each.twitter") @{{each.twitter}}
                              .media-right.is-hidden-mobile
                                .buttons.are-small
                                  a.button.is-danger.is-outlined(v-if="hasSubscription(subscription(each.twitter))" @click="toggleSubscription(subscription(each.twitter))")
                                    .icon.is-small
                                      font-awesome-icon(icon="times")
                                    span unsubscribe
                                  a.button.is-info.is-outlined(v-else @click="toggleSubscription(subscription(each.twitter))")
                                    span subscribe
                          .buttons.are-small
                            TwitterThanks(:videoId="video.objectID" :title="video.title" :tags="video.tags" :channel="video.channelTitle" :speaker="video.speaker")
                        .media(v-else)
                          .media-content
                            .content
                              p.title.is-5 Know the speaker?
                              p.subtitle.is-6: a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank") Boost your karma
                              a.button.is-info.is-outlined.is-small(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank") Contribute
                    .level-item.has-text-centered
                      div
                        p.heading.is-size-5
                          span(v-if="!auth.user || iDisliked"): font-awesome-icon(:icon="['far', 'thumbs-up']")
                          span(v-else-if="iLiked"): font-awesome-icon.has-text-warning(:icon="['fas', 'thumbs-up']")
                          a.has-text-info(v-else @click="putALike(id)"): font-awesome-icon(:icon="['far', 'thumbs-up']")
                        p.title.is-size-7 {{video.likes + dtLikes | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading.is-size-5
                          span(v-if="!auth.user || iLiked"): font-awesome-icon(:icon="['far', 'thumbs-down']")
                          span(v-else-if="iDisliked"): font-awesome-icon.has-text-warning(:icon="['fas', 'thumbs-down']")
                          a.has-text-info(v-else @click="putADislike(id)"): font-awesome-icon(:icon="['far', 'thumbs-down']")
                        p.title.is-size-7 {{video.dislikes + dtDislikes | kilo}}
                    .level-item.has-text-centered.is-hidden-mobile
                      div
                        p.heading.is-size-5: font-awesome-icon(:icon="['far', 'eye']")
                        p.title.is-size-7 {{video.views | kilo}}
                    .level-item.has-text-centered.is-hidden-mobile
                      div
                        p.heading.is-size-5: font-awesome-icon(:icon="['far', 'clock']")
                        p.title.is-size-7 {{video.duration | duration}}
                    .level-item.has-text-centered.is-hidden-touch
                      div
                        p.heading.is-size-5
                          a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank")
                            font-awesome-icon(:icon="['far', 'edit']")
                            |  edit
                          p.title.is-size-7 and get karma
          .content
            h3
      RelatedVideos(v-if="!!video.objectID" :videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speaker="video.speaker")
      MessageWidget(v-if="!!video.objectID" :videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speaker="video.speaker")
</template>
<style scoped lang="scss">
.columns:not(.is-desktop) {
  flex-wrap: wrap;
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
.card {
  border: none;
}
.card-content {
  p {
    color: white;
  }
  background-color: hsl(0, 0%, 7%);
  a:hover {
    color: white;
  }
}

.avatar {
  border-radius: 50%;
}
</style>
<script>
import axios from "axios";
import dayjs from "dayjs";
import RelatedVideos from "./RelatedVideos.vue";
import MessageWidget from "./MessageWidget.vue";
import VideoToggles from "./VideoToggles.vue";
import TwitterThanks from "./TwitterThanks.vue";
import NavBar from "./NavBar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { meta } from "./helpers/meta";

export default {
  components: {
    RelatedVideos,
    MessageWidget,
    TwitterThanks,
    NavBar,
    VideoToggles,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      loaded: false,
      errors: [],
      video: {},
    };
  },
  computed: {
    dtLikes() {
      return this.video.reactions?.likes?.length || 0;
    },
    dtDislikes() {
      return this.video.reactions?.dislikes?.length || 0;
    },
    iLiked() {
      let me = this.auth.user.uid;
      return this.video.reactions?.likes?.some((like) => like.uid == me);
    },
    iDisliked() {
      let me = this.auth.user.uid;
      return this.video.reactions?.dislikes?.some(
        (dislike) => dislike.uid == me
      );
    },
    ...mapState(["videos", "auth"]),
    ...mapGetters("videos", ["hasSubscription"]),
  },

  watch: {
    $route: "fetch",
  },
  created() {
    this.fetch();
  },
  methods: {
    subscription(twitterHandle) {
      return { topic: twitterHandle, type: "speaker" };
    },
    putALike(id) {
      this.$store
        .dispatch("likes/putALike", id)
        .then((r) => this.$set(this.video, "reactions", r.data))
        .catch((e) => this.$store.dispatch("notify/error", { error: e }));
    },
    putADislike(id) {
      this.$store
        .dispatch("likes/putADislike", id)
        .then((r) => this.$set(this.video, "reactions", r.data))
        .catch((e) => this.$store.dispatch("notify/error", { error: e }));
    },
    fetch() {
      this.$Progress.start();
      axios
        .get(`/api2/videos/${this.id}`)
        .then((it) => (this.video = it.data))
        .then(() => (this.loaded = true))
        .then(() => this.$emit("updateHead"))
        .then(() => this.$Progress.finish());
    },
    refineTag: function (tag) {
      this.$router.push({ name: "tag", params: { tag: tag } });
    },
    refineChannel: function (channel) {
      this.$router.push({ name: "channel", params: { channel: channel } });
    },
    ...mapActions("videos", ["toggleWatched", "toggleSubscription"]),
  },

  head: {
    title() {
      return {
        separator: "–",
        complement: "on DevTube",
        inner: this.video.title,
      };
    },
    script() {
      return [
        {
          t: "application/ld+json",
          i: JSON.stringify({
            "@context": "http://schema.org/",
            "@type": "VideoObject",
            "@id": "https://dev.tube/video/" + this.id,
            name: this.video.title,
            datePublished: dayjs(this.video.recordingDate * 1000).format(
              "YYYY-MM-DD"
            ),
            description: this.video.description,
            thumbnailURL: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`,
            thumbnail: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`,
            interactionCount: this.video.views,
            uploadDate: dayjs(this.video.recordingDate * 1000).format(
              "YYYY-MM-DD"
            ),
            author: this.video.speaker?.map((it) => ({
              "@type": "Person",
              name: it.name,
            })),
          }),
        },
      ];
    },
    meta() {
      return meta({
        title: this.video.title,
        descr: this.video.description,
        image: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`,
      });
    },
  },
};
</script>

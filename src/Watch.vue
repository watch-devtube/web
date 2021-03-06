<template lang="pug">
.watch
  section.section.body(v-if="video.objectID")
    .container
      .columns
        .column
          .shadow
            a(@click="toggleWatched(id)", v-if="auth.user")
            .videoWrapper
              iframe(
                :src="`https://www.youtube.com/embed/${id}?modestbranding=1&showinfo=0&rel=0`",
                title="Embedded video",
                frameborder="0",
                allowfullscreen
              )
      .columns.is-mobile
        .column
          p.has-text-grey.title.is-size-7 {{ video.duration | duration }} · {{ video.recordingDate | published }}
          .channel
            .columns.is-mobile.is-vcentered
              .column.is-narrow
                router-link(:to="'/channel/' + video.channelTitle")
                  figure.image.is-48x48.is-marginless
                    img.is-rounded(
                      :src="'//dossier.glitch.me/avatar/youtube'",
                      :alt="video.channelTitle + ' avatar'"
                    ) 
              .column.is-narrow
                p.is-7: strong: router-link(:to="'/channel/' + video.channelTitle") {{ video.channelTitle }}
                a.button.is-text.is-small(
                  @click="toggleChannelSubscription(video.channelTitle)"
                )
                  .icon.is-small
                    font-awesome-icon(
                      :icon="hasChannelSubscription(video.channelTitle) ? 'times' : 'plus'"
                    )
                  span {{ hasChannelSubscription(video.channelTitle) ? 'unsubscribe' : 'subscribe' }}
          .speakers(v-if="video.speaker.length")
            .columns.is-mobile.is-vcentered(v-for="speaker in video.speaker")
              .column.is-narrow
                router-link(:to="'/@' + speaker.twitter")
                  figure.image.is-48x48.is-marginless
                    img.is-rounded(
                      :src="'//dossier.glitch.me/avatar/' + speaker.twitter",
                      :alt="speaker.name + ' avatar'"
                    )
              .column.is-narrow
                p.is-7: strong: router-link(:to="'/@' + speaker.twitter") {{ speaker.name }}
                a.button.is-text.is-small(
                  @click="toggleSpeakerSubscription(speaker.twitter)"
                )
                  .icon.is-small
                    font-awesome-icon(
                      :icon="hasSpeakerSubscription(speaker.twitter) ? 'times' : 'plus'"
                    )
                  span {{ hasSpeakerSubscription(speaker.twitter) ? 'unsubscribe' : 'subscribe' }}
                  TwitterThanks(
                    :videoId="video.objectID",
                    :title="video.title",
                    :channel="video.channelTitle",
                    :speaker="video.speaker"
                  )
            br
            strong Wrong information?
            br
            a.button.is-text.is-small(
              :href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'",
              target="_blank"
            )
              span
                font-awesome-icon(:icon="['far', 'edit']")
                | &nbsp;
                | fix for karma
          .noSpeaker(v-else)
            br
            strong Know the speaker?
            br
            a.button.is-text.is-small(
              :href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'",
              target="_blank"
            )
              span
                font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
                | &nbsp;
                | contribute for karma
        .column.is-narrow
          button.button.is-small(
            @click="putALike(id)",
            :disabled="!auth.user || iDisliked || iLiked"
          )
            span
              font-awesome-icon.has-text-primary(:icon="['far', 'thumbs-up']")
              | &nbsp;
              | like
              | &nbsp;
              strong {{ video.likes + dtLikes | kilo }}
        .column.is-narrow
          button.button.is-small(
            @click="putADislike(id)",
            :disabled="!auth.user || iDisliked || iLiked"
          ) 
            span
              font-awesome-icon.has-text-danger(:icon="['far', 'thumbs-down']")
              | &nbsp;
              | dislike
              | &nbsp;
              strong {{ video.dislikes + dtDislikes | kilo }}
    section.section(style="padding-left: 0; padding-right: 0")
      h3.title Recommended videos
      RelatedVideos(
        :key="video.objectID",
        :videoId="video.objectID",
        :channel="video.channelTitle",
        :featured="video.featured",
        :speaker="video.speaker"
      )
      MessageWidget(
        :videoId="video.objectID",
        :channel="video.channelTitle",
        :speaker="video.speaker"
      )
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
import dayjs from "dayjs";
import RelatedVideos from "./RelatedVideos.vue";
import MessageWidget from "./MessageWidget.vue";
import TwitterThanks from "./TwitterThanks.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { meta } from "./helpers/meta";

export default {
  components: {
    RelatedVideos,
    MessageWidget,
    TwitterThanks
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      loaded: false,
      errors: [],
      video: {}
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
      return this.video.reactions?.likes?.some(like => like.uid == me);
    },
    iDisliked() {
      let me = this.auth.user.uid;
      return this.video.reactions?.dislikes?.some(dislike => dislike.uid == me);
    },
    ...mapState(["videos", "auth"]),
    ...mapGetters("videos", [
      "hasSubscription",
      "hasSpeakerSubscription",
      "hasChannelSubscription"
    ])
  },

  watch: {
    $route: "fetch"
  },
  created() {
    this.fetch();
  },
  methods: {
    putALike(id) {
      this.$store
        .dispatch("likes/putALike", id)
        .then(r => this.$set(this.video, "reactions", r.data))
        .catch(e => this.$store.dispatch("notify/error", { error: e }));
    },
    putADislike(id) {
      this.$store
        .dispatch("likes/putADislike", id)
        .then(r => this.$set(this.video, "reactions", r.data))
        .catch(e => this.$store.dispatch("notify/error", { error: e }));
    },
    fetch() {
      this.$Progress.start();
      api
        .get(`/videos/${this.id}`)
        .then(it => (this.video = it.data))
        .catch(() => (window.location.href = "//api.dev.tube/404.html"))
        .finally(() => {
          this.loaded = true;
          this.$emit("updateHead");
          this.$Progress.finish();
        });
    },
    refineChannel: function(channel) {
      this.$router.push({ name: "channel", params: { channel: channel } });
    },
    ...mapActions("videos", [
      "toggleWatched",
      "toggleSpeakerSubscription",
      "toggleChannelSubscription"
    ])
  },

  head: {
    title() {
      return {
        separator: "–",
        complement: "on DevTube",
        inner: this.video.title
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
            author: this.video.speaker?.map(it => ({
              "@type": "Person",
              name: it.name
            }))
          })
        }
      ];
    },
    meta() {
      return meta({
        title: this.video.title,
        descr: this.video.description,
        image: `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`
      });
    }
  }
};
</script>

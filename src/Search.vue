<template lang="pug">
section.section(style="padding-top: 0px")
  .container
    .columns.is-mobile
      .column
        Input(placeholder="Search for videos...")
      .column
        .is-pulled-right
          Sorting
  .container
    ChannelAbout(v-if="channel", :channel="channel")
    SpeakerAbout(v-if="speaker", :twitter="speaker")
    Loading(:loading="loading", :hasVideos="loadedVideos.length > 0")
      .columns.is-multiline.is-mobile
        .column.is-narrow(v-for="video in loadedVideos")
          VideoCard(
            :isFeatured="video.featured",
            :speaker="video.speaker",
            :creationDate="video.creationDate",
            :recordingDate="video.recordingDate",
            :duration="video.duration",
            :views="video.views",
            :likes="video.likes + video.dtLikes",
            :dislikes="video.dislikes + video.dtDislikes",
            :title="video.title",
            :id="video.objectID",
            :channel="video.channelTitle"
          )
      Pagination(:page="parseInt(p)", :pages="pages")
</template>
<script>
import { mapState, mapGetters } from "vuex";

import { api } from "./api";

import { meta } from "./helpers/meta";

import VideoCard from "./VideoCard.vue";
import Sorting from "./Sorting.vue";
import Input from "./Input.vue";
import Loading from "./LoadingInfo";
import Pagination from "./Pagination";
import SpeakerAbout from "./SpeakerAbout";
import ChannelAbout from "./ChannelAbout";
export default {
  components: {
    Loading,
    Pagination,
    ChannelAbout,
    SpeakerAbout,
    VideoCard,
    Input,
    Sorting
  },
  props: {
    q: { type: String, default: "" },
    p: { type: Number },
    showMyWatched: { type: Boolean, default: false },
    showFavorites: { type: Boolean, default: false },
    speaker: { type: String, required: false, default: undefined },
    channel: { type: String, required: false, default: undefined }
  },
  data: () => {
    return {
      loadedVideos: [],
      refinement: {},
      pages: 0,
      excludes: [],
      loading: false
    };
  },
  computed: {
    ...mapState(["videos", "query"]),
    ...mapGetters("videos", [
      "watchedIds",
      "favoriteIds",
      "hasSpeakerSubscription",
      "speakerSubscriptions",
      "channelSubscriptions"
    ])
  },
  watch: {
    $route: "fetch",
    "$store.state.query.sortOrder": "fetch"
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$Progress.start();
      this.loading = true;

      this.refinement = {};
      this.excludes = this.watchedIds;

      if (this.$route.name === "watched") {
        this.refinement = { ids: this.watchedIds };
        this.excludes = [];
      }

      if (this.$route.name === "favorites") {
        this.refinement = { ids: this.favoriteIds };
        this.excludes = [];
      }

      if (this.$route.name === "subscriptions") {
        this.refinement = {
          channels: this.channelSubscriptions,
          speakers: this.speakerSubscriptions
        };
      }

      if (this.speaker) {
        this.refinement = { speakers: [this.speaker] };
      }

      if (this.channel) {
        this.refinement = { channels: [this.channel] };
      }

      api
        .post("/s", {
          query: this.q,
          page: this.p,
          sortOrder: this.query.sortOrder,
          refinement: this.refinement,
          excludes: this.excludes
        })
        .then(({ data }) => {
          this.$Progress.finish();
          this.loading = false;
          this.loadedVideos = data.hits;
          this.pages = data.pages;
          this.$emit("updateHead");
        })
        .catch(error => {
          this.loading = false;
          this.$store.dispatch("notify/error", { error });
          this.$Progress.fail();
        });
    },
    title() {
      const speakerName = this.loadedVideos[0]?.speaker[0]?.name;
      const topic = this.channel
        ? this.channel
        : this.speaker
        ? `${speakerName} -`
        : "The best developer";
      return `${topic} talks, videos and tutorials from YouTube`;
    }
  },
  head: {
    title() {
      return {
        separator: "–",
        complement: "on DevTube",
        inner: this.title()
      };
    },
    meta() {
      return meta({
        title: this.title(),
        descr: this.title()
      });
    }
  }
};
</script>

<template lang="pug">
section.section(style="padding-top: 0px")
  .container(v-if="!channel && !speaker")
    .columns.is-mobile.is-vcentered
      .column
        Input
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
            :language="video.language",
            :views="video.views",
            :likes="video.likes + video.dtLikes",
            :dislikes="video.dislikes + video.dtDislikes",
            :title="video.title",
            :id="video.objectID",
            :channel="video.channelTitle"
          )
      Pagination(:page="p", :pages="pages")
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
    p: { type: Number }
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
    speaker() {
      return this.$route.params.speaker;
    },
    channel() {
      return this.$route.params.channel;
    },
    ...mapState(["videos", "query"]),
    ...mapGetters("videos", [
      "watchedIds",
      "favoriteIds",
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

      const hack = 123;

      if (this.$route.name === "watched") {
        this.refinement = { ids: [...this.watchedIds, hack] };
        this.excludes = [];
      }

      if (this.$route.name === "favorites") {
        this.refinement = { ids: [...this.favoriteIds, hack] };
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

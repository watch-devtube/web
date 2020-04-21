<template lang="pug">
  .searchContainer
    ais-index(:search-store="searchStore" index-name="videos")
      section.section(style="margin-top: 20px")
            .container
              .columns.is-mobile
                .column
                  .buttons
                    a.button.is-small.is-outlined(v-if="query.lang" @click="lang(undefined)")
                      span {{query.lang}}
                      span.icon.is-small: font-awesome-icon(:icon="['fas', 'times']")
                    router-link.button.is-small.is-outlined(v-if="tag || channel" :to="{ name: 'search' }")
                      span(v-if="tag || channel") {{tag || channel | capitalizeIfNeeded}}
                      span.icon.is-small: font-awesome-icon(:icon="['fas', 'times']")
                .column
                  .is-pulled-right
                    Sorting
              .loading(v-if="loading")
                p.is-size-1.is-size-5-mobile.has-text-centered
                  | (งツ)ว Searching for the best tech videos...
                  br
                  br
                  | We're working on reducing Cloud Function cold start time.
              .loaded(v-else)
                ais-no-results
                  template(slot-scope="props")
                    p.is-size-1.is-size-5-mobile.has-text-centered
                      | ¯\_(ツ)_/¯ There are no video matching your criteria.
                      |
                      a(href="https://dev.tube" target="_blank") Reset
                      |  your search criteria or
                      |
                      a(href="https://github.com/watch-devtube/contrib" target="_blank") contribute
                      |
                      | YouTube channels.
                section(v-if="speaker")
                  .columns
                      .column.is-3
                        .columns.is-centered
                          .column.has-text-centered
                            figure.image.is-128x128.container
                              img.is-rounded(:src="`https://avatars.io/twitter/${speaker}`" :alt="`${speaker} avatar`")
                            h2.is-size-5 {{profile.name}}
                            a.is-size-7.is-lowercased(:href="`https://twitter.com/${speaker}`" rel="nofollow")
                              font-awesome-icon(:icon="['fab', 'twitter']")
                              |  {{speaker}}
                            p.profileInfo.is-size-7 {{profile.info}}
                            hr
                            .level.is-mobile
                              .level-item.has-text-centered
                                div
                                  p.heading Videos
                                  p {{stats.videos | kilo}}
                              .level-item.has-text-centered
                                div
                                  p.heading On Stage
                                  p {{stats.stage | durationFull}}
                              .level-item.has-text-centered
                                div
                                  p.heading Likes
                                  p {{stats.likes | kilo}}
                              .level-item.has-text-centered
                                div
                                  p.heading Views
                                  p {{stats.views | kilo}}
                            br
                            .subscriptions
                              a.button(@click="toggleSpeakerSubscription(speaker)")
                                | {{hasSpeakerSubscription(speaker) ? 'Unsubscribe' : 'Subscribe'}}
                      .column.is-9
                        ais-results#videos.columns.is-multiline
                          template(slot-scope="{ result }")
                            .column.shrinkIfEmpty
                              VideoCard(
                                :tags="result.tags"
                                :isFeatured="result.featured"
                                :speaker="result.speaker"
                                :creationDate="result.creationDate"
                                :recordingDate="result.recordingDate"
                                :duration="result.duration"
                                :views="result.views"
                                :likes="result.likes + (result.dtLikes || 0)"
                                :dislikes="result.dislikes + (result.dtDislikes || 0)"
                                :title="result.title"
                                :id="result.objectID"
                                :channel="result.channelTitle")
                ais-results#videos.columns.is-multiline.is-mobile(v-if="!speaker")
                  template(slot-scope="{ result }")
                    .column.shrinkIfEmpty
                      VideoCard(
                        :tags="result.tags"
                        :isFeatured="result.featured"
                        :speaker="result.speaker"
                        :creationDate="result.creationDate"
                        :recordingDate="result.recordingDate"
                        :duration="result.duration"
                        :views="result.views"
                        :likes="result.likes + (result.dtLikes || 0)"
                        :dislikes="result.dislikes + (result.dtDislikes || 0)"
                        :title="result.title"
                        :id="result.objectID"
                        :channel="result.channelTitle")
      section.section
        .container
          .columns
            .column.has-text-right
              br
              br
              nav.paging(role="navigation" aria-label="pagination")
                ais-pagination.pagination(v-on:page-change="scrollTop" :class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<script>
import { createFromAlgoliaClient } from "vue-instantsearch";
import { mapState, mapGetters, mapActions } from "vuex";

import { dossier, api } from "./api";

import { capitalizeIfNeeded } from "./helpers/filters";
import { meta, ogImage } from "./helpers/meta";

import VideoCard from "./VideoCard.vue";
import Sorting from "./Sorting.vue";
import ExpandableTags from "./ExpandableTags.vue";
export default {
  components: {
    ExpandableTags,
    VideoCard,
    Sorting,
  },
  props: {
    q: { type: String, default: "" },
    showMyWatched: { type: Boolean, default: false },
    showMyFeed: { type: Boolean, default: false },
    showFavorites: { type: Boolean, default: false },
    speaker: { type: String, required: false, default: undefined },
    channel: { type: String, required: false, default: undefined },
    tag: { type: String, required: false, default: undefined },
  },
  data: () => {
    return {
      loading: false,
      stats: {},
      profile: {},
    };
  },
  computed: {
    ...mapState(["videos", "query"]),
    ...mapGetters("videos", [
      "watchedIds",
      "favoriteIds",
      "hasSpeakerSubscription",
    ]),
    ...mapGetters("loading", ["completed"]),
  },
  watch: {
    $route: "fetch",
    "$store.state.query.sortOrder": "syncQuery",
    "$store.state.query.lang": "syncQuery",
  },
  created() {
    let that = this;
    let fastr = {
      search(requests) {
        that.$Progress.start();
        that.loading = true;
        return api
          .post("/api/search", {
            requests,
          })
          .then(({ data }) => {
            that.$Progress.finish();
            that.loading = false;
            return data;
          })
          .then((json) => {
            that.stats = json.stats;
            return json;
          });
      },
      addAlgoliaAgent() {},
    };

    let searchStore = createFromAlgoliaClient(fastr);
    this.searchStore = searchStore;

    this.fetch();
    this.syncQuery();
  },
  methods: {
    ...mapActions("query", ["lang"]),
    ...mapActions("videos", ["toggleSpeakerSubscription"]),
    scrollTop() {
      window.scrollTo(0, 0);
    },
    syncQuery() {
      this.searchStore.queryParameters = this.query;
    },
    fetch() {
      this.searchStore.stop();

      // ## start
      // when seach query is present, tag clicking must reset it
      this.searchStore.query = this.q;
      // ## end

      this.searchStore.queryParameters = { refinement: undefined };

      let watchedVideoIds = this.watchedIds;
      let favoriteVideoIds = this.favoriteIds;

      if (this.showMyWatched) {
        this.searchStore.queryParameters = {
          refinement: { objectID: { $in: watchedVideoIds } },
        };
        this.searchStore.queryParameters = { excludes: [] };
      } else {
        this.searchStore.queryParameters = { excludes: watchedVideoIds };
      }

      if (this.showFavorites) {
        this.searchStore.queryParameters = {
          refinement: { objectID: { $in: favoriteVideoIds } },
        };
        this.searchStore.queryParameters = { excludes: [] };
      }

      if (this.showMyFeed) {
        let subscriptions = this.videos.subscriptions;

        let subscribedTags = subscriptions
          .filter((sub) => sub.type == "tag")
          .map((sub) => sub.topic);
        let subscribedChannels = subscriptions
          .filter((sub) => sub.type == "channel")
          .map((sub) => sub.topic);
        let subscribedSpeakers = subscriptions
          .filter((sub) => sub.type == "speaker")
          .map((sub) => sub.topic);

        let myFeedQuery = {
          $or: [
            { tags: { $containsAny: subscribedTags } },
            { channelTitle: { $in: subscribedChannels } },
            { "speaker.twitter": { $containsAny: subscribedSpeakers } },
          ],
        };

        this.searchStore.queryParameters = { refinement: myFeedQuery };
        this.searchStore.queryParameters = { excludes: watchedVideoIds };
      }

      if (this.speaker) {
        dossier
          .get(`/twt/${this.speaker}`)
          .then(({ data }) => data)
          .then((profile) => (this.profile = profile))
          .then(() => this.$emit("updateHead"));

        this.searchStore.queryParameters = {
          refinement: { "speaker.twitter": this.speaker },
        };
      }

      if (this.tag) {
        this.searchStore.queryParameters = {
          refinement: { tags: { $contains: this.tag } },
        };
      }
      if (this.channel) {
        this.searchStore.queryParameters = {
          refinement: { channelTitle: this.channel },
        };
      }

      this.searchStore.start();
      this.searchStore.refresh();
      this.$emit("updateHead");
    },
    title() {
      const topic = this.tag
        ? capitalizeIfNeeded(this.tag)
        : this.channel
        ? this.channel
        : this.profile.name
        ? `${this.profile.name} -`
        : "The best developer";
      return `${topic} videos and tutorials from YouTube`;
    },
  },
  head: {
    title() {
      return {
        separator: "–",
        complement: "on DevTube",
        inner: this.title(),
      };
    },
    meta() {
      return meta({
        title: this.title(),
        descr: this.title(),
        ...(this.profile.name && {
          image: ogImage(this.speaker, this.profile.name, this.profile.info),
        }),
      });
    },
  },
};
</script>

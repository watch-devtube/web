<template lang="pug">
section.section.pt-0
  loading(:active.sync="isLoading")
  aside.container.pb-6
    .columns.is-mobile.is-multiline.is-vcentered
      .column.column.is-two-thirds-desktop.is-full-tablet
        h1.title.is-1.is-size-3-mobile(style="letter-spacing: -2px") {{title}}
      .column.is-one-third-desktop.is-full-mobile
        .is-pulled-right
          .select.is-small(@change='sortingChanged()')
            select(aria-label='Sorting' v-model="sorting")
              option(value='recent') Newest first
              option(value='likes') Most liked first
        .is-pulled-left
          .is-hidden-tablet.is-size-7
            a.has-text-grey-dark(@click='toggleCategories()' v-if='categoriesVisible')
              font-awesome-icon(:icon="['far', 'eye-slash']")
              |  Hide categories
          .is-hidden-tablet.is-size-7
            a.has-text-grey-dark(@click='toggleCategories()' v-if='!categoriesVisible')
              font-awesome-icon(:icon="['far', 'eye']")
              |  Show categories
  main.container.mt-6
    .columns
      .column.is-4
        Categories.mb-6(:class="{ 'is-hidden-mobile': !forceShowCategories }"
            v-observe-visibility="categoryVisibilityChanged")
      .column.is-8
        .columns.is-multiline.is-mobile
          WeekPick(v-if="weekPick" :video="weekPick")
          VideoCard.is-12(v-for="video in videos"
            :speakerIndex="speakerIndex"
            :video="video" :key="video.objectID"
          )
        button.button.is-small(v-if="more" @click="showMore()") More
        a.button.submit-video.is-info(@click="submitVideo()") Submit a talk
        component(v-bind:is="component" v-on:close="component = ''")
</template>
<style lang="scss" scoped>
.submit-video {
  position: fixed;
  right: 15px;
  bottom: 15px;
}
</style>
<script>
const DEFAULT_TITLE = "The best tech talks for developers";

import { api } from "./api";

import Loading from "vue-loading-overlay";
import VideoCard from "./VideoCard.vue";
import Categories from "./Categories";
import SubmitVideo from "./SubmitVideo";
import WeekPick from "./WeekPick";

export default {
  components: {
    Categories,
    VideoCard,
    WeekPick,
    Loading
  },
  data: () => {
    return {
      categoriesVisible: true,
      forceShowCategories: false,
      isLoading: false,
      title: DEFAULT_TITLE,
      videos: [],
      weekPick: undefined,
      more: undefined,
      speakerIndex: 0,
      sorting: localStorage.sorting || "recent",
      component: ""
    };
  },
  watch: {
    $route: "fetchVideos"
  },
  created() {
    this.fetchVideos();
  },
  methods: {
    requireLogin() {
      const loggedIn = this.$store.getters["auth/isLoggedIn"];
      if (!loggedIn) {
        this.$store.dispatch("auth/showPopup");
      }
      return !loggedIn;
    },
    sortingChanged() {
      localStorage.sorting = this.sorting;
      this.fetchVideos();
    },
    categoryVisibilityChanged(categoriesVisible) {
      this.categoriesVisible = categoriesVisible;
    },
    toggleCategories() {
      this.forceShowCategories = !this.forceShowCategories;
    },
    submitVideo() {
      if (this.requireLogin()) {
        return;
      }
      this.component = SubmitVideo;
    },
    showMore() {
      this.fetchVideos({ p: this.more });
    },
    fetchVideos({ p } = {}) {
      this.isLoading = true;
      api
        .post("/s" + this.$route.path, {
          ...this.$route.query,
          s: this.sorting,
          p
        })
        .then(({ data: { videos, more, weekPick, title, speakerIndex } }) => {
          if (p) {
            this.videos = [...this.videos, ...videos];
          } else {
            this.videos = videos;
          }
          this.more = more;
          this.weekPick = weekPick;
          this.speakerIndex = speakerIndex || 0;
          this.title = title || DEFAULT_TITLE;
        })
        .finally(() => {
          this.isLoading = false;
          this.$emit("updateHead");
        });
    }
  },
  head: {
    title() {
      return {
        inner: this.title
      };
    }
  }
};
</script>

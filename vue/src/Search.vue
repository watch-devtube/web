<template lang="pug">
section.section.pt-0
  loading(:active.sync="isLoading")
  aside.container.pb-6
    .columns.is-mobile.is-multiline.is-vcentered
      .column.column.is-four-fifths.is-full-tablet
        h1.title.is-1.is-size-3-mobile(style="letter-spacing: -2px") {{title}}
      .column.is-full-mobile
        .is-pulled-right
          .select.is-small(@change='sortingChanged()')
            select(aria-label='Sorting' v-model="sorting")
              option(value='recent') Newest first
              option(value='likes') Most liked first
        .is-pulled-left
          .is-hidden-tablet.is-size-7
            a.has-text-grey-dark(@click='toggleCategories()' v-if='categoriesVisible' rel="noopener noreferrer nofollow")
              font-awesome-icon(:icon="['far', 'eye-slash']")
              |  Hide categories
          .is-hidden-tablet.is-size-7
            a.has-text-grey-dark(@click='toggleCategories()' v-if='!categoriesVisible' rel="noopener noreferrer nofollow")
              font-awesome-icon(:icon="['far', 'eye']")
              |  Show categories
  main.container.mt-6
    .columns
      .column.is-4
        Categories.mb-6(:class="{ 'is-hidden-mobile': !forceShowCategories }"
          v-observe-visibility="categoryVisibilityChanged")
      .column.is-8
        VideoCard.is-12(v-for="video in videos"
          :speakerIndex="speakerIndex"
          :video="video" :key="video.objectID"
        )
        button.button.is-small(v-if="more" @click="showMore()") More
        button.button.submit-video.is-info(@click="submitVideo()") Submit a talk
        component(v-bind:is="component" v-on:close="component = ''")
</template>
<style lang="scss" scoped>
.promo {
  background-color: black;
  padding: 5px 10px;
  border-radius: 10px;
}

a.devternity {
  background: linear-gradient(
    to right,
    hsl(98, 100%, 62%),
    hsl(204, 100%, 59%)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

@import "~bulma";

@include mobile {
  a.devternity {
    letter-spacing: -1px;
  }
}

a.devternity:hover {
  background: white;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.submit-video {
  position: fixed;
  right: 15px;
  bottom: 15px;
}
</style>
<script>
import { api } from "./api";

import Loading from "vue-loading-overlay";
import VideoCard from "./VideoCard.vue";
import Categories from "./Categories";
import SubmitVideo from "./SubmitVideo";
import MagicCircle from "./MagicCircle";
import { years } from "./helpers/filters";

export default {
  components: {
    Categories,
    VideoCard,
    Loading,
    MagicCircle
  },
  data: () => {
    return {
      categoriesVisible: true,
      forceShowCategories: false,
      isLoading: false,
      title: `The best tech talks for developers ${years()}`,
      videos: [],
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
        .then(({ data: { videos, more, title, speakerIndex } }) => {
          if (p) {
            this.videos = [...this.videos, ...videos];
          } else {
            this.videos = videos;
          }
          this.more = more;
          this.speakerIndex = speakerIndex || 0;
          this.title =
            (title || "The best tech talks for developers") + " " + years();
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

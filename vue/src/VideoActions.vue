<template lang="pug">
.videoActions(v-bind:class="{ 'dark': darkMode }")
  component(v-bind:is="component" v-bind="{ video }" v-on:close="component = ''")
  .buttons.are-small
    // Like
    button.button(@click="like()" v-bind:class="{ 'is-loading': wip === 'liking'}")
      span.icon
        font-awesome-icon.has-text-danger(:icon="['far', 'heart']")  
      span {{video.likes}}
      
    // Watch later
    button.button(v-if="listedIn('later')" @click="removeFrom('later')" v-bind:class="{ 'is-loading': wip === 'later'}")
      span.icon
        font-awesome-icon.has-text-info(:icon="['fas', 'clock']")
      span later            
    button.button(v-else @click="addTo('later')" v-bind:class="{ 'is-loading': wip === 'later' }")
      span.icon
        font-awesome-icon(:icon="['far', 'clock']")
      span later             

    // Watched
    button.button(v-if="listedIn('watched')"  @click="removeFrom('watched')" v-bind:class="{ 'is-loading': wip === 'watched' }")
      span.icon
        font-awesome-icon.has-text-primary(:icon="['fas', 'check-circle']")
      span watched
    button.button(v-else @click="addTo('watched')" v-bind:class="{ 'is-loading': wip === 'watched' }")
        span.icon
          font-awesome-icon(:icon="['far', 'check-circle']")
        span watched

    // Favorites
    button.button(v-if="listedIn('favorites')" @click="removeFrom('favorites')" v-bind:class="{ 'is-loading': wip === 'favorites' }")
      span.icon
        font-awesome-icon.has-text-warning(:icon="['fas', 'star']")
      span favorites
    button.button(v-else @click="addTo('favorites')" v-bind:class="{ 'is-loading': wip === 'favorites' }")
      span.icon
        font-awesome-icon(:icon="['far', 'star']")
      span favorites            

    // Edit
    button.button(v-if="isAdmin()" @click="editVideo()")
      span.icon
        font-awesome-icon(:icon="['far', 'edit']")
      span edit
      
    // Delete
    button.button(v-if="isAdmin()" @click="deleteVideo()" v-bind:class="{ 'is-loading': wip === 'deleting' }")
      span.icon
        font-awesome-icon(:icon="['fa', 'times']")
      span delete

    // Tweet
    button.button(v-if="isAdmin()" @click="tweetVideo()" v-bind:class="{ 'is-loading': wip === 'tweeting' }")
      span.icon
        font-awesome-icon(:icon="['fab', 'twitter']")
      span tweet      
</template>
<style lang="scss" scoped>
.button {
  border: none;
  background-color: transparent;
}
.dark {
  .button {
    color: white !important;
  }
}
</style>
<script>
import EditVideo from "./EditVideo.vue";
import { api } from "../src/api";
export default {
  props: {
    video: { type: Object, required: true },
    darkMode: { type: Boolean, default: false }
  },
  data: () => {
    return {
      component: "",
      wip: ""
    };
  },
  methods: {
    isAdmin() {
      return this.$store.getters["auth/isAdmin"];
    },
    requireLogin() {
      const loggedIn = this.$store.getters["auth/isLoggedIn"];
      if (!loggedIn) {
        this.$store.dispatch("auth/showPopup");
      }
      return !loggedIn;
    },
    editVideo() {
      this.component = EditVideo;
    },
    deleteVideo() {
      this.wip = "deleting";
      const videoID = this.video.objectID;
      api.delete("/videos/" + videoID).then(() => {
        this.wip = "";
      });
    },
    tweetVideo() {
      this.wip = "tweeting";
      api.post("/tweets", this.video).then(() => {
        this.wip = "";
      });
    },
    listedIn(list) {
      const videoID = this.video.objectID;
      return this.$store.state.user[list]?.includes(videoID);
    },
    like() {
      if (this.requireLogin()) {
        return;
      }
      this.wip = "liking";
      const videoID = this.video.objectID;
      api.post("/videos/" + videoID + "/like").then(({ data }) => {
        this.video.likes = data;
        this.wip = "";
      });
    },
    addTo(list) {
      if (this.requireLogin()) {
        return;
      }
      this.wip = list;
      const videoID = this.video.objectID;
      this.$store
        .dispatch("user/add", { list, videoID })
        .finally(() => (this.wip = ""));
    },
    removeFrom(list) {
      this.wip = list;
      const videoID = this.video.objectID;
      this.$store
        .dispatch("user/remove", { list, videoID })
        .finally(() => (this.wip = ""));
    }
  }
};
</script>

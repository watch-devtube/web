<template lang="pug">
.card(v-if="visible", style="height: 100%")
  .card-image
    VideoToggles(:videoId="id")
    router-link(:to="{ name: 'video', params: { id } }")
      .image.is-4by3(
        :style="'background-image: url(//img.youtube.com/vi/' + id + '/hqdefault.jpg)'"
      )
        .is-overlay
        .ttl.is-capitalized.is-size-7
          .image.is-32x32(
            :title="each.name",
            v-for="(each, index) in speaker",
            :style="'left: -' + (20 + 10 * index) + 'px'"
          )
            a.is-lowercase(:href="'/@' + each.twitter")
              img.avatar(
                :src="'https://unavatar.now.sh/twitter/' + each.twitter",
                :alt="each.name + ' avatar'"
              )
          | {{ title }}
  .card-content
    nav.level.is-mobile
      .level-item.has-text-centered
        div
          p.heading.is-capitalized: font-awesome-icon(
            :icon="['far', 'thumbs-up']"
          )
          p.title.is-size-7 {{ likes | kilo }}
      .level-item.has-text-centered
        div
          p.heading.is-capitalized: font-awesome-icon(
            :icon="['far', 'thumbs-down']"
          )
          p.title.is-size-7 {{ dislikes | kilo }}
      .level-item.has-text-centered.is-capitalized
        div
          p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'eye']")
          p.title.is-size-7 {{ views | kilo }}
      .level-item.has-text-centered
        div
          p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'clock']")
          p.title.is-size-7 {{ duration | duration }}
      .level-item.has-text-centered
        div
          p.heading.is-capitalized: font-awesome-icon(
            :icon="['far', 'calendar-plus']"
          )
          p.title.is-size-7 {{ recordingDate | published }}
    Tags(:tags="tags", :isNew="isNew", :isFeatured="isFeatured")
</template>
<style lang="scss">
.card {
  min-width: 240px;

  .avatar {
    border-radius: 50% !important;
    border: 2px solid white;
  }

  div.image {
    background-size: cover;
    div.is-overlay {
      background: url("./overlay.png");
    }

    .ttl {
      text-align: left;
      position: absolute;
      bottom: 20px;
      width: 80%;
      left: 20%;
      background-color: #1f2d3b;

      color: white;
      padding: 5px 0 5px 20px;
      padding-right: 20px;

      .image {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      .image:hover {
        z-index: 666;
      }
    }
  }
}

.card em {
  color: #ec0047;
}

.card-image:hover {
  .watch {
    opacity: 1 !important;
  }
}
</style>
<script>
import Tags from "./Tags.vue";
import VideoToggles from "./VideoToggles.vue";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

export default {
  components: { Tags, VideoToggles },
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    channel: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    views: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    recordingDate: { type: Number, required: true },
    creationDate: { type: Number, required: true },
    tags: { type: Array, required: false, default: () => [] },
    speaker: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      visible: true
    };
  },
  computed: {
    isNew() {
      let today = dayjs();
      let videoCreated = dayjs(this.creationDate * 1000);
      let videoAgeInDays = today.diff(videoCreated, "days");
      return videoAgeInDays <= 7;
    },
    ...mapGetters("videos", ["isWatched"])
  },
  methods: {
    watch: function(videoId) {
      this.$router.push({
        name: "watch",
        params: { id: videoId }
      });
    },
    refineChannel(channel) {
      this.$router.push({ name: "channel", params: { channel: channel } });
    }
  }
};
</script>

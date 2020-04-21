<template lang="pug">
  .contributors
    .section.container
      .content
        p
          strong
            a(href="https://github.com/watch-devtube/contrib" target="_blank") Contribution guideline
        p
          font-awesome-icon(:icon="['far', 'heart']").has-text-danger
          |   5000 karma points – we'll thank you on Twitter
        p
          font-awesome-icon(:icon="['far', 'heart']").has-text-danger
          |   10000 karma points — you can make any good video featured on the front page for a week.
      .columns.is-multiline.is-mobile
        .column.is-3-widescreen.is-4-tablet(v-for="contributor in contributors" v-if="contributor.name")
          .card
            .card-content
              .media
                .media-left
                  figure.image.is-48x48
                    img.avatar(:src="contributor.avatar")
                .media-content
                  p.title.is-6.is-capitalized {{contributor.name}}
                  p.subtitle.is-7
                    a(:href="'https://github.com/' + contributor.login" target="_blank") @{{contributor.login}}
              nav.level.is-mobile
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized Pulls
                    p.title.is-size-7 {{contributor.pullRequests}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized Videos
                    p.title.is-size-7 {{contributor.videosUpdated}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized: font-awesome-icon(:icon="['fab', 'youtube']")
                    p.title.is-size-7 {{contributor.channelContributions}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'user-circle']")
                    p.title.is-size-7 {{contributor.speakerContributions}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized: font-awesome-icon(:icon="['fas', 'hashtag']")
                    p.title.is-size-7 {{contributor.tagContributions}}
              ContributorRank(:karma="contributor.karma")
</template>
<style lang="scss" scoped>
header {
  background-color: #343d46;
  padding: 30px;

  @media only screen and (max-width: 768px) {
    .logo {
      width: 70px;
      margin-bottom: 10px;
    }
  }

  a {
    color: white;
  }
}

.avatar {
  border-radius: 50%;
}
</style>
<script>
import { bucket } from "./api";
import ContributorRank from "./ContributorRank.vue";
export default {
  components: { ContributorRank },
  data() {
    return {
      contributors: []
    };
  },
  created() {
    bucket
      .get("board.json")
      .then(
        ({ data }) =>
          (this.contributors = data.contributors.sort(
            (it, that) => that.karma - it.karma
          ))
      );
  },
  head: {
    title() {
      return { inner: "Community of contributors" };
    }
  }
};
</script>

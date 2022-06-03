<template lang="pug">
.comments.is-size-7
  VideoCommentEditor(:replyUrl="'/youtube/' + video.objectID + '/comments'" @commented="newCommentAdded")
  PromoVideoComment(:video="video")
  VideoComment(v-for="comment in comments" :key="comment.id" :comment="comment" :video="video")
  section.section
    button.button.is-small(v-if="nextPageToken" @click="fetchMoreComments()") More
</template>
<script>
import { api } from "./api";
import VideoCommentEditor from "./VideoCommentEditor.vue";
import PromoVideoComment from "./PromoVideoComment.vue";
export default {
  components: { VideoCommentEditor, PromoVideoComment },
  props: {
    video: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
      nextPageToken: "",
      comments: []
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    newCommentAdded(comment) {
      this.comments.unshift(comment);
    },
    fetchMoreComments() {
      this.fetchComments(this.nextPageToken);
    },
    fetchComments(nextPageToken) {
      api
        .get("/youtube/" + this.video.objectID + "/comments", {
          params: { nextPageToken }
        })
        .then(({ data }) => {
          if (!nextPageToken) {
            this.comments = data.comments;
          } else {
            this.comments = [...this.comments, ...data.comments];
          }
          this.nextPageToken = data.nextPageToken;
        });
    }
  }
};
</script>

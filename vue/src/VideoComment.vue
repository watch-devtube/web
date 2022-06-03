<template lang="pug">
article.media
  figure.media-left
    p.image.is-32x32
      img.is-rounded(:src='comment.authorProfileImageUrl')
  .media-content
    .content
      p
        strong {{comment.authorDisplayName}}
        span.ml-1.mr-1 &middot; {{comment.publishedAt | ago}}
        br
        span(style="white-space: pre-line") {{comment.textOriginal}}
        br
      .columns.is-variable.is-1.is-vcentered.is-mobile
        .column.py-2.px-1.is-narrow(v-if="comment.canReply && !replyOpen" )
          a.has-text-weight-bold.mr-3(@click="reply()") reply
        .column.py-2.px-1.is-narrow(v-if="comment.totalReplyCount && !replies.length")
          a.has-text-weight-bold(@click="showReplies(comment.id)") show {{comment.totalReplyCount}} replies
      VideoCommentEditor(v-if="replyOpen" :replyUrl="'/youtube/' + comment.id + '/replies'" @commented="replyAdded")
      VideoComment(v-for="reply in replies" :key="reply.id" :comment="reply" :video="video")
</template>
<style lang="scss" scoped>
.image {
  opacity: 0.6;
}
</style>
<script>
import { api } from "./api";
import VideoCommentEditor from "./VideoCommentEditor.vue";
export default {
  components: { VideoCommentEditor },
  props: {
    video: { type: Object, required: true },
    comment: { type: Object, required: true }
  },
  data: () => {
    return {
      replyOpen: false,
      replies: []
    };
  },
  methods: {
    replyAdded(reply) {
      this.replyOpen = false;
      this.replies.unshift(reply);
    },
    reply() {
      this.replyOpen = true;
    },
    showReplies(commentId) {
      api
        .get("/youtube/" + commentId + "/replies")
        .then(({ data }) => (this.replies = data));
    }
  }
};
</script>

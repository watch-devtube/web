const dayjs = require("dayjs");
const memoize = require("memoizee");

const googleForever = memoize(() => {
  const { google } = require('googleapis')
  return google;
})


function mapComment(it) {
  const { totalReplyCount, canReply } = it.snippet;
  const { authorDisplayName, authorProfileImageUrl, textOriginal, publishedAt, likeCount } = it.snippet.topLevelComment.snippet
  const comment = {
    id: it.id,
    authorDisplayName,
    authorProfileImageUrl,
    textOriginal,
    totalReplyCount,
    likeCount,
    publishedAt,
    canReply
  }
  return comment;
}

function mapCommentReply(c) {
  const { authorDisplayName, authorProfileImageUrl, textOriginal, publishedAt, likeCount } = c.snippet;
  const reply = {
    id: c.id,
    authorDisplayName,
    authorProfileImageUrl,
    textOriginal,
    publishedAt,
    likeCount,
  }
  return reply;
}

class Youtube {
  constructor(auth) {
    this.auth = auth;
    this.youtube = googleForever().youtube({
      version: 'v3',
      auth
    })
  }

  async fetchCommentCount(videoId) {
    const response = await this.youtube.videos.list({
      id: videoId,
      part: "statistics"
    })

    return response?.data?.items?.[0]?.statistics?.likeCount || 0
  }

  async fetchVideo(videoId) {
    const response = await this.youtube.videos.list({
      id: videoId,
      part: "snippet,statistics,contentDetails,status"
    })

    const [video] = response?.data?.items || []
    console.log(video)
    if (!video) {
      return { error: "Video doesn't exist." };
    }

    if (video.status.privacyStatus === 'private') {
      return { error: "Video is private." }
    }

    if (!video.status.embeddable) {
      return { error: "Video is not embeddable." }
    }

    const someLikes = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    return {
      video: {
        objectID: videoId,
        title: video.snippet.title,
        recordingDate: dayjs(video.snippet.publishedAt).toDate(),
        channelId: video.snippet.channelId,
        likes: parseInt(video.statistics.likeCount) || someLikes,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails.duration,
        submissionDate: new Date(),
      }
    }
  }

  async fetchReplies(commentId) {
    const response = await this.youtube.comments.list({
      parentId: commentId,
      maxResults: 50,
      part: "snippet"
    })
    return response?.data?.items?.map(mapCommentReply)
  }

  async replyToComment(parentId, text) {
    const response = await this.youtube.comments.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          parentId,
          textOriginal: text
        }
      }
    })
    return mapCommentReply(response.data)
  }

  async addComment(videoId, text) {
    const response = await this.youtube.commentThreads.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      }
    })
    return mapComment(response.data)
  }

  async fetchComments(videoId, pageToken = undefined) {
    const response = await this.youtube.commentThreads.list({
      pageToken,
      videoId,
      maxResults: 50,
      order: "relevance",
      part: "snippet"
    })

    const nextPageToken = response?.data?.nextPageToken;
    const comments = response?.data?.items?.map(mapComment);

    return {
      nextPageToken,
      comments
    }
  }
}

module.exports.Youtube = Youtube







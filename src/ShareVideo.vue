<template lang="pug">
  .share
    a(:href="'//www.facebook.com/sharer/sharer.php?u=' + url" target="_blank") 
      i.fab.fa-facebook
    a(:href="'//twitter.com/intent/tweet?text=' + thanksOrBlank + encodedTitle + '&via=WatchDevTube&hashtags=' + csvTags + '&url=' + url" target="_blank")
      | &nbsp;
      i.fab.fa-twitter-square
    a(:href="'//linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + encodedTitle" target="_blank")
      | &nbsp;
      i.fab.fa-linkedin
</template>
<style lang="scss">
  a:hover {
    color: white;
  }
</style>
<script>
  export default {
    props: { 
      videoId: { type: String, required: true },
      title: { type: String, required: true },
      speaker: { type: String, required: true },
      channel: { type: String, required: true },
      tags: { type: Array, required: false, default: []}
    },
    computed: {
      thanksOrBlank() {
        return this.speaker ? `Thanks @${this.speaker} for ` : ''
      },
      csvTags() {
        let tags = this.tags.slice()
        tags.push('devtube')
        tags.push(this.channel)
        return tags.map(t => t.replace(" ", "")).join(',')
      },
      encodedTitle() {
        return encodeURIComponent(this.title)
      },
      url() {
        return `https://dev.tube/video/${this.videoId}`
      }
    },
  }
</script>
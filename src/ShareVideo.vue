<template lang="pug">
  .share
    a.has-text-info(:href="'//www.facebook.com/sharer/sharer.php?u=' + url" target="_blank" aria-label="facebook") 
      font-awesome-icon(:icon="['fab', 'facebook-square']")
    a.has-text-info(:href="'//twitter.com/intent/tweet?text=' + thanksOrBlank + encodedTitle + '&via=WatchDevTube&hashtags=' + csvTags + '&url=' + url" target="_blank" aria-label="twitter")
      | &nbsp;
      font-awesome-icon(:icon="['fab', 'twitter-square']")
    a.has-text-info(:href="'//linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + encodedTitle" target="_blank" aria-label="twitter")
      | &nbsp;
      font-awesome-icon(:icon="['fab', 'linkedin']")
</template>
<style lang="scss">
  .share a:hover {
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
      tags: { type: Array, required: false, default: () => []}
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
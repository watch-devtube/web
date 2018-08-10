<template lang="pug">
  .related-videos
    .columns.is-multiline
      .column.is-6.is-4-widescreen.shrinkIfEmpty(v-for="video in hits")
        VideoCard(:tags="video.tags" :featured="video.featured" :speaker="video.speaker" :creationDate="video.creationDate" :recordingDate="video.recordingDate" :duration="video.duration" :views="video.views" :satisfaction="video.satisfaction" :title="video.title" :id="video.objectID" :channel="video.channelTitle")
</template>
<style lang="scss">
  .shrinkIfEmpty:empty {
    display: none !important
  }
</style>
<script>
  import axios from 'axios'
  import VideoCard from './VideoCard.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    props: {
      videoId: { type: String },
      channel: { type: String },
      speakerTwitter: { type: String },
      tags: { type: Array, required: false, default: [] }
    },
    computed: {
      ...mapGetters('videos', ['watchedIds'])
    },
    asyncComputed: {
      hits() {
        
        let shuffle = (a) => {
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        }

        let watchedIds = this.watchedIds

        if (!this.videoId) {
          return []
        }

        let refinement = 
            this.tags.length 
              ? 
                { 'tags' : { $containsAny: this.tags } }
              : 
                this.speakerTwitter 
                  ? 
                    { 'speaker.twitter': this.speakerTwitter } 
                  :
                    { 'channelTitle' : this.channel }

          
        return axios.post(`/search`, {
            requests: [
              {
                params: {
                  refinement: refinement,
                  sortOrder: '-featured',
                  excludes: watchedIds.concat([this.videoId])
                }
              }
            ]
          })
          .then(response => response.data.results[0].hits)
          .then(hits => shuffle(hits).slice(0, 3))
          .then(hits => {
            this.$Progress.finish()
            return hits
          })

      }
    },
    components: { VideoCard }
  };
</script>
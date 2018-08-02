<template lang="pug">
  .related-videos
    .columns.is-multiline
      .column.is-6.is-4-widescreen(v-for="video in hits")
        VideoCard(:newMode="newMode" :tags="video.tags" :featured="video.featured" :speaker="video.speaker" :creationDate="video.creationDate" :recordingDate="video.recordingDate" :duration="video.duration" :views="video.views" :satisfaction="video.satisfaction" :title="video.title" :id="video.objectID" :channel="video.channelTitle")
</template>
<script>
  import algolia from 'algoliasearch'
  import VideoCard from './VideoCard.vue'
  
  export default {
    props: {
      videoId: { type: String },
      channel: { type: String },
      speakerTwitter: { type: String },
      tags: { type: Array, required: false }
    },
    computed: {
      newMode() {
        return window.fastrMode
      }
    },
    asyncComputed: {
      hits() {
        
        if (!this.videoId) {
          return []
        }

        var tags = ""
        if (this.tags) {
          for (let tag of this.tags) {
            tags += ` OR tags:'${tag}' `              
          }
        }

        let noTags = !this.tags || this.tags.length == 0
        let noTwitter = !this.speakerTwitter || 0 === this.speakerTwitter.length


        let query = noTags && noTwitter 
          ? `NOT objectID:${this.videoId} AND (channelTitle:'${this.channel}')`
          : `NOT objectID:${this.videoId} AND (speaker.twitter:${this.speakerTwitter ? this.speakerTwitter : 'WHATEVER'} ${tags})`
 

        if (noTags || noTwitter) {

        }

        let shuffle = (a) => {
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        }

        var client = algolia('DR90AOGGE9', 'c2655fa0f331ebf28c89f16ec8268565')
        var index = client.initIndex('videos');
        return index.search({
          filters: query,
          hitsPerPage: 15,
          sumOrFiltersScores: true,
        }).then(it => shuffle(it.hits).slice(0, 3))
      }
    },
    components: { VideoCard }
  };
</script>
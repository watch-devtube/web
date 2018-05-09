<template lang="pug">
  .related-videos
    .columns
      .column.is-6.is-4-widescreen(v-for="video in related")
        VideoCard(:tags="video.tags" :speaker="video.speaker" :creationDate="video.creationDate" :recordingDate="video.recordingDate" :duration="video.duration" :views="video.views" :satisfaction="video.satisfaction" :title="video.title" :id="video.objectID" :channel="video.channelTitle")
</template>
<script>
  import algolia from 'algoliasearch'
  import VideoCard from './VideoCard.vue'
  
  export default {
    props: { 
      speakerTwitter: { type: String, required: false, default: '' }
    },
    data() {
      return {
        errors: [],
        related: {}
      }
    },     
    created() {
      var client = algolia('DR90AOGGE9', 'c2655fa0f331ebf28c89f16ec8268565');
      var index = client.initIndex('videos');        

      index.search({
        filters: `speaker.twitter:eduardsi OR channelTitle:devternity`,
        hitsPerPage: 3
      }, (err, content) => {
        this.related = content.hits
      })
    },
    methods: {
    },
    components: { VideoCard }
  };
</script>
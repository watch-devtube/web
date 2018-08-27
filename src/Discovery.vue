<template lang="pug">
  .discovery
    header
      .container    
        NavBar
    section.section(style="margin-top: 20px")
      .container
        .group(v-for="item in items")
          hr
          h1.title {{item.title}}
          hr
          .columns.is-multiline(v-if="item.items.length")
            .column.is-6.is-flex-tablet.is-3-widescreen.shrinkIfEmpty(v-for="result in item.items")
              VideoCard(
                :tags="result.tags" 
                :featured="result.featured" 
                :speaker="result.speaker" 
                :creationDate="result.creationDate" 
                :recordingDate="result.recordingDate" 
                :duration="result.duration" 
                :views="result.views" 
                :likes="result.likes"
                :dislikes="result.dislikes"
                :title="result.title" 
                :id="result.objectID" 
                :channel="result.channelTitle")
          span(v-else) Nothing today, folks! 
            a.button(href="https://dev.tube/contributors") Become a contributor!      
</template>
<script>
  import NavBar from './NavBar.vue'
  import Sorting from './Sorting.vue'
  import VideoCard from './VideoCard.vue'
  import axios from 'axios'
  import { mapState, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters('videos', ['watchedIds'])
    },
    asyncComputed: {
      items() {
        return axios.post(`/api/discover`, {
          excludes: this.watchedIds
        })
        .then(response => response.data)
        .then(hits => {
          this.$Progress.finish()
          return hits.results
        })        
      }
    },
    components: { NavBar, Sorting, VideoCard }
  }
</script>
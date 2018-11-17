<template lang="pug">
  .discovery
    section.section(style="margin-top: 20px")
      .container
        .group(v-for="(item, index) in items")
          br(v-if="index != 0")
          br(v-if="index != 0")
          h1.title.is-size-5 {{item.title}}
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
                :likes="result.likes + (result.dtLikes || 0)"
                :dislikes="result.dislikes + (result.dtDislikes || 0)"
                :title="result.title" 
                :id="result.objectID" 
                :channel="result.channelTitle")
          span(v-else) Nothing according to your criteria, folks. 
            a(href="https://dev.tube/contributors") Become a contributor!
</template>
<script>
  import NavBar from './NavBar.vue'
  import Sorting from './Sorting.vue'
  import VideoCard from './VideoCard.vue'
  import axios from 'axios'
  import { mapState, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapState([ 'query' ]),
      ...mapGetters('videos', ['watchedIds'])
    },
    asyncComputed: {
      items() {
        return axios.post(`/api/discover`, {
          excludes: this.watchedIds,
          lang: this.query.lang
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
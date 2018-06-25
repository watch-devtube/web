<template lang="pug">
.watch
  header
    .container
      nav.level
        .level-left
          .level-item
            a(href="//dev.tube"): img.logo(src="./logo.png")
        .level-item.has-text-centered
        .level-right
          .level-item.links.is-size-4
            a(href="/") 
              i.fas.fa-arrow-left
              |  Back to search
  section.section.body
  .container(v-if="errors.length > 0")
    .columns
      .column
        .notification.is-danger
          p {{errors[0]}}
  .container(v-if="errors.length == 0")
    .columns
      .column.is-one-half
        .card
          .card-image
            .videoWrapper
              iframe(:src="'https://www.youtube-nocookie.com/embed/' + id + '?showinfo=0'" frameborder="0" allowfullscreen)
          .card-content
                nav.level.is-mobile
                  .level-item.has-text-centered
                    div
                      p.heading: i.far.fa-smile
                      p.title.is-size-7 {{video.satisfaction}}
                  .level-item.has-text-centered
                    div
                      p.heading Views
                      p.title.is-size-7 {{video.views | views}}
                  .level-item.has-text-centered                        
                    div
                      p.heading Duration
                      p.title.is-size-7 {{video.duration | duration}}
                  .level-item.has-text-centered                        
                    div
                      p.heading Recorded
                      p.title.is-size-7 {{video.recordingDate | published}}
      .column
        .content
          h1 {{video.title}}
          .box.is-paddingless.is-shadowless(v-if="video.speaker && video.speaker.twitter")
            .media
                .media-left.has-text-left
                    figure.image.is-48x48.is-marginless
                      a.has-text-black(:href="'/@' + video.speaker.twitter")
                        img.avatar(:src="'https://avatars.io/twitter/' + video.speaker.twitter")
                .media-content
                  p.title.is-4: a.has-text-black(:href="'/@' + video.speaker.twitter") {{video.speaker.name}}
                  p.subtitle.is-6
                    a.has-text-black(:href="'/@' + video.speaker.twitter") @{{video.speaker.twitter}} 
                    a.has-text-black(:href="'https://twitter.com/' + video.speaker.twitter"): i.fab.fa-twitter
          .tags
            span.tag.is-lowercase(v-for="tag in video.tags") {{tag}}
            span.tag.is-lowercase 
              i.fab.fa-youtube 
              | &nbsp; {{video.channelTitle}}
          p {{video.description}}
          a.button(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
            span.icon: i.fab.fa-github
            span Edit
          | &nbsp;
          a.button(v-if="video.speaker && video.speaker.twitter" :href="'https://twitter.com/intent/tweet?text=Thanks @' + video.speaker.twitter + ' for ' + encodeURIComponent(video.title) + '&via=WatchDevTube&hashtags=' + video.channelTitle.split(' ')[0] + ',' + (video.tags ? video.tags.join(',') : '') + '&url=https://dev.tube/video/' + video.objectID" target="_blank")
            span.icon: i.fab.fa-twitter
            span Thank @{{video.speaker.twitter}}
          a.button(v-if="!video.speaker || !video.speaker.twitter" :href="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(video.title) + '&via=WatchDevTube&hashtags=' + video.channelTitle.split(' ')[0] + ',' + (video.tags ? video.tags.join(',') : '') + '&url=https://dev.tube/video/' + video.objectID" target="_blank")            
            span.icon: i.fab.fa-twitter
            span Share
    RelatedVideos(:videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
    MessageWidget(:videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
  Footer    
</template>
<style scoped lang="scss">
  body {

  }

  header {
    background-color: #343d46;
    padding: 10px;

    @media only screen and (max-width: 768px) {
      .logo {
        width: 50px;
        margin-bottom: 10px;
      }
    }

    .links a {
      color: white;
    }
  }


  .videoWrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
  }
  .card-content {
    p { color: white; }
    background-color: #343d46;
  }

  .avatar {
    border-radius: 50%
  }  
</style>
<script>
  import axios from 'axios';
  import RelatedVideos from './RelatedVideos.vue'
  import MessageWidget from './MessageWidget.vue'
  import Footer from './Footer.vue'
  export default {
    data: function() {
      return {
        errors: [],
        video: {}
      }
    },
    created() {
      this.fetch()
    },
    watch: {
      '$route': 'fetch'
    },
    methods: {
      fetch() {
        this.video = {}
        if (window.serverSideError) {
          this.errors.push(window.serverSideError.message)  
        } else if (window.preloadedEntity) {
          this.video = window.preloadedEntity
        } else {
          axios.get(`https://DR90AOGGE9-dsn.algolia.net/1/indexes/videos/${this.id}`, {
              headers: {'X-Algolia-Application-Id': 'DR90AOGGE9',
              'X-Algolia-API-Key': 'c2655fa0f331ebf28c89f16ec8268565' }
          }).then(response => {
            this.video = response.data
          }).catch(error => {
            this.errors.push(error)
          })   
        }     
      }
    },
    props: ['id'],
    components: { RelatedVideos, MessageWidget, Footer }
  }

</script>

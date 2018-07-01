<template lang="pug">
.watch
  header
    .container
      nav.level
        .level-left
          .level-item
            a(href="//dev.tube"): img.logo(src="/logo.png" srcset="/logo.svg")
        .level-item.has-text-centered
        .level-right
          .level-item.is-size-4
            .buttons
              a.button.is-info.is-outlined(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
                span.icon: i.fab.fa-github
                span Edit info   
              a.button.is-info.is-outlined(href="/") 
                span.icon: i.fas.fa-arrow-circle-left
                span Back to search  
  section.section.body
    .container(v-if="errors.length > 0")
      .columns
        .column
          .notification.is-danger
            p {{errors[0]}}
    .container(v-if="errors.length == 0")
      .columns
        .column.is-one-half(v-bind:class="{ active: isFullWidth }")
          .card
            .card-image
              .videoWrapper
                iframe(:src="'https://www.youtube.com/embed/' + id + '?showinfo=0'" frameborder="0" allowfullscreen)
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
                    .level-item.has-text-centered(id="toggleWidth")                        
                      a(v-on:click="toggleWidth")
                        p.heading {{ isFullWidth ? 'Collapse' : 'Expand' }}
                        p.title.is-size-7: i.fas.fa-expand
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
              span.tag.is-capitalized(v-for="tag in video.tags") {{tag}}
              span.tag.is-capitalized 
                i.fab.fa-youtube 
                | &nbsp; {{video.channelTitle}}
              a.tag.clickable.is-capitalized(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank"): i.fas.fa-edit
            p {{video.description}}
            .addthis_inline_share_toolbox
      RelatedVideos(:videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      MessageWidget(:videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      .comments
        vue-disqus(shortname="dev-tube" :identifier="id" :url="'https://dev.tube/video/' + id")
</template>
<style scoped lang="scss">
  body {

  }

  header {
    background-color: #343d46;
    padding: 10px;

    @media only screen and (max-width: 768px) {
      .logo {
        width: 70px;
        margin-bottom: 10px;
      }
    }

    .links a {
      color: white;
    }
  }

  .columns:not(.is-desktop) {
    flex-wrap: wrap;
  }

  .column.is-one-half.active {
    min-width: 100%;
  }

  @media only screen and (max-width: 768px) {
    #toggleWidth {
      display: none;
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
        &.active {
          min-width: 100%;
        }
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
  export default {
    data: function() {
      return {
        errors: [],
        video: {},
        isFullWidth: false
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
      },
      toggleWidth: function() {
        this.isFullWidth = !this.isFullWidth;
      }
    },
    props: ['id'],
    components: { RelatedVideos, MessageWidget }
  }

</script>

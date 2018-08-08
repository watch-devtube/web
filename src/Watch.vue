<template lang="pug">
.watch
  header
    .container    
      NavBar
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
              VideoToggles(:videoId="id")
              a(@click="toggleWatched(id)" v-if="auth.user")
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
            .media(v-if="video.speaker && video.speaker.twitter")
                .media-left.has-text-left
                    figure.image.is-48x48.is-marginless
                      img.avatar(:src="'https://avatars.io/twitter/' + video.speaker.twitter")
                .media-content
                  p.title.is-4 {{video.speaker.name}}
                  p.subtitle.is-6: a(:href="'/@' + video.speaker.twitter") @{{video.speaker.twitter}}
            .media(v-else)
                .media-left.has-text-left
                    figure.image.is-48x48.is-marginless
                      img.avatar(src="/unknown.png")
                .media-content
                  p.title.is-4 Know the speaker?
                  p.subtitle.is-6
                    a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
                      i.fas.fa-heart
                      |  contribute
            .media
            .tags
              a.tag.is-capitalized(v-for="tag in video.tags" @click="refineTag(tag)") {{tag}}
              a.tag.is-capitalized(@click="refineChannel(video.channelTitle)")
                i.fab.fa-youtube 
                | &nbsp; {{video.channelTitle}}
            p {{video.description}}
            p
              | Enjoyed the video?
              ShareVideo(:videoId="video.objectID" :title="video.title" :channel="video.channelTitle" :tags="video.tags" :speaker="video.speaker ? video.speaker.twitter : ''")
            p(v-if="video.speaker")
              | Wrong data? 
              a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
                i.fas.fa-heart
                |  contribute

      RelatedVideos(:videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      MessageWidget(:videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      .comments
        vue-disqus(shortname="dev-tube" :identifier="id" :url="'https://dev.tube/video/' + id")
</template>
<style scoped lang="scss">
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
  import VideoToggles from './VideoToggles.vue'
  import NightMode from './NightMode.vue'
  import ShareVideo from './ShareVideo.vue'
  import NavBar from './NavBar.vue'
  import { mapState, mapActions, mapGetters } from 'vuex'

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
    computed: {
      ...mapState([ 'videos', 'auth' ]),
      ...mapGetters('videos', ['isWatched'])
    },
    methods: {
      fetch() {
        this.video = {}
        if (window.serverSideError) {
          this.errors.push(window.serverSideError.message)  
        } else if (window.preloadedEntity) {
          this.video = window.preloadedEntity
          this.$Progress.finish()
        } else {
          axios.get(`https://DR90AOGGE9-dsn.algolia.net/1/indexes/videos/${this.id}`, {
              headers: {'X-Algolia-Application-Id': 'DR90AOGGE9',
              'X-Algolia-API-Key': 'c2655fa0f331ebf28c89f16ec8268565' }
          }).then(response => {
            this.video = response.data
            this.$Progress.finish()
          }).catch(error => {
            this.errors.push(error)
          })   
        }     
      },
      toggleWidth: function() {
        this.isFullWidth = !this.isFullWidth;
      },
      refineTag: function (tag) {
        this.$router.push({ name: 'tag', params: { tag: tag } })
      },
      refineChannel: function (channel) {
        this.$router.push({ name: 'channel', params: { channel: channel } } )
      },
      ...mapActions('videos', [ 'toggleWatched' ])
    },
    props: ['id'],
    components: { RelatedVideos, MessageWidget, NightMode, ShareVideo, NavBar, VideoToggles}
  }

</script>

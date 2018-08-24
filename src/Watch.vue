<template lang="pug">
.watch
  header
    .container
      NavBar
  section.section.body
    .container
      .columns
        .column
          .card
            .card-image
              VideoToggles(:videoId="id")
              a(@click="toggleWatched(id)" v-if="auth.user")
              .videoWrapper
                iframe(:src="'https://www.youtube.com/embed/' + id + '?showinfo=0&rel=0'" frameborder="0" allowfullscreen)
            .card-content
                  nav.level.is-mobile
                    .level-item.has-text-centered
                      div
                        p.heading: a: font-awesome-icon(:icon="['far', 'thumbs-up']")
                        p.title.is-size-7 {{video.likes | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading: a: font-awesome-icon(:icon="['far', 'thumbs-down']")
                        p.title.is-size-7 {{video.dislikes | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading: font-awesome-icon(:icon="['far', 'eye']")
                        p.title.is-size-7 {{video.views | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading Duration
                        p.title.is-size-7 {{video.duration | duration}}
                    .level-item.has-text-centered
                      div
                        p.heading Recorded
                        p.title.is-size-7 {{video.recordingDate | published}}
                    .level-item.has-text-centered
                      div
                        p.heading Share
                        p.title.is-size-7
                          ShareVideo(:videoId="video.objectID" :title="video.title" :channel="video.channelTitle" :tags="video.tags" :speaker="video.speaker ? video.speaker.twitter : ''")
          .content
            h3
            h3.title {{video.title}}
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
                      |  contribute for karma
            .media
            .columns
              .column.is-narrow
                .tags
                  a.tag(v-for="tag in video.tags" @click="refineTag(tag)") {{tag | capitalizeIfNeeded}}
                  a.tag.is-capitalized(@click="refineChannel(video.channelTitle)")
                    i.fab.fa-youtube 
                    | &nbsp; {{video.channelTitle}}
              .column
                p(v-if="video.speaker")
                  | Wrong data? 
                  a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
                    i.fas.fa-heart
                    |  contribute
            p {{video.description}}
      RelatedVideos(:videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      MessageWidget(:videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      .comments
        vue-disqus(shortname="dev-tube" :identifier="id" :url="'https://dev.tube/video/' + id")
</template>
<style scoped lang="scss">
  header {
    padding: 10px;
  }

  .columns:not(.is-desktop) {
    flex-wrap: wrap;
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
    a:hover {
      color: white;
    }
  }

  .avatar {
    border-radius: 50%
  }  
</style>
<script>
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
        this.video = window.preloadedEntity
        this.$Progress.finish()   
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

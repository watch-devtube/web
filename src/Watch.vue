<template lang="pug">
.watch
  section.section.body
    .container
      .columns
        .column
          .card
            .card-image
              VideoToggles(:videoId="id")
              a(@click="toggleWatched(id)" v-if="auth.user")
              .videoWrapper
                iframe(:src="'https://www.youtube.com/embed/' + id + '?modestbranding=1&showinfo=0&rel=0'" title="Embedded video" frameborder="0" allowfullscreen)
            .card-content
                  nav.level.is-mobile
                    .level-item.has-text-centered
                      div
                        p.heading
                          span(v-if="!auth.user || iDisliked"): font-awesome-icon(:icon="['far', 'thumbs-up']")
                          span(v-else-if="iLiked"): font-awesome-icon.has-text-warning(:icon="['fas', 'thumbs-up']")
                          a(v-else @click="putALike(id)"): font-awesome-icon(:icon="['far', 'thumbs-up']")
                        p.title.is-size-7 {{video.likes + dtLikes | kilo}} 
                    .level-item.has-text-centered
                      div
                        p.heading
                          span(v-if="!auth.user || iLiked"): font-awesome-icon(:icon="['far', 'thumbs-down']")
                          span(v-else-if="iDisliked"): font-awesome-icon.has-text-warning(:icon="['fas', 'thumbs-down']")
                          a(v-else @click="putADislike(id)"): font-awesome-icon(:icon="['far', 'thumbs-down']")
                        p.title.is-size-7 {{video.dislikes + dtDislikes | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading: font-awesome-icon(:icon="['far', 'eye']")
                        p.title.is-size-7 {{video.views | kilo}}
                    .level-item.has-text-centered
                      div
                        p.heading Length
                        p.title.is-size-7 {{video.duration | duration}}
                    .level-item.has-text-centered
                      div
                        p.heading Date
                        p.title.is-size-7 {{video.recordingDate | published}}
                    .level-item.has-text-centered.is-hidden-touch
                      div
                        p.heading Share
                        p.title.is-size-7
                          ShareVideo(:videoId="video.objectID" :title="video.title" :channel="video.channelTitle" :tags="video.tags" :speaker="video.speaker ? video.speaker.twitter : ''")
          .content          
            h3
            .columns.is-vcentered.is-mobile
              .column.is-narrow(v-for="tag in video.tags") 
                .tags.has-addons
                  a.tag(@click="refineTag(tag)") {{tag | capitalizeIfNeeded}}
                  a.tag.is-delete(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.yml'" target="_blank")
              .column
                a.tag.is-capitalized(@click="refineChannel(video.channelTitle)")
                  font-awesome-icon(:icon="['fab', 'youtube']") 
                  | &nbsp; {{video.channelTitle}}                        
            h2.title.is-4 {{video.title}}
            .media(v-if="video.speaker && video.speaker.twitter" style="margin-bottom: 1em")
                .media-left.has-text-left
                    figure.image.is-32x32.is-marginless
                      img.avatar(:src="'https://avatars.io/twitter/' + video.speaker.twitter" :alt="video.speaker.name + ' avatar'")
                .media-content
                  p.title.is-5 {{video.speaker.name}}
                  p.subtitle.is-6: a(:href="'/@' + video.speaker.twitter") @{{video.speaker.twitter}}            
            p.is-size-6 {{video.description}}            
      RelatedVideos(:videoId="video.objectID" :channel="video.channelTitle" :featured="video.featured" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
      MessageWidget(:videoId="video.objectID" :channel="video.channelTitle" :tags="video.tags" :speakerTwitter="video.speaker ? video.speaker.twitter : ''")
</template>
<style scoped lang="scss">

  .columns:not(.is-desktop) {
    flex-wrap: wrap;
  }

  .videoWrapper {
    position: relative;
    padding-bottom: 51.6%;
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
        video: {
          reactions: {}
        },
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
      dtLikes() {
        return (this.video.reactions && this.video.reactions.likes.length) || 0
      },
      dtDislikes() {
        return (this.video.reactions && this.video.reactions.dislikes.length) || 0
      },
      iLiked() {
        let me = this.auth.user.uid
        return this.video.reactions && this.video.reactions.likes.some(like => like.uid == me)
      },
      iDisliked() {
        let me = this.auth.user.uid
        return this.video.reactions && this.video.reactions.dislikes.some(dislike => dislike.uid == me)
      },
      ...mapState([ 'videos', 'auth' ])
    },
    methods: {
      putALike(id) {
        this.$store.dispatch('likes/putALike', id)
        .then(r => this.$set(this.video, 'reactions', r.data))
        .catch(e => this.$store.dispatch("notify/error", { error: e }))
      },
      putADislike(id) {
        this.$store.dispatch('likes/putADislike', id)
          .then(r => this.$set(this.video, 'reactions', r.data))
          .catch(e => this.$store.dispatch("notify/error", { error: e }))
      },
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

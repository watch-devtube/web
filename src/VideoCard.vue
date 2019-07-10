<template lang="pug">
  .card(style="height: 100%; width:100%" v-if="visible")
      .card-image
        VideoToggles(:videoId="id")
        a(:href="'/video' + '/' + id")
          .image.is-4by3(:style="'background-image: url(//img.youtube.com/vi/' + id + '/hqdefault.jpg)'")
            .is-overlay
            .ttl.is-capitalized.is-size-7 
              .image.is-32x32(v-if="speaker" :title="speaker.name")
                a.is-lowercase(:href="'/@' + speaker.twitter")
                  img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter" :alt="speaker.name + ' avatar'")
              | {{title}}
      .card-content
          nav.level.is-mobile
            .level-item.has-text-centered
              div
                p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'thumbs-up']")
                p.title.is-size-7 {{likes | kilo}} 
            .level-item.has-text-centered
              div
                p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'thumbs-down']")
                p.title.is-size-7 {{dislikes | kilo}}
            .level-item.has-text-centered.is-capitalized
              div
                p.heading.is-capitalized: font-awesome-icon(:icon="['far', 'eye']")
                p.title.is-size-7 {{views | kilo}}
            .level-item.has-text-centered
              div                
                p.heading.is-capitalized Duration
                p.title.is-size-7 {{duration | duration}}
            .level-item.has-text-centered
              div                
                p.heading.is-capitalized Recorded
                p.title.is-size-7 {{recordingDate | published}}                
          Tags(:tags="tags" :isNew="isNew" :isFeatured="isFeatured" :channel="channel")
</template>
<style lang="scss">

  .card {

    position: relative;
    transition: 0.4s ease;  

    .avatar {
      border-radius: 50% !important;
    }


    div.image {
      background-size: cover;
        div.is-overlay {
          transition: 0.4s ease;
          background: url('./overlay.png');
        }

    .ttl {
        text-align: left;
        position: absolute;
        bottom: 20px;
        width: 80%;
        left: 20%;
        background-color:#1f2d3b;
        
        color: white;
        padding: 5px 0 5px 20px;
        padding-right: 20px;

        .image {
          position: absolute;
          top: 0; left: -20px; bottom: 0;
          margin: auto;
        }

        .image:hover {
          animation: pulse 1s infinite linear;
        }
    }       
      } 

  }

  .card em {
    color: #ec0047;
  }

  .card-image:hover {
    .watch {
      opacity: 1 !important;
    }
  }
</style>
<script>
  import Tags from './Tags.vue'
  import VideoToggles from './VideoToggles.vue'
  import dayjs from 'dayjs'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    props: { 
      id: { type: String, required: true },
      title: { type: String, required: true },
      isFeatured: { type: Boolean, default: false },
      channel: { type: String, required: true },
      likes: { type: Number, required: true },
      dislikes: { type: Number, required: true },
      views: { type: Number, default: 0 },
      duration: { type: Number, required: true },
      recordingDate: { type: Number, required: true },
      creationDate: { type: Number, required: true },
      tags: { type: Array, required: false },
      speaker: {
        required: false,
        name: {
          type: String
        },
        twitter: {
          type: String
        }        
      }
    },
    data: function() {
      return {
        visible: true
      }
    },
    computed: {
      isNew() {
        let today = dayjs()
        let videoCreated = dayjs(this.creationDate * 1000)
        let videoAgeInDays = today.diff(videoCreated, 'days')
        return videoAgeInDays <= 7
      },
      ...mapGetters('videos', ['isWatched']),
    },
    methods: {
      watch: function(videoId) {
        this.$router.push({
          name: 'watch',
          params: { id: videoId }
        });
      },
      refineChannel(channel) {
        this.$router.push({ name: 'channel', params: { channel: channel } } )
      }      
    },    
    components: { Tags, VideoToggles }
  };
</script>
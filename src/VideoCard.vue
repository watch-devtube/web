<template lang="pug">
  .card(style="height: 100%; width:100%" v-if="visible")
      .card-image
        VideoToggles(:videoId="id")
        a(:href="'/video' + '/' + id")
          .image.is-4by3(:style="'background-image: url(//img.youtube.com/vi/' + id + '/hqdefault.jpg)'")
            i.fab.fa-youtube.watch
            .is-overlay
            .ttl.is-capitalized.is-size-7 
              .image.is-32x32(v-if="speaker" :title="speaker.name")
                router-link.is-lowercase(:to="{ name: 'speaker', params: { speaker : speaker.twitter} }")
                  img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
              .image.is-32x32(title="Add speaker" v-else)
                a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank")
                  img.avatar(src="/add-speaker.png")
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
          Tags(:tags="tags" :isNew="isNew" :channel="channel")
          .channel
            p.subtitle.is-7
              a.is-capitalized(v-on:click="refineChannel(channel)")
                i.fab.fa-youtube
                | &nbsp; {{channel | truncate(25)}}
          .contribute
            p.subtitle.is-7
              a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank")
                font-awesome-icon(icon="edit")
                |  edit
</template>
<style lang="scss">

  .card {

    position: relative;
    transition: 0.4s ease;  


    .channel {
      position: absolute; 
      left: 10px; 
      bottom: 10px;      
    }

    .contribute {
      position: absolute; 
      right: 10px; 
      bottom: 10px;
    }

    .avatar {
      border-radius: 50% !important;
    }


    div.image {
      background-size: cover;

        .watch {
          color: white;
          opacity: 0.5;
          transition: 0.4s ease;
          position: absolute;
          top: 55%;
          left: 50%;
          z-index: 1;
          height: 20%;
          width: 50%;
          margin: -15% 0 0 -25%;
        }

        .watch:hover {
          animation: pulse 1s infinite linear;
        }

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
          img {
            border: 1px solid white;
          }
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
<template lang="pug">
  .card
      .card-image
        .image.is-16by9(:style="'background-image:url(https://img.youtube.com/vi/' + id + '/maxresdefault.jpg)'")
          a.watch.button.is-outlined.is-inverted.is-link(v-on:click.stop.prevent="watch(id)") Watch
          .is-overlay
          p.ttl.is-uppercase.is-size-7 {{title}}
      .card-content
          .media(v-if="speaker")
              .media-left
                  figure.image.is-48x48
                    img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
              .media-content
                p.title.is-4 {{speaker.name}}
                p.subtitle.is-6 @{{speaker.twitter}}
          nav.level.is-mobile
            .level-item.has-text-centered
              div
                p.heading: i.far.fa-smile
                p.title.is-size-7 {{satisfaction}}%
            .level-item.has-text-centered
              div
                p.heading Views
                p.title.is-size-7 {{views | views}}
            .level-item.has-text-centered
              div                
                p.heading Duration
                p.title.is-size-7 {{duration | duration}}
            .level-item.has-text-centered
              div                
                p.heading Recorded
                p.title.is-size-7 {{recordingDate | published}}
          Tags(:tags="tags" :clickable="tagsClickable" :channel="channel" :creationDate="creationDate")
</template>
<style lang="scss">
  .card {
    transition: 0.4s ease;
  }

  .card {

    .avatar {
      border-radius: 50%
    }

    div.image {
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;

        .watch {
          z-index: 1;
          position: absolute;
          right: 5px;
          top: 5px;
          transition: 0.4s ease;
        }

        div.is-overlay {
          transition: 0.4s ease;
          background: url('./overlay.png');
        }

    .ttl {
        position: absolute;
        bottom: 20px;
        width: 90%;
        left: 10%;
        background-color: #4988cb;
        opacity: 0.9;
        color: white;
        padding: 5px 0 5px 20px;
        /*font-size: 0.8rem;*/
        padding-right: 20px;
    }       
      } 

  }

  .card:not(.verified) {
  }

  .card em {
    color: #ec0047;
  }

  .card:hover {

    box-shadow: 0 2px 3px rgba(10,10,10,.20), 0 0 0 1px rgba(10,10,10,.20);

    div.is-overlay {
      // opacity: 0;
    }
  } 
</style>
<script>
  import Tags from './Tags.vue'
  export default {
    props: { 
      id: { type: String, required: true },
      title: { type: String, required: true },
      channel: { type: String, required: true },
      satisfaction: { type: Number, required: true },
      views: { type: Number, required: true },
      duration: { type: Number, required: true },
      recordingDate: { type: Number, required: true },
      creationDate: { type: Number, required: true },
      tags: { type: Array, required: true },
      tagsClickable: { type: Boolean, default: false},
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
    methods: {
      watch: function(videoId) {
        this.$router.push({
          name: 'watch',
          params: { id: videoId }
        });
      }
    },    
    components: { Tags }
  };
</script>
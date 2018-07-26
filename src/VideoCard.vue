<template lang="pug">
  .card(style="height: 100%;")
      .card-image
        a(:href="'/video' + '/' + id")
          .image.is-4by3(:style="'background-image: url(//img.youtube.com/vi/' + id + '/hqdefault.jpg)'")
            i.is-size-3.fab.fa-youtube.watch
            .is-overlay
            p.ttl.is-capitalized.is-size-7 {{title}}
      .card-content
          .media(v-if="speaker && !newMode")
              .media-left
                  figure.image.is-48x48
                    a(:href="'/@' + speaker.twitter"): img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
              .media-content
                p.title.is-6: a.has-text-black(:href="'/@' + speaker.twitter") {{speaker.name}}
                p.subtitle.is-7 
                  a.has-text-black(:href="'/@' + speaker.twitter") @{{speaker.twitter}} 
                  a.has-text-black(target="_blank" :href="'https://twitter.com/' + speaker.twitter"): i.fab.fa-twitter
          .media(v-if="newMode && speaker")
              .media-left
                  figure.image.is-48x48
                    img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
              .media-content
                p.title.is-6 {{speaker.name}}
                p.subtitle.is-7 
                  router-link.is-lowercase(:to="{ name: 'speaker', params: { speaker : speaker.twitter} }") @{{speaker.twitter}} 
          .media(v-if="newMode && !speaker")
              .media-left
                figure.image.is-48x48
                  img.avatar(src="/unknown.png")
              .media-content(v-if="!speaker")
                p.title.is-6 Know the speaker?
                p.subtitle.is-7
                  a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank")
                    i.fas.fa-heart
                    |  contribute
          nav.level.is-mobile
            .level-item.has-text-centered
              div
                p.heading.is-capitalized: i.far.fa-smile
                p.title.is-size-7 {{satisfaction}} 
            .level-item.has-text-centered.is-capitalized
              div
                p.heading.is-capitalized Views
                p.title.is-size-7 {{views | views}}
            .level-item.has-text-centered
              div                
                p.heading.is-capitalized Duration
                p.title.is-size-7 {{duration | duration}}
            .level-item.has-text-centered
              div                
                p.heading.is-capitalized Recorded
                p.title.is-size-7 {{recordingDate | published}}                
          Tags(:tags="tags" :isNew="isNew" :featured="featured" :clickable="tagsClickable" :channel="channel")
          .contribute(v-if="speaker")
            p.subtitle.is-7
              | Wrong data? 
              a(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + id + '.yml'" target="_blank")
                i.fas.fa-heart
                |  contribute
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
      background-size: cover;
      position: relative;

        .watch {
          color: white;
          opacity: 0.5;
          transition: 0.4s ease;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1;
          height: 30%;
          width: 50%;
          margin: -15% 0 0 -25%;
        }

        div.is-overlay {
          transition: 0.4s ease;
          background: url('./overlay.png');
        }

    .ttl {
        text-align: left;
        position: absolute;
        bottom: 20px;
        width: 90%;
        left: 10%;
        background-color: #4988cb;
        
        color: white;
        padding: 5px 0 5px 20px;
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
    .watch {
      opacity: 1 !important;
    }
  } 
</style>
<script>
  import Tags from './Tags.vue'
  export default {
    props: { 
      newMode: { type: Boolean, required: true },
      id: { type: String, required: true },
      title: { type: String, required: true },
      channel: { type: String, required: true },
      satisfaction: { type: Number, required: true },
      views: { type: Number, default: 0 },
      duration: { type: Number, required: true },
      recordingDate: { type: Number, required: true },
      creationDate: { type: Number, required: true },
      tags: { type: Array, required: false },
      featured: { type: [Boolean, Array], default: false},
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
    computed: {
      isNew() {
        return window.newVideos.find(it => it === this.id)
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
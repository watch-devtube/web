<template lang="pug">
  .card
      .card-image
        a(:href="'/video' + '/' + id")
          .image
            img(:src="'//img.youtube.com/vi/' + id + '/hqdefault.jpg'")
            a.watch.button.is-outlined.is-inverted.is-link(:href="'/video' + '/' + id") Watch
            .is-overlay
            p.ttl.is-uppercase.is-size-7 {{title}}
      .card-content
          .media(v-if="speaker")
              .media-left
                  figure.image.is-48x48
                    a(:href="'/@' + speaker.twitter"): img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
              .media-content
                p.title.is-6: a.has-text-black(:href="'/@' + speaker.twitter") {{speaker.name}}
                p.subtitle.is-7 
                  a.has-text-black(:href="'/@' + speaker.twitter") @{{speaker.twitter}} 
                  a.has-text-black(target="_blank" :href="'https://twitter.com/' + speaker.twitter"): i.fab.fa-twitter
          nav.level
            .level-item.has-text-centered
              div
                p.heading: i.far.fa-smile
                p.title.is-size-7 {{satisfaction}} 
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
          Tags(:tags="tags" :isNew="isNew" :featured="featured" :clickable="tagsClickable" :channel="channel")
</template>

<style lang="scss">
  .card {
    transition: 0.4s ease;

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
    em {
      color: #ec0047;
    }
    &:hover {
      box-shadow: 0 2px 3px rgba(10,10,10,.20), 0 0 0 1px rgba(10,10,10,.20);

      div.is-overlay {
        // opacity: 0;
      }
    } 
    // &:not(.verified) {
    // // do stuff here
    // }
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

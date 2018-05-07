<template lang="pug">
.watch
  section.section.body
   .container
    .columns
      .column.is-one-half
        .card
          .card-image
            .videoWrapper
              iframe(:src="'https://www.youtube.com/embed/' + id + '?showinfo=0'" frameborder="0" allowfullscreen)
          .card-content
                nav.level.is-mobile
                  .level-item.has-text-centered
                    div
                      p.heading: i.far.fa-smile
                      p.title.is-size-7 {{video.satisfaction}}%
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
                      p.heading Published
                      p.title.is-size-7 {{video.publishedAt | published}}
      .column
        .content
          h1 {{video.title}}
          .box.is-shadowless(v-if="video.speaker")
            .media
                .media-left
                    figure.image.is-48x48
                      img.avatar(:src="'https://avatars.io/twitter/' + video.speaker.twitter")
                .media-content
                  p.title.is-4 {{video.speaker.name}}
                  p.subtitle.is-6 @{{video.speaker.twitter}}
          .tags
            span.tag.is-uppercase(v-for="(tag) in video.tags") {{tag}}
            span.tag.is-info.is-uppercase {{video.channelTitle}}          
          p {{video.description}}
          a.button(:href="'https://github.com/watch-devtube/contrib/edit/master/videos/' + video.objectID + '.json'")
            span.icon: i.fab.fa-github
            span Edit
          a.button.twitter-share-button(:href="'https://twitter.com/intent/tweet?text=' + video.title + '&via=WatchDevTube&hashtags=' + video.tags.join(',') + '&url=https://dev.tube/video/' + video.objectID" target="_blank")
            span.icon: i.fab.fa-twitter
            span Tweet
</template>
<style scoped lang="scss">
  body {

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
  export default {
    data() {
      return {
        errors: [],
        video: {}
      }
    },    
    created() {
        axios.get(`https://DR90AOGGE9.algolia.net/1/indexes/videos/${this.id}`, {
            headers: {'X-Algolia-Application-Id': 'DR90AOGGE9',
            'X-Algolia-API-Key': 'c2655fa0f331ebf28c89f16ec8268565' }
        }).then(response => {
          this.video = response.data
        }).catch(error => {
          this.errors.push(error)
        })
    },
    metaInfo() {
      return {
        title: this.video.title
      }
    },
    props: ['id']
  }

</script>
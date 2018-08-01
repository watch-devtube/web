<template lang="pug">
  .contributors
    header
      .container
        nav.level(style="min-height: 80px")
          .level-left
            .level-item
              a(href="/"): img.logo(src="/logo.png" srcset="/logo.svg")
          .level-item.has-text-white.has-text-centered 
            i.far.fa-heart.has-text-danger
            | &nbsp;Contributors
          .level-right.has-text-lato
            .level-item.links.is-size-10
              a.has-text-white(href="https://devternity.com" target="_blank")
                span inspired by  
                strong DevTernity
    .section.container
      .content
        p 
          | Let's build the best tech video hub together. 
          a(href="https://github.com/watch-devtube/contrib" target="_blank") Contributing is simple!
        p 
          i.far.fa-heart.has-text-danger
          |   5000 karma points – we'll thank you on Twitter
        p 
          i.far.fa-heart.has-text-danger
          |   10000 karma points — you can make any good video featured on the front page for a week.
      .columns.is-multiline.is-mobile
        .column.is-3-widescreen.is-4-tablet(v-for="contributor in contributors" v-if="contributor.name")
          .card
            .card-content
              .media
                .media-left
                  figure.image.is-48x48
                    img.avatar(:src="contributor.avatar")
                .media-content
                  p.title.is-6.is-capitalized {{contributor.name}}
                  p.subtitle.is-7 
                    a(:href="'https://github.com/' + contributor.login" target="_blank") @{{contributor.login}}
              nav.level.is-mobile
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized Pulls
                    p.title.is-size-7 {{contributor.pullRequests}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized Videos
                    p.title.is-size-7 {{contributor.videosUpdated}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized: i.fab.fa-youtube
                    p.title.is-size-7 {{contributor.channelContributions}}
                .level-item.has-text-centered
                  .item
                    p.heading.is-capitalized: i.far.fa-user-circle
                    p.title.is-size-7 {{contributor.speakerContributions}}
                .level-item.has-text-centered                              
                  .item
                    p.heading.is-capitalized: i.fas.fa-hashtag
                    p.title.is-size-7 {{contributor.tagContributions}}
              ContributorRank(:karma="contributor.karma")
</template>
<style lang="scss">
  header {
    background-color: #343d46;
    padding: 30px;

    @media only screen and (max-width: 768px) {
      .logo {
        width: 70px;
        margin-bottom: 10px;
      }
    }

    a {
      color: white;
    }
  }

  .avatar {
    border-radius: 50%;
  }
</style>
<script>
  import NightMode from './NightMode.vue'
  import ContributorRank from './ContributorRank.vue'

  export default {
    computed: {
      contributors() {
        return window.board.contributors
          .map(c => Object.assign(c, { karma : this.karma(c) }))
          .sort((it, that) => that.karma - it.karma)
      }
    },
    methods: {
      karma(contributor) {
        return (
          contributor.tagContributions + 
          contributor.speakerContributions + 
          contributor.channelContributions +
          contributor.videosUpdated
        ) * 10
      }
    },
    components: { NightMode, ContributorRank }
  }
</script>
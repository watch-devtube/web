<template lang="pug">
  ais-index(:search-store="searchStore")
    header
      .container
        nav.level
          .level-left
            .level-item
              img(src="./logo.png")
          .level-item.has-text-centered
              ais-input(placeholder="Search for videos...")
          .level-right
            .level-item
              a.contribute(href="https://github.com/watch-devtube/contrib")
                i.fab.fa-github
    section.section
          .container
            .columns
              .column.is-one-quarter
                .columns
                  .column
                    h1.title Tags
                    ais-refinement-list.is-uppercase(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="tags")
                .columns
                  .column
                    h1.title Speaker
                    ais-refinement-list.is-uppercase(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="speaker.name")
                .columns
                  .column
                    h1.title Channel
                    ais-refinement-list.is-uppercase(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="channelTitle")
                    a.button.is-small(href="https://github.com/watch-devtube/contrib/edit/master/channels.yml")
                      span.icon: i.fab.fa-github
                      span Contribute
                .columns
                  .column
                    h1.title Language
                    ais-refinement-list.is-uppercase(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="language")
              .column
                .columns
                  .column
                    .columns
                      .column.is-three-quarters
                        ActiveFilters
                      .column
                        h1.subtitle.has-text-right
                          .select
                            ais-sort-by-selector(:indices="[{ name: 'videos', label: 'Relevant' }, { name: 'videos_addedAt_desc', label: 'New' }, { name: 'videos_publishedAt_desc', label: 'Recorded' }, { name: 'videos_views_desc', label: 'Views' }]")
                    ais-no-results
                      template(slot-scope="props")
                        .notification
                          h1.title
                            i.far.fa-times-circle 
                            |  No videos matching 
                            em.has-text-info {{props.query}}
                            | , sorry
                          a.button(href="https://github.com/watch-devtube/contrib/edit/master/channels.yml")
                            span.icon: i.fab.fa-github
                            span Add YouTube channel
                    ais-results#videos.columns.is-multiline
                      template(slot-scope="{ result }")
                        .column.is-6.is-4-widescreen
                          .card
                              .card-image
                                .image.is-16by9(:style="'background-image:url(https://img.youtube.com/vi/' + result.objectID + '/maxresdefault.jpg)'")
                                  a.watch.button.is-outlined.is-inverted.is-link(v-on:click.stop.prevent="watch(result.objectID)") Watch
                                  .is-overlay
                                  p.ttl.is-uppercase.is-size-7 {{result.title}}
                              .card-content
                                  .media(v-if="result.speaker")
                                      .media-left
                                          figure.image.is-48x48
                                            img.avatar(:src="'https://avatars.io/twitter/' + result.speaker.twitter")
                                      .media-content
                                        p.title.is-4 {{result.speaker.name}}
                                        p.subtitle.is-6 @{{result.speaker.twitter}}
                                  nav.level.is-mobile
                                    .level-item.has-text-centered
                                      div
                                        p.heading: i.far.fa-smile
                                        p.title.is-size-7 {{result.satisfaction}}%
                                    .level-item.has-text-centered
                                      div
                                        p.heading Views
                                        p.title.is-size-7 {{result.views | views}}
                                    .level-item.has-text-centered
                                      div                
                                        p.heading Duration
                                        p.title.is-size-7 {{result.duration | duration}}
                                    .level-item.has-text-centered
                                      div                
                                        p.heading Recorded
                                        p.title.is-size-7 {{result.publishedAt | published}}
                                  Tags(:tags="result.tags" :channel="result.channelTitle" :addedAt="result.addedAt")
    section.section
      .container
        .columns
          .column
            nav.paging(role="navigation" aria-label="pagination")
             ais-pagination.pagination(:class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<style lang="scss">
header {
  background-color: #343d46;
  padding: 30px;
  color: #ec0047;

  a.contribute {
    color: white;
  }

  input {
    outline: none;
    color: white;
    font-size: 15px;
    font-weight: 100;
    background-color: #343d46;
    padding: 16px 26px 16px 52px;
    border: 1px solid #6498cf;
    border-radius: 3px;
  }
}

.paging  {
  .pagination-list {
    justify-content: center;
  }

  .is-current a {
    background-color: #343d46;
    color: white;
  } 
}

#videos {
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
}
</style>
<script>
import { createFromAlgoliaCredentials } from 'vue-instantsearch'
import Tags from './Tags.vue'
import ActiveFilters from './ActiveFilters.vue'

const searchStore = createFromAlgoliaCredentials(
  'DR90AOGGE9',
  'c2655fa0f331ebf28c89f16ec8268565'
);
searchStore.indexName = 'videos';

export default { 
  metaInfo: {
      title: 'The best developer videos in one place',
      titleTemplate: 'DevTube — %s'
  },
  data() {
    return {
      searchStore
    };
  },
  methods: {
    watch: function(videoId) {
      this.$router.push({
        name: 'watch',
        params: { id: videoId }
      });
    }
  },
  components: { Tags, ActiveFilters }
};
</script>

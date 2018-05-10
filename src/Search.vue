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
            .level-item.links.is-size-4
              a(href="https://www.algolia.com" target="_blank")
                i.fab.fa-algolia
              | &nbsp;
              a(href="https://github.com/watch-devtube/contrib" target="_blank")
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
                            ais-sort-by-selector(:indices="[{ name: 'videos', label: 'Relevant' }, { name: 'videos_creationDate_desc', label: 'New' }, { name: 'videos_recordingDate_desc', label: 'Recorded' }, { name: 'videos_views_desc', label: 'Views' }]")
                    ais-no-results
                      template(slot-scope="props")
                        .notification
                          h1.title
                            i.far.fa-times-circle 
                            |  No videos matching 
                            em.has-text-info {{props.query}}
                            | , sorry
                          a.button(href="https://github.com/watch-devtube/contrib/edit/master/channels.yml" target="_blank")
                            span.icon: i.fab.fa-github
                            span Add YouTube channel
                    ais-results#videos.columns.is-multiline
                      template(slot-scope="{ result }")
                        .column.is-6.is-4-widescreen
                          VideoCard(:tags="result.tags" :featured="result.featured" :tagsClickable="true" :speaker="result.speaker" :creationDate="result.creationDate" :recordingDate="result.recordingDate" :duration="result.duration" :views="result.views" :satisfaction="result.satisfaction" :title="result.title" :id="result.objectID" :channel="result.channelTitle")
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

  .links a {
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

}
</style>
<script>
import { createFromAlgoliaCredentials } from 'vue-instantsearch'
import VideoCard from './VideoCard.vue'
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
  data: function() {
    return {
      searchStore
    };
  },
  components: { ActiveFilters, VideoCard }
};
</script>

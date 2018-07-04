<template lang="pug">
  ais-index(:search-store="searchStore" index-name="videos")
    header
      .container
        nav.level
          .level-left
            .level-item
              a(href="/"): img.logo(src="/logo.png" srcset="/logo.svg")
          .level-item.has-text-centered(v-if="newMode")
              Input(v-bind:class="{ 'is-invisible': speaker }" placeholder="Search for videos...")
              router-link.has-text-white(v-if="speaker" :to="{ name: 'search' }") 
                i.fas.fa-arrow-circle-left 
                |  back to search
          .level-item.has-text-centered(v-else)
              Input(placeholder="Search for videos...")
          .level-right.has-text-lato
            .level-item.links.is-size-10
              a.has-text-white(href="https://devternity.com" target="_blank")
                span inspired by  
                strong DevTernity
    section.section
          .container
            .columns

              .column.is-one-quarter.is-hidden-touch(v-if="!newMode")
                .columns(v-if="newVideos.length && !newOnly")
                  .column
                    .content
                      p 
                        b {{newVideos.length}} 
                        | new videos since yesterday!
                      a.button.is-info.is-outlined(v-on:click="showNewVideos()") Show me
                .columns
                  .column
                    h1.title Tags
                    ais-refinement-list.is-capitalized(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="tags" :sort-by="['count:desc', 'name:asc']")
                .columns(v-if="!speaker")
                  .column
                    h1.title Speaker
                    ais-refinement-list.is-capitalized(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="speaker.name" :sort-by="['count:desc', 'name:asc']")
                .columns
                  .column
                    h1.title Channel
                    ais-refinement-list.is-is-capitalized(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="channelTitle" :sort-by="['count:desc', 'name:asc']")     
                .columns
                  .column
                    h1.title Year
                    YearRange
              .column
                .columns
                  .column
                    .columns
                      .column(v-if="newMode")
                        .field.is-grouped.is-grouped-multiline
                        .control
                          .tags.has-addons(v-if="speaker")
                            .tag.is-link.is-lowercase @{{speaker}}
                            router-link.tag.is-delete(:to="{ name: 'search' }")
                      .column(v-else)
                        ActiveFilters(:speaker="speaker")
                      .column
                        .field.is-grouped.r(v-if="newMode")
                          .control
                            a.button.is-info.is-small.is-outlined(v-if="!newOnly && newVideos.length && !speaker" v-on:click="showNewVideos()") 
                              | Show&nbsp;
                              b {{newVideos.length}}
                              | &nbsp;new videos
                          TagPicker
                          SpeakerPicker
                          ChannelPicker
                    ais-no-results
                      template(slot-scope="props")
                        //- .notification(v-if="props.query")
                        .notification
                          h1.title
                            i.far.fa-times-circle 
                            |  No videos matching your query
                          a.button(href="https://github.com/watch-devtube/contrib" target="_blank")
                            span.icon: i.fab.fa-github
                            span Contribute
                        //- .notification.is-danger(v-if="!props.query") 
                          p Sorry, search is not available now. We're working on the solution.
                    ais-results#videos.columns.is-multiline
                      template(slot-scope="{ result }")
                        .column.is-6.is-flex-tablet(v-bind:class="{ 'is-3-widescreen': newMode, 'is-4-widescreen': !newMode }")
                          VideoCard(:newMode="newMode" :tags="result.tags" :featured="result.featured" :tagsClickable="true" :speaker="result.speaker" :creationDate="result.creationDate" :recordingDate="result.recordingDate" :duration="result.duration" :views="result.views" :satisfaction="result.satisfaction" :title="result.title" :id="result.objectID" :channel="result.channelTitle")
    section.section
      .container
        .columns
          .column.has-text-right
            a(v-if="!newMode" href="https://www.algolia.com" target="_blank"): img(src="/search-by-algolia.png" srcset="/search-by-algolia.svg")
            br
            br
            nav.paging(role="navigation" aria-label="pagination")
             ais-pagination.pagination(:class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<style lang="scss">

.field.is-grouped.r {
  justify-content: flex-end;
}

.has-text-lato {
  font-family: Lato
}

header {
  background-color: #343d46;
  padding: 30px;

  @media only screen and (max-width: 768px) {
    .logo {
      width: 70px;
      margin-bottom: 10px;
    }
  }

  .links a {
    color: white;
  }

  input {
    -webkit-appearance: none;
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

  input::placeholder{
    color: #fff;
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

</style>
<script>
import { createFromAlgoliaCredentials } from 'vue-instantsearch'
import { createFromAlgoliaClient } from 'vue-instantsearch'

import VideoCard from './VideoCard.vue'
import ActiveFilters from './ActiveFilters.vue'
import SpeakerPicker from './SpeakerPicker.vue'
import ChannelPicker from './ChannelPicker.vue'
import TagPicker from './TagPicker.vue'
import YearRange from './YearRange.vue'
import Input from './Input.vue'

const fuseSearchClient = {
  search(requests) {
    return fetch('/search', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }).then(res => res.json());
  },
  addAlgoliaAgent(agent) {}
};

const searchStore = window.fuseMode ? 
  createFromAlgoliaClient(fuseSearchClient) : 
  createFromAlgoliaCredentials(
    'DR90AOGGE9',
    'c2655fa0f331ebf28c89f16ec8268565'
);

if (window.speaker && !window.fuseMode) {
  searchStore.queryParameters = { disjunctiveFacets: ['speaker.twitter'] };
  searchStore.algoliaHelper.addDisjunctiveFacetRefinement('speaker.twitter', window.speaker)
}

searchStore.queryParameters = { hitsPerPage : 21 }

export default { 
  props: {
    speaker: { type: String, required: false }
  },
  data: function() {
    return {
      newMode: window.fuseMode,
      newVideos: window.newVideos,
      searchStore
    };
  },
  watch: {
    '$route': 'fetch'
  },  
  created() {
    this.fetch()
  },
  computed: {
    newOnly() {
      return this.searchStore.algoliaHelper.state.filters && 
        this.searchStore.algoliaHelper.state.filters.includes('objectID')
    }
  },
  methods: {
    fetch() {
      this.newVideos = window.newVideos
      this.newMode = window.fuseMode

      if (this.newMode) {
        searchStore.queryParameters = { refinement: { 'speaker.twitter' : this.speaker } }
      }

    },
    showNewVideos: function() {
      let newOnly = this.newVideos.map(id => `objectID:${id}`).join(' OR ')
      this.searchStore.algoliaHelper.setQueryParameter('filters', `(${newOnly})`)
    }
  },
  components: { 
    ActiveFilters, 
    VideoCard, 
    YearRange, 
    Input, 
    SpeakerPicker, 
    TagPicker, 
    ChannelPicker }
}
</script>

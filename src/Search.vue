<template lang="pug">
  .searchContainer
    header
      .container    
        NavBar
          Sorting  
    ais-index(:search-store="searchStore" index-name="videos")
      section.section(style="margin-top: 20px")
            .container
              .columns
                .column.is-one-quarter
                  p.buttons
                    router-link.button.is-small.is-outlined.is-hidden-tablet(v-if="speaker || tag || channel || showMyWatched" :to="{ name: 'search' }")
                      span {{speaker || tag || channel || (showMyWatched ? 'Watched' : '')}}
                      span.icon.is-small: i.fas.fa-times
                    a.button.is-small.is-hidden-tablet(@click="$refs.tagPicker.expand()"): span.icon.is-small: i.fas.fa-hashtag
                    a.button.is-small.is-hidden-tablet(@click="$refs.speakerPicker.expand()"): span.icon.is-small: i.far.fa-user-circle
                    a.button.is-small.is-hidden-tablet(@click="$refs.channelPicker.expand()"): span.icon.is-small: i.fab.fa-youtube
    
                  ExpandableTags(ref="tagPicker" icon="fas fa-hashtag" title="Tags" :items="tags" :limit="10" :route="routeToTag")
                      template(slot-scope="slot") {{slot.item.tag}}

                  ExpandableTags(ref="speakerPicker" icon="far fa-user-circle" title="Speakers" :items="speakers" :limit="10" :route="routeToSpeaker")
                      template(slot-scope="slot")
                        span {{slot.item.name}}

                  ExpandableTags(ref="channelPicker" icon="fab fa-youtube" title="Channels" :items="channels" :limit="10" :route="routeToChannel")
                      template(slot-scope="slot") {{slot.item.title | truncate(25)}}
                .column
                  .columns
                    .column
                      .columns
                        .column.is-hidden-mobile
                          router-link.button.is-small.is-outlined(v-if="speaker || tag || channel || showMyWatched" :to="{ name: 'search' }")
                            span.is-capitalized(v-if="tag || channel") {{tag || channel}}
                            span.is-lowercased(v-if="speaker") @{{speaker}}
                            span.is-lowercased(v-if="showMyWatched") Watched
                            span.icon.is-small: i.fas.fa-times
                      .loading(v-if="loading")
                        .notification
                          p
                            | Searching for the best tech videos 👨🏻‍💻...
                            br
                            br
                            | We're working on reducing Cloud Function cold start time.
                      .loaded(v-else)
                        ais-no-results
                          template(slot-scope="props")
                            .notification
                              p
                                | No videos matching your query. Please 
                                a(href="https://github.com/watch-devtube/contrib" target="_blank") contribute on GitHub
                                | .
                        ais-results#videos.columns.is-multiline
                          template(slot-scope="{ result }")
                            .column.is-6.is-flex-tablet.is-4-widescreen.shrinkIfEmpty
                              VideoCard(:newMode="newMode" :tags="result.tags" :featured="result.featured" :tagsClickable="true" :speaker="result.speaker" :creationDate="result.creationDate" :recordingDate="result.recordingDate" :duration="result.duration" :views="result.views" :satisfaction="result.satisfaction" :title="result.title" :id="result.objectID" :channel="result.channelTitle")
      section.section
        .container
          .columns
            .column.has-text-right
              br
              br
              nav.paging(role="navigation" aria-label="pagination")
                ais-pagination.pagination(:class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<style lang="scss">

.shrinkIfEmpty:empty {
  display: none !important
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
import { mapState, mapGetters } from 'vuex'

import VideoCard from './VideoCard.vue'
import NavBar from './NavBar.vue'
import Sorting from './Sorting.vue'
import ActiveFilters from './ActiveFilters.vue'
import YearRange from './YearRange.vue'
import ExpandableTags from './ExpandableTags.vue'

export default { 
  props: {
    q: { type: String, default: '' },
    showMyWatched: { type: Boolean, default: false },
    speaker: { type: String, required: false },
    channel: { type: String, required: false },
    tag: { type: String, required: false }
  },
  data: function() {
    return {
      loading: false,
      tagsCollapsed: true,
      speakersCollapsed: true,
      channelsCollapsed: true,
      newMode: window.fastrMode
    };
  },
  watch: {
    '$route': 'fetch',
    '$store.state.query.sortOrder': 'syncQuery' 
  },  
  created() {
    let that = this

    let fastr = {
      search(requests) {
        that.$Progress.start()
        that.loading = true
        return fetch('/search', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests }),
        }).then(res => {
          let json = res.json()
          that.$Progress.finish()
          that.loading = false
          return json
        })
      },
      addAlgoliaAgent(agent) {}
    };

    let searchStore = window.fastrMode ?
      createFromAlgoliaClient(fastr) :
      createFromAlgoliaCredentials(
        'DR90AOGGE9',
        'c2655fa0f331ebf28c89f16ec8268565'
    );

    searchStore.queryParameters = {
      hitsPerPage : 21
    }

    this.searchStore = searchStore

    this.fetch()
    this.syncQuery()
  },
  computed: {
    tags() {
      return window.featured.tags
    },
    speakers() {
      return window.featured.speakers
    },
    channels() {
      return window.featured.channels
    },
    ...mapState([ 'videos', 'query' ]),
    ...mapGetters('videos', ['watchedIds']),
    ...mapGetters('loading', ['completed'])
  },
  methods: {
    syncQuery() {
      this.searchStore.queryParameters = this.query
    },
    routeToTag(item) {
      return { name: 'tag', params: { tag: item.tag } }
    },
    routeToSpeaker(item) {
      return { name: 'speaker', params: { speaker: item.twitter } }
    },
    routeToChannel(item) {
      return { name: 'channel', params: { channel: item.title } }
    },
    fetch() {
      this.newMode = window.fastrMode


      this.searchStore.stop()

      // ## start 
      // when seach query is present, tag clicking must reset it
      this.searchStore.query = this.q
      // ## end

      this.searchStore.queryParameters = { refinement : undefined }

      let watchedVideoIds = this.watchedIds
      console.log(watchedVideoIds)
      if (this.showMyWatched) {
        this.searchStore.queryParameters = { refinement: { 'objectID' : { $in: watchedVideoIds } } }
        this.searchStore.queryParameters = { watched: [] }
      } else {
        this.searchStore.queryParameters = { watched: watchedVideoIds }
      }

      if (this.speaker) {
        this.searchStore.queryParameters = { refinement: { 'speaker.twitter' : this.speaker } }
      }

      if (this.tag) {
        this.searchStore.queryParameters = { refinement: { 'tags' : { $contains: this.tag } } }
      }
      if (this.channel) {
        this.searchStore.queryParameters = { refinement: { 'channelTitle' : this.channel } }
      }


      this.searchStore.start()
      this.searchStore.refresh()
    }
  },
  components: { 
    ExpandableTags,
    ActiveFilters, 
    VideoCard, 
    YearRange, 
    Sorting,
    NavBar
  }
}
</script>

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
                .column
                  router-link.button.is-small.is-outlined(v-if="speaker || tag || channel" :to="{ name: 'discovery' }")
                    span(v-if="tag || channel") {{tag || channel | capitalizeIfNeeded}}
                    span.is-lowercased(v-if="speaker") @{{speaker}}
                    span.icon.is-small: i.fas.fa-times
              .loading(v-if="loading")
                .notification.overrideVueNotificationsIssue
                  p
                    | Searching for the best tech videos 👨🏻‍💻...
                    br
                    br
                    | We're working on reducing Cloud Function cold start time.
              .loaded(v-else)
                ais-no-results
                  template(slot-scope="props")
                    .notification.overrideVueNotificationsIssue
                      p
                        | No videos matching your query. Please 
                        a(href="https://github.com/watch-devtube/contrib" target="_blank") contribute on GitHub
                        | .
                ais-results#videos.columns.is-multiline
                  template(slot-scope="{ result }")
                    .column.is-6.is-flex-tablet.is-3-widescreen.shrinkIfEmpty
                      VideoCard(
                        :tags="result.tags" 
                        :speaker="result.speaker" 
                        :creationDate="result.creationDate" 
                        :recordingDate="result.recordingDate" 
                        :duration="result.duration" 
                        :views="result.views" 
                        :satisfaction="result.satisfaction" 
                        :title="result.title" 
                        :id="result.objectID" 
                        :channel="result.channelTitle")
      section.section
        .container
          .columns
            .column.has-text-right
              br
              br
              nav.paging(role="navigation" aria-label="pagination")
                ais-pagination.pagination(:class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<script>
import { createFromAlgoliaClient } from 'vue-instantsearch'
import { mapState, mapGetters } from 'vuex'

import VideoCard from './VideoCard.vue'
import NavBar from './NavBar.vue'
import Sorting from './Sorting.vue'
import ExpandableTags from './ExpandableTags.vue'

export default { 
  props: {
    q: { type: String, default: '' },
    showMyWatched: { type: Boolean, default: false },
    showMyFeed: { type: Boolean, default: false },    
    showFavorites: { type: Boolean, default: false },
    showDiscovery: { type: Boolean, default: false },
    speaker: { type: String, required: false },
    channel: { type: String, required: false },
    tag: { type: String, required: false }
  },
  data: function() {
    return {
      loading: false
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

    let searchStore = createFromAlgoliaClient(fastr)
    this.searchStore = searchStore

    this.fetch()
    this.syncQuery()
  },
  computed: {
    ...mapState([ 'videos', 'query' ]),
    ...mapGetters('videos', ['watchedIds', 'favoriteIds']),
    ...mapGetters('loading', ['completed'])
  },
  methods: {
    syncQuery() {
      this.searchStore.queryParameters = this.query
    },
    fetch() {

      this.searchStore.stop()

      // ## start 
      // when seach query is present, tag clicking must reset it
      this.searchStore.query = this.q
      // ## end

      this.searchStore.queryParameters = { refinement : undefined }

      let watchedVideoIds = this.watchedIds
      let favoriteVideoIds = this.favoriteIds

      if (this.showMyWatched) {
        this.searchStore.queryParameters = { refinement: { 'objectID' : { $in: watchedVideoIds } } }
        this.searchStore.queryParameters = { excludes: [] }
      } else {
        this.searchStore.queryParameters = { excludes: watchedVideoIds }
      }

      if (this.showFavorites) {
        this.searchStore.queryParameters = { refinement: { 'objectID' : { $in: favoriteVideoIds } } }
        this.searchStore.queryParameters = { excludes: [] }
      }

      if (this.showMyFeed) {
        let subscriptions = this.videos.subscriptions

        let subscribedTags = subscriptions.filter(sub => sub.type == 'tag').map(sub => sub.topic)
        let subscribedChannels = subscriptions.filter(sub => sub.type == 'channel').map(sub => sub.topic)
        let subscribedSpeakers = subscriptions.filter(sub => sub.type == 'speaker').map(sub => sub.topic)

        let myFeedQuery = { 
          $or: [
            { 'tags': { $containsAny: subscribedTags} },
            { 'channelTitle': { $in: subscribedChannels } },
            { 'speaker.twitter': { $in: subscribedSpeakers } }
          ]
        }

        this.searchStore.queryParameters = { refinement: myFeedQuery }
        this.searchStore.queryParameters = { excludes: watchedVideoIds }
      }

      if (this.speaker) {
        this.searchStore.queryParameters = { refinement: { 'speaker.twitter' : this.speaker } }
      }

      if (this.tag) {
        this.searchStore.queryParameter2s = { refinement: { 'tags' : { $contains: this.tag } } }
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
    VideoCard, 
    Sorting,
    NavBar
  }
}
</script>

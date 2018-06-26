<template lang="pug">
  .activeFilters
    .field.is-grouped.is-grouped-multiline
      .control
        .tags.has-addons(v-if="newOnly")
          .tag.is-link.is-capitalized new additions
          a.tag.is-delete(v-on:click="removeNewOnly()")
      .control(v-for="filter in facetFilters")
        .tags.has-addons(v-if="filter.refinement == speaker")
            .tag.is-link.is-capitalized @{{speaker}}
            a.tag.is-delete(href="/")
        .tags.has-addons(v-else)  
            .tag.is-link.is-capitalized {{filter.refinement}}
            a.tag.is-delete(v-on:click="remove(filter.facet, filter.refinement)")
</template>
<script>
  import { Component } from 'vue-instantsearch'

  export default {
    props: { 
      speaker: { type: String, required: false }
    },
    computed: {
      newOnly() {
        return this.searchStore.algoliaHelper.state.filters && 
          this.searchStore.algoliaHelper.state.filters.includes('objectID')
      },
      facetFilters() {
        let refinements = this.searchStore.algoliaHelper.state.disjunctiveFacetsRefinements
        let facets = Object.keys(refinements)
        let result = []
        for (let facet of facets) {
          for (let refinementForAFacet of refinements[facet]) {
            result.push({
              facet: facet,
              refinement: refinementForAFacet
            })
          }
        }
        return result
      }
    },
    mixins: [Component],
    methods: {
      remove: function (facet, refinement) {
        this.searchStore.algoliaHelper.removeDisjunctiveFacetRefinement(facet, refinement)
      },
      removeNewOnly: function() {
        this.searchStore.algoliaHelper.setQueryParameter("filters", undefined)
      }
    }    
  }
</script>
<template lang="pug">
  .activeFilters
    .field.is-grouped.is-grouped-multiline
      .control(v-for="filter in facetFilters")
        .tags.has-addons
            .tag.is-link.is-uppercase {{filter.refinement}}
            a.tag.is-delete(v-on:click="remove(filter.facet, filter.refinement)")
</template>
<script>
  import { Component } from 'vue-instantsearch'

  export default {
    computed: {
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
      }
    }    
  }
</script>
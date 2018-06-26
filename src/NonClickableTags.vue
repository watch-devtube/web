<template lang="pug">
  .tags
    span.tag.is-primary.is-uppercase(v-if="isNew") New
    span.tag.is-danger.is-uppercase(v-if="featured") Featured
    span.tag.is-uppercase(v-for="(tag) in tags") {{tag}}
    span.tag.is-uppercase 
      i.fab.fa-youtube 
      | &nbsp; {{channel | truncate(10)}}
</template>

<script>
  export default {
    props: { 
      featured: { type: Boolean, required: true },
      tags: { required: true },
      channel: { required: true },
      isNew: { required: true }
    },
    methods: {
      refineTag: function (tag) {
        this.searchStore.algoliaHelper.addDisjunctiveFacetRefinement('tags', tag)
      },
      refineChannel: function (channel) {
        this.searchStore.algoliaHelper.addDisjunctiveFacetRefinement('channelTitle', channel)
      }      
    }    
  };
</script>

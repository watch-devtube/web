<template lang="pug">
  .tags
    span.tag.is-primary.is-capitalized(v-if="isNew") New
    span.tag.is-danger.is-capitalized(v-if="featured") Featured
    span.tag.is-capitalized(v-for="(tag) in tags") {{tag}}
    span.tag.is-capitalized 
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
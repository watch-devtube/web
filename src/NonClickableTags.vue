<template lang="pug">
  .tags
    span.tag.is-primary.is-uppercase(v-if="isNew(creationDate)") New
    span.tag.is-uppercase(v-for="(tag) in tags") {{tag}}
    span.tag.is-uppercase 
      i.fab.fa-youtube 
      | &nbsp; {{channel}}
</template>
<script>
  export default {
    props: { 
      tags: { required: true },
      channel: { required: true },
      creationDate: { required: true }
    },
    methods: {
      isNew: function(creationDate) {
        let createdDaysAgo = it => {
          let today = new Date().getTime() / 1000
          return (today - it) / (24*12*60)
        }
        return createdDaysAgo(creationDate) < 14
      },
      refineTag: function (tag) {
        this.searchStore.algoliaHelper.addDisjunctiveFacetRefinement('tags', tag)
      },
      refineChannel: function (channel) {
        this.searchStore.algoliaHelper.addDisjunctiveFacetRefinement('channelTitle', channel)
      }      
    }    
  };
</script>
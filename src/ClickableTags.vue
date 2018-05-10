<template lang="pug">
  .tags
    span.tag.is-primary.is-uppercase(v-if="isNew(creationDate)") New
    span.tag.is-danger.is-uppercase(v-if="featured") Featured
    a.tag.is-uppercase(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag}}
    a.tag.is-uppercase(v-on:click="refineChannel(channel)") 
      i.fab.fa-youtube 
      | &nbsp; {{channel}}
</template>
<script>
  import { Component } from 'vue-instantsearch';

  export default {
    props: { 
      featured: { type: Boolean, required: true },
      tags: { required: true },
      channel: { required: true },
      creationDate: { required: true }
    },
    mixins: [Component],
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
<template lang="pug">
  .tags
    span.tag.is-primary.is-lowercase(v-if="isNew") New
    span.tag.is-danger.is-lowercase(v-if="featured") Featured
    a.tag.is-lowercase(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag}}
    a.tag.is-lowercase(v-on:click="refineChannel(channel)") 
      i.fab.fa-youtube 
      | &nbsp; {{channel | truncate(10)}}
</template>
<script>
  import { Component } from 'vue-instantsearch';

  export default {
    props: { 
      featured: { type: Boolean, required: true },
      tags: { required: true },
      channel: { required: true },
      isNew: { required: true }
    },
    mixins: [Component],
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
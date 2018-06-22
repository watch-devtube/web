<template lang="pug">
  .tags
    span.tag.is-primary.is-uppercase(v-if="isNew") New
    span.tag.is-danger.is-uppercase(v-if="featured") Featured
    a.tag.is-uppercase(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag}}
    a.tag.is-uppercase(v-on:click="refineChannel(channel)") 
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
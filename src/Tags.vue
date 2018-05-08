<template lang="pug">
  .tags
    span.tag.is-primary.is-uppercase(v-if="isNew(creationDate)") New
    a.tag.is-uppercase(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag}}
    a.tag.is-uppercase(v-on:click="refineChannel(channel)") 
      i.fab.fa-youtube 
      | &nbsp; {{channel}}
</template>
<script>
  import { Component } from 'vue-instantsearch';

  export default {
    props: { 
      tags: { required: true },
      channel: { required: true },
      creationDate: { required: true }
    },
    mixins: [Component],
    computed: {
    },
    methods: {
      isNew: function(creationDate) {
        let today = new Date().getTime()
        return (today - creationDate*1000) / (24*12*60*1000) < 14
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

<template lang="pug">
  .sorting
    .buttons.has-addons
      span.is-small.button(v-bind:class="{ 'is-info is-selected': sortBy == '-featured' }" @click="sort('-featured')") Sort by Featured
      span.is-small.button(v-bind:class="{ 'is-info is-selected': sortBy == '-satisfaction' }" @click="sort('-satisfaction')") Rating
      span.is-small.button(v-bind:class="{ 'is-info is-selected': sortBy == '-recordingDate' }" @click="sort('-recordingDate')") 
        span Date
          strong(v-if="newCount")  +{{newCount}} new
      span.is-small.button(v-bind:class="{ 'is-info is-selected': sortBy == 'duration' }" @click="sort('duration')") Duration
</template>
<script>
  import { Component } from 'vue-instantsearch';
  export default {
    mixins: [Component], 
    props: { 
      newCount: { type: Number, required: true },
    },
    data: function() {
      return {
        sortBy: this.$cookie.get('sortBy') || '-featured'
      }
    },
    methods: {
      sort: function(order) {
        this.sortBy = order
        this.$cookie.set('sortBy', order)
        this.searchStore.queryParameters = { sortOrder: order }
      }
    }    
  }
</script>
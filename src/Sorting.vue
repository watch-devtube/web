<template lang="pug">
  .navbar-item.has-dropdown.is-hoverable.is-size-7
    a.is-size-7.navbar-link Sort by
    .navbar-dropdown.is-boxed.is-size-7
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': sortBy == '-featured' }" @click="sort('-featured')") Featured
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': sortBy == '-satisfaction' }" @click="sort('-satisfaction')") Rating
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': sortBy == '-recordingDate' }" @click="sort('-recordingDate')") Date
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': sortBy == 'duration' }" @click="sort('duration')") Duration
</template>
<script>
  import { Component } from 'vue-instantsearch';
  export default {
    mixins: [Component],
    data: function() {
      return {
        sortBy: this.$cookie.get('sortBy') || '-featured'
      }
    },
    methods: {
      sort: function(order) {
        this.$parent.hide()
        this.sortBy = order
        this.$cookie.set('sortBy', order)
        this.searchStore.queryParameters = { sortOrder: order }
      }
    }    
  }
</script>
<template lang="pug">
  .navbar-item.has-dropdown.is-hoverable.is-size-7
    a.is-size-7.navbar-link Sort by
    .navbar-dropdown.is-boxed.is-size-7
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == '-featured' }" @click="sortNow('-featured')") Featured
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == '-satisfaction' }" @click="sortNow('-satisfaction')") Rating
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == '-recordingDate' }" @click="sortNow('-recordingDate')") Date
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == 'duration' }" @click="sortNow('duration')") Duration
</template>
<script>
  import { mapState, mapActions, mapGetters } from 'vuex'
  // import { Component } from 'vue-instantsearch';
  export default {
    // mixins: [Component],
    computed: {
      ...mapState([ 'query' ])
    },
    methods: {
      sortNow: function(order) {
        this.$parent.hide()
        this.sort(order)
        // this.$cookie.set('sortBy', order)
        // this.searchStore.queryParameters = { sortOrder: order }
      },
      ...mapActions('query', [ 'sort' ])
    }    
  }
</script>
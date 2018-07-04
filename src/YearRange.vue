<template lang="pug">
  .years
    .buttons.has-addons
      span.button(v-bind:class="thisYearClass" v-on:click="showVideosInBetween(currentYear(), currentYear(+1))") {{thisYear}}
      span.button(v-bind:class="lastYearClass" v-on:click="showVideosInBetween(currentYear(-1), currentYear())") {{lastYear}}
      span.button(v-bind:class="allVideosClass" v-on:click="showAllVideos()") All videos
</template>
<script>
  import { Component } from 'vue-instantsearch';
  import dayjs from 'dayjs'

  export default {
    mixins: [Component],
    computed: {
      thisYearClass: function () {
        return { 'is-info is-selected': this.yearsRefined() == this.currentYear()}
      },   
      lastYearClass: function () {
        return { 'is-info is-selected': this.yearsRefined() == this.currentYear(-1) }
      },                
      allVideosClass: function () {
        return { 'is-info is-selected': !this.yearsRefined() }
      },    
      thisYear() {
        return dayjs().year()
      },
      lastYear() {
        return dayjs().year() - 1
      }      
    },
    methods: {
      yearsRefined: function() {
        return this.searchStore.algoliaHelper.getNumericRefinement('recordingDate', '>=')
      },
      currentYear: function(years = 0) {
        return dayjs().add(years, 'year').startOf('year').unix()
      },           
      showAllVideos: function () {
        this.searchStore.algoliaHelper.removeNumericRefinement('recordingDate')
      },
      showVideosInBetween: function (from, to) {
        this.searchStore.stop()
        this.searchStore.algoliaHelper.removeNumericRefinement('recordingDate')
        this.searchStore.algoliaHelper.addNumericRefinement('recordingDate', '>=', from)
        this.searchStore.algoliaHelper.addNumericRefinement('recordingDate', '<=', to)
        this.searchStore.start()
        this.searchStore.refresh()
      }
    }    
  };
</script>
<template lang="pug">
  .columns
    .column.is-half
      TalksChart(:timeline="stats.timeline")
    .column.is-half
      .level
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Total Videos</p>
            <p class="title">{{stats.videos | kilo}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Total Time</p>
            <p class="title">{{stats.stage | durationFull}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Total Likes</p>
            <p class="title">{{stats.likes | kilo}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Total Views</p>
            <p class="title">{{stats.views | kilo}}</p>
          </div>
        </div>  
</template>
<script>
  import TalksChart from './TalksChart.vue'
  export default {
    props: {
      stats: { type: Object, required: false }
    },
    components: { TalksChart }
  }
</script>
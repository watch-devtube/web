<template lang="pug">
  line-chart(height="200px" :data="timeline" :download="true" :library="{title:{display:true, text:'Videos', fontColor:'#999999', position:'left'},scales:{yAxes:[{ticks: {fontColor: '#999999'}}], xAxes:[{ticks: {fontColor: '#999999'}}]}}")
</template>
<style lang="scss">
  canvas {
    color: white !important;
  }
</style>
<script>
export default {
  props: {
    timeline: { type: Object, required: false }
  }
}
</script>

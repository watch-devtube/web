<template lang="pug">
  a.navbar-item.is-size-7(@click="toggle()")
    | Night mode 
    | &nbsp;
    i.fas.fa-moon(v-if="nightMode")
    i.far.fa-moon(v-else)
</template>
<script>
  export default {
    data: function() {
      return {
        nightMode: this.$cookie.get('nightMode')
      }      
    },
    methods: {
      toggle() {
        let activeNow = this.nightMode
        if (activeNow) {
          this.$cookie.delete('nightMode')
        } else {
          this.$cookie.set('nightMode', true)
        }
        location.reload();
      }
    }    
  }
</script>
<template lang="pug">
  a.navbar-item.is-size-7(@click="toggle()" v-if="nightMode") Day mode 
  a.navbar-item.is-size-7(@click="toggle()" v-else) Night mode
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
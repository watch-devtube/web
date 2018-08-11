<template lang="pug">
  #app
    notifications(group="notification" :duration="-1")
    router-view(v-if="completed")
    vue-progress-bar
</template>
<style lang="scss">
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }  
</style>
<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  export default { 
    created() {
      this.$Progress.start()
    },
    computed: {
     ...mapGetters('loading', ['completed']),
     ...mapState({show: state => state.notify.show})
    },
    watch: {
      show() {
        if (this.show) {
            this.$notify({
                title: this.$store.state.notify.title,
                text: this.$store.state.notify.text,
                type: this.$store.state.notify.type,
                group: 'notification'
            })
        }
        this.disableNotify()
      }
    }, 
   methods: {
    ...mapMutations('notify', ['disableNotify'])
  },       
  }
</script>
<template lang="pug">
  component(:is="componentLoader" :featured="featured" :tags="tags" :creationDate="creationDate" :channel="channel")
</template>
<script>
  export default {
    props: {
      clickable: { type: Boolean, default: false },
      featured: { type: Boolean, required: true },
      tags: { required: true },
      channel: { required: true },
      creationDate: { required: true }      
    },
    computed: {
      componentLoader() {
        return () => this.clickable 
          ? import(`./ClickableTags.vue`) 
          : import(`./NonClickableTags.vue`)
      }
    }
  }
</script>

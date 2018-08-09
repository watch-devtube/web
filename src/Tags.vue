<template lang="pug">
  component(
    :is="componentLoader"
    :featured="featured == true || featured.length > 0"
    :tags="tags" :isNew="isNew"
    :channel="channel"
  )
</template>
<script>
  export default {
    props: {
      featured: { type: [Boolean, Array], required: true },
      tags: { required: true },
      channel: { required: true },
      isNew: { required: true }
    },
    computed: {
      componentLoader() {
        return () => import('./ClickableTags.vue')
      },
    }
  }
</script>

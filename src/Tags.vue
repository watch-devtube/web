<template lang="pug">
  component(
    :is="componentLoader"
    :tags="tags" :isNew="isNew"
    :channel="channel"
  )
</template>
<script>
  export default {
    props: {
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

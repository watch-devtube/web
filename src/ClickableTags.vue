<template lang="pug">
  .tags
    span.tag.is-primary.is-capitalized(v-if="isNew") New
    a.tag(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag | capitalizeIfNeeded}}
    a.tag.is-capitalized(v-on:click="refineChannel(channel)")
      i.fab.fa-youtube
      | &nbsp; {{channel | truncate(10)}}
</template>
<script>

  export default {
    props: {
      tags: { required: true },
      channel: { required: true },
      isNew: { required: true }
    },
    methods: {
      refineTag(tag) {
        this.$router.push({ name: 'tag', params: { tag: tag } })
      },
      refineChannel(channel) {
        this.$router.push({ name: 'channel', params: { channel: channel } } )
      }
  }
}
</script>

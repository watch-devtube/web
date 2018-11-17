<template lang="pug">
  .tags
    span.tag.is-primary.is-capitalized(v-if="isNew") New
    a.tag(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag | capitalizeIfNeeded}}
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
      }
  }
  }
</script>

<template lang="pug">
  .tags
    span.tag.is-primary.is-capitalized(v-if="isNew") New
    span.tag.is-danger.is-capitalized(v-if="featured") Featured
    a.tag.is-capitalized(v-for="(tag) in tags" @click="refineTag(tag)") {{tag}}
    a.tag.is-capitalized(@click="refineChannel(channel)")
      i.fab.fa-youtube 
      | &nbsp; {{channel | truncate(10)}}
</template>
<script>
  export default {
    props: { 
      featured: { type: Boolean, required: true },
      tags: { required: true },
      channel: { required: true },
      isNew: { required: true }
    },
    methods: {
      refineTag: function (tag) {
        this.$router.push({ name: 'tag', params: { tag: tag } })
      },
      refineChannel: function (channel) {
        this.$router.push({ name: 'channel', params: { channel: channel } } )
      }      
    }    
  };
</script>
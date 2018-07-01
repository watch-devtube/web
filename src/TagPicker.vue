<template lang="pug">
  .picker
    a.button(v-on:click="pickATag()") 
      span.icon: i.fas.fa-filter
      span Tags
    .modal(v-if="open" v-bind:class="{ 'is-active': open }")
        .modal-background
        .modal-card
          header.modal-card-head
            p.modal-card-title Tags
            button.delete(aria-label="close" v-on:click="close()")
          section.modal-card-body
            .tags
              a.tag.is-link.is-capitalized(v-for="tag in tags" :href="'/tag/' + tag") {{tag}}        
</template>
<style lang="scss">
  .avatar {
    border-radius: 50%
  }
</style>
<script>

export default {
  data() {
    return {
      open: false,
    }
  },
  asyncComputed: {
    tags: {
      lazy: true,
      get() {
        return fetch('/tags', {
          method: 'get',
          headers: {
          'Content-Type': 'application/json',
          }
        }).then(res => res.json())
      }
    }
  },
  methods: {
    pickATag: function() {
      this.open = true
    },
    close: function() {
      this.open = false
    }
  }
}
</script>
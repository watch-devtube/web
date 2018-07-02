<template lang="pug">
  .picker
    a.button(v-on:click="pickAChannel()") 
      span.icon: i.fas.fa-filter
      span Channels
    .modal(v-if="open" v-bind:class="{ 'is-active': open }")
        .modal-background
        .modal-card
          header.modal-card-head
            p.modal-card-title Channels
            button.delete(aria-label="close" v-on:click="close()")
          section.modal-card-body
            .media(v-for="channel in channels")
                .media-left
                    i.fab.fa-youtube
                .media-content
                  p.title.is-6: a.has-text-black.is-capitalized(:href="'/channel/' + channel.id") {{channel.title}}
</template>
<script>

export default {
  data() {
    return {
      open: false,
    }
  },
  asyncComputed: {
    channels: {
      lazy: true,
      get() {
        return fetch('/channels', {
          method: 'get',
          headers: {
          'Content-Type': 'application/json',
          }
        }).then(res => res.json())
      }
    }
  },
  methods: {
    pickAChannel: function() {
      this.open = true
    },
    close: function() {
      this.open = false
    }
  }
}
</script>
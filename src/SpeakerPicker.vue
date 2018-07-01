<template lang="pug">
  .picker
    a.button(v-on:click="pickASpeaker()") 
      span.icon: i.fas.fa-filter
      span Speakers
    .modal(v-if="open" v-bind:class="{ 'is-active': open }")
        .modal-background
        .modal-card
          header.modal-card-head
            p.modal-card-title Speakers
            button.delete(aria-label="close" v-on:click="close()")
          section.modal-card-body
            .media(v-for="speaker in speakers")
                .media-left
                    figure.image.is-48x48
                      a(:href="'/@' + speaker.twitter"): img.avatar(:src="'https://avatars.io/twitter/' + speaker.twitter")
                .media-content
                  p.title.is-6: a.has-text-black(:href="'/@' + speaker.twitter") {{speaker.name}}
                  p.subtitle.is-7 
                    a.has-text-black(:href="'/@' + speaker.twitter") @{{speaker.twitter}} 
                    a.has-text-black(target="_blank" :href="'https://twitter.com/' + speaker.twitter"): i.fab.fa-twitter            
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
    speakers: {
      lazy: true,
      get() {
        return fetch('/speakers', {
          method: 'get',
          headers: {
          'Content-Type': 'application/json',
          }
        }).then(res => res.json())
      }
    }
  },
  methods: {
    pickASpeaker: function() {
      this.open = true
    },
    close: function() {
      this.open = false
    }
  }
}
</script>
<template lang="pug">
  .control
    a.button.is-small(v-on:click="pickATag()") Tags
    .modal(v-if="open" v-bind:class="{ 'is-active': open }")
        .modal-background
        .modal-card
          header.modal-card-head
            p.modal-card-title Tags
            button.delete(aria-label="close" v-on:click="close()")
          section.modal-card-body
            .columns.is-multiline.is-mobile
              .column.is-one-quarter-desktop.is-one-third-tablet.is-half-mobile(v-for="tag in tags")
                a.tag.picker.is-capitalized(:href="'/tag/' + tag"): span {{tag}}        
</template>
<style lang="scss">
  .avatar {
    border-radius: 50%
  }

  a.tag.picker {
    width: 100%;

    span {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
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
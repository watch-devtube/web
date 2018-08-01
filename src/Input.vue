<template lang="pug">
  input(ref="query" v-model.lazy="query" v-debounce="300")
</template>

<script>
import { Component } from 'vue-instantsearch'
import debounce from 'v-debounce'

export default {
  directives: { debounce },
  mixins: [Component],
  data() {
    return {
      blockClassName: 'ais-input'
    }
  },
  computed: {
    query: {
      get() {
        return this.$route.query.q
      },
      set(value) {
        this.$router.push({
          name: 'search',
          query: { q: value }
        })
      }
    }
  }
}
</script>
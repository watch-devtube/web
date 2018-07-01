<template>
  <input v-model.lazy="query" v-debounce="300" />
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
        return this.searchStore.query
      },
      set(value) {
        this.searchStore.query = value
        this.$emit('query', value)
      }
    }
  }
}
</script>
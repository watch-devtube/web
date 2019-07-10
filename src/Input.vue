<template lang="pug">
  .field
    p.control.has-icons-left
      input.input(ref="query" v-model.lazy="query" v-debounce="300" autofocus)
      span.icon.is-small.is-left
        i.fas.fa-search
</template>
<script>
import debounce from 'v-debounce'

export default {
  directives: { debounce },
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
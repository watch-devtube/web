<template lang="pug">
  input(ref="query" v-model.lazy="query" v-debounce="300" autofocus)
</template>
<style lang="scss">

  input {
    -webkit-appearance: none;
    outline: none;
    color: white;
    font-weight: 100;
    background-color: inherit;
    padding: 8px 26px 8px 52px;
    border: 1px solid #6498cf;
    border-radius: 3px;
  }  

  input::placeholder{
    color: #fff;
  }  

</style>
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
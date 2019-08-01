<template lang="pug">
  .navbar-item.has-dropdown.is-hoverable.is-size-7
    a.is-size-7.navbar-link.is-arrowless
      font-awesome-icon(:icon="['fa', 'language']")
    .navbar-dropdown.is-boxed.is-size-7
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': (!query.lang) }" @click="langFilter(undefined)") Any
      a.navbar-item.is-size-7(v-for="language in languages" v-bind:class="{ 'is-active': query.lang == language }" @click="langFilter(language)") {{language}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState([ 'query' ])
  },
  data () {
    return {
      languages: ['Chinese', 'Danish', 'English', 'French', 'Italian', 'Spanish', 'German', 'Russian', 'Portuguese', 'Lithuanian', 'Korean', 'Ukrainian'].sort()
    }
  },
  methods: {
    langFilter (lang) {
      this.$parent.hide()
      this.lang(lang)
    },
    sortNow (order) {
      this.$parent.hide()
      this.sort(order)
    },
    ...mapActions('query', [ 'sort', 'lang' ])
  }
}
</script>

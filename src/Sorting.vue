<template lang="pug">
  .navbar-item.has-dropdown.is-hoverable.is-size-7
    a.is-size-7.navbar-link.is-arrowless
      font-awesome-icon(:icon="['fas', 'sort-alpha-down']")
    .navbar-dropdown.is-boxed.is-size-7
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': (query.sortOrder == '-satisfaction' || query.sortOrder == '-featured') }" @click="sortNow('-satisfaction')") Rating
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == '-recordingDate' }" @click="sortNow('-recordingDate')") Date
      a.navbar-item.is-size-7(v-bind:class="{ 'is-active': query.sortOrder == 'duration' }" @click="sortNow('duration')") Duration
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  created () {
    let q = this.$route.query
    let forceOrder = q.by
    if (forceOrder) {
      this.sort(forceOrder)
      let query = Object.assign({}, q)
      delete query.by
      this.$router.replace({ query })
    }
  },
  computed: {
    ...mapState([ 'query' ])
  },
  methods: {
    sortNow (order) {
      this.$parent.hide()
      this.sort(order)
    },
    ...mapActions('query', [ 'sort' ])
  }
}
</script>

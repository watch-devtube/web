<template lang="pug">
.loading(v-if="loading")
  p.is-size-1.is-size-5-mobile.has-text-centered
    | (งツ)ว
    br
    | Searching for the best tech videos...
.loaded(v-else)
  p.is-size-1.is-size-5-mobile.has-text-centered(v-if="!hasVideos")
    | ¯\_(ツ)_/¯ There are no video matching your criteria.
    |
    router-link(:to="{ name: 'search' }") Reset
    |
    | your search criteria or
    |
    a(href="https://github.com/watch-devtube/contrib", target="_blank") contribute
    |
    | YouTube channels.
</template>
<script>
export default {
  props: {
    hasVideos: { type: Boolean },
    loading: { type: Boolean }
  }
};
</script>

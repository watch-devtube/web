<template lang="pug">
.field
  p.control.has-icons-left
    input.input(ref="query", v-model.lazy="query", v-debounce="300", autofocus)
    span.icon.is-small.is-left
      font-awesome-icon(:icon="['fas', 'search']")
</template>
<script>
import debounce from "v-debounce";

export default {
  directives: { debounce },
  computed: {
    query: {
      get() {
        return this.$route.query.q;
      },
      set(q) {
        this.$router.push({
          name: "search",
          query: { q }
        });
      }
    }
  }
};
</script>

<template lang="pug">
  .select.is-small(@change="sort(sorting)")
    select(v-model="sorting")
      option(value="-satisfaction" :selected="(query.sortOrder == '-satisfaction' || query.sortOrder == '-featured')") Top first
      option(value="-recordingDate" :selected="(query.sortOrder == '-recordingDate')") New first
      option(value="duration" :selected="(query.sortOrder == 'duration')") Shortest first
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      sorting: undefined,
    };
  },
  computed: {
    ...mapState(["query"]),
  },
  created() {
    this.sorting = this.query.sortOrder;
  },

  methods: {
    ...mapActions("query", ["sort"]),
  },
};
</script>

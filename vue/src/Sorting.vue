<template lang="pug">
.select.is-small(@change="sort(sorting)")
  select(v-model="sorting")
    option(value="satisfaction", :selected="query.sortOrder == 'satisfaction'") Top first
    option(
      value="recordingDate",
      :selected="query.sortOrder == 'recordingDate'"
    ) New first
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      sorting: undefined
    };
  },
  computed: {
    ...mapState(["query"])
  },
  created() {
    this.sorting = this.query.sortOrder;
  },

  methods: {
    ...mapActions("query", ["sort"])
  }
};
</script>

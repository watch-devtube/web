<template lang="pug">
section.section(v-if="pages > 1")
  .container
    .columns
      .column.has-text-right
        br
        br
        nav.is-small.paging.pagination(
          role="navigation",
          aria-label="pagination"
        )
          ul.pagination-list
            li(v-for="it in pages")
              router-link.pagination-link(
                :aria-label="'Goto page ' + page",
                v-bind:class="{ 'is-current': it == page }",
                :to="{ query: { ...$route.query, p: it } }"
              ) {{ it }}
</template>

<script>
export default {
  props: {
    pages: { type: Number },
    page: { type: Number }
  }
};
</script>
<style lang="scss" scoped>
.pagination-list {
  justify-content: center;
}
</style>

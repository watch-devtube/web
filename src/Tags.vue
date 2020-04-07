<template lang="pug">
  .tags
    span.tag.is-borderless.is-capitalized(v-if="isNew")
      font-awesome-icon(:icon="['far', 'grin-stars']").has-text-success
      | &nbsp; New
    span.tag.is-borderless.is-capitalized(v-if="isFeatured")
      font-awesome-icon(:icon="['far', 'heart']").has-text-danger
      | &nbsp; Best
    a.tag(v-for="(tag) in tags" v-on:click="refineTag(tag)") {{tag | capitalizeIfNeeded}}
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true,
    },
    isNew: { type: Boolean, required: true },
    isFeatured: { type: Boolean, required: true },
  },
  methods: {
    refineTag(tag) {
      this.$router.push({ name: "tag", params: { tag: tag } });
    },
  },
};
</script>
<style lang="scss">
.is-borderless {
  border: none !important;
}
.tag {
  font-size: 11px !important;
}
</style>

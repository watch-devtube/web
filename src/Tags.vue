<template lang="pug">
.tags.is-inline
  span.tag.is-borderless(v-if="isNew")
    .is-inline
      font-awesome-icon.has-text-success(:icon="['far', 'grin-stars']")
      |
      | New
  span.tag.is-borderless(v-if="isFeatured")
    .is-inline
      font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
      |
      | Best
</template>
<script>
export default {
  props: {
    isNew: { type: Boolean, required: true },
    isFeatured: { type: Boolean, required: true }
  }
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

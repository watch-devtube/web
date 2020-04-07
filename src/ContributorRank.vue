<template lang="pug">
  .tags.has-addons
    .tag
      | Karma&nbsp;
      font-awesome-icon(:icon="['far', 'heart']").has-text-danger
      strong &nbsp;{{karma}}
</template>
<script>
export default {
  props: {
    karma: { type: Number, required: true },
  },
};
</script>

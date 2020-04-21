<template lang="pug">
  .tags.has-addons
    .tag
      .is-inline
        | Karma
        |
        font-awesome-icon(:icon="['far', 'heart']").has-text-danger
        |
        strong
          |
          | {{karma}}
</template>
<script>
export default {
  props: {
    karma: { type: Number, required: true }
  }
};
</script>

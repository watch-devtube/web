<template lang="pug">
  .tags.has-addons
    .tag
      | Karma&nbsp;
      i.far.fa-heart.has-text-danger
      strong &nbsp;{{karma}}
</template>
<script>
export default { 
  props: {
    karma: { type: Number, required: true }
  }
}
</script>
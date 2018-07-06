<template lang="pug">
  .tags(v-if="collapsed")
    a.tag.is-capitalized(v-for="item in items.slice(0, limit)" @click="navigate(item)")
        slot(v-bind:item="item") {{item}}
    a.tag(@click="collapsed = false"): b ...
  .tags(v-else)
    a.tag.is-capitalized(v-for="item in items" @click="navigate(item)") 
      slot(v-bind:item="item") {{item}}
    a.tag(@click="collapsed = true"): b show less
</template>
<script>
  export default {    
    props: {
      route: { type: Function, required: true },
      limit: { type: Number, required: true },
      items: { type: Array, required: true }
    },
    methods: {
      navigate: function(item) {
        this.$router.push(this.route(item))
      }
    },
    data: function() {
      return {
        collapsed: true
      }
    }
  }
</script>
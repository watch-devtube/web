<template lang="pug">
  .expandable-tags
    a.button.is-small.is-hidden-tablet(@click="collapsed = false")
      span.icon.is-small
        i(v-bind:class="classObject")
    .modal(v-bind:class="{'is-active': !collapsed}")
      .modal-background
      .modal-content
        .tags
          a.tag.is-info.is-capitalized(v-for="item in items" @click="navigate(item)")
            slot(v-bind:item="item") {{item}}
      .modal-close.is-large(aria-label="close" @click="collapsed = !collapsed")
    .is-hidden-mobile
      p
        h2.subtitle
          i(v-bind:class="classObject")
          |  {{title}}
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
    computed: {
      classObject: function () {
        return this.icon
      }
    },
    props: {
      icon:  { type: String, required: false },
      title: { type: String, required: false },
      route: { type: Function, required: true },
      limit: { type: Number, required: true },
      items: { type: Array, required: true }
    },
    methods: {
      navigate: function(item) {
        this.collapsed = true
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
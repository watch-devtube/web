<template lang="pug">
  .expandable-tags
    .modal(v-bind:class="{'is-active': !collapsed}")
      .modal-background(@click="collapsed = !collapsed")
      .modal-content
        .field.is-grouped.is-grouped-multiline
          .control(v-for="item in items")
            .tags.has-addons
              a.tag.is-dark(@click="navigate(item)"): slot(v-bind:item="item") {{item}}
              a.is-black.tag(@click="navigate(item)") 
                | {{item.videos.total | kilo}}  
                span(v-if="item.videos.new > 0") &nbsp; +{{item.videos.new}}
      .modal-close.is-large(aria-label="close" @click="collapsed = !collapsed")

    .is-hidden-mobile
      p
        h2.subtitle
          a(@click="collapsed = false") 
            i(v-bind:class="fontAwesome")
            |  {{title}}
        .tags.has-addons.is-marginless(v-for="item in items.slice(0, limit)")
          a.tag.is-white.is-capitalized(@click="navigate(item)"): slot(v-bind:item="item") {{item}}
          a.tag(@click="navigate(item)") 
            | {{item.videos.total | kilo}}
            span(v-if="item.videos.new > 0") &nbsp; +{{item.videos.new}} new
        .tags.has-addons.is-marginless
          a.tag.is-white.is-capitalized(@click="collapsed = !collapsed") More
          a.tag(@click="collapsed = !collapsed") ...
</template>
<style lang="scss">
  .collapsedScreen .has-addons {
    margin-bottom: 0
  }
</style>
<script>
  export default {    
    computed: {
      fontAwesome: function () {
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
      expand: function() {
        this.collapsed = false
      },
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
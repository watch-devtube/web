<template lang="pug">
  mixin newCount
    .newCount.has-text-info(v-if="item.videos.new == item.videos.total") NEW!
    .newCount.has-text-white(v-else-if="item.videos.new > 0") +{{item.videos.new}}  
  .modal(v-bind:class="{'is-active': isExpanded}")
    .modal-background(@click="toggleCollapse()")
    .modal-content
      .field.is-grouped.is-grouped-multiline(v-for="item in itemsColection")
        .control
          .tags.has-addons
            a.tag.is-dark(@click="navigate(item)")
              slot(v-bind:item="item") 
                | {{item}}
            a.is-black.tag(@click="navigate(item)") 
              | {{item.videos.total | kilo}} videos
            +newCount()
        .subscribes(v-if="auth.user")
          a.button.is-danger.is-outlined.is-small(v-if="hasSubscription(subscription(item))" @click="toggleSubscription(subscription(item))") 
            .icon.is-small
              font-awesome-icon(icon="times")
            span unsubscribe
          a.button.is-info.is-outlined.is-small(v-else @click="toggleSubscription(subscription(item))") 
            span subscribe
    .modal-close.is-large(aria-label="close" @click="toggleCollapse()")
</template>
<style lang="scss">
  .collapsedScreen .has-addons {
    margin-bottom: 0
  }

  .newCount {
    font-size: 9px;
    position: relative;
    top: -12px;
    left: 3px;
  }
</style>
<script>

  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {    
    computed: {
      html() {
        return document.documentElement
      },
      isExpanded() {
        return !this.collapsed
      },
      itemsColection() {
        return window.featured[this.items]
      },
      ...mapState([ 'auth' ]),
      ...mapGetters('videos', ['hasSubscription']),
    },
    props: {
      attr: { type: String, required: false },
      title: { type: String, required: false },
      type: { type: String, required: true },
      limit: { type: Number, required: true },
      items: { type: String, required: true }
    },
    methods: {
      subscription(item) {
        return { topic : item[this.attr], type : this.type }
      },
      toggleCollapse() {
        this.collapsed = !this.collapsed

        if (!this.collapsed) {
          this.html.classList.add('is-clipped')
        } else {
          this.html.classList.remove('is-clipped')
        }
      },
      navigate(item) {
        this.$parent.hide()
        this.collapsed = true
        let routeParams = { }
        routeParams[this.type] = item[this.attr]
        let route = { params: routeParams }
        route.name = this.type
        this.$router.push(route)
        this.html.classList.remove('is-clipped')
      },
      ...mapActions('videos', [ 'toggleSubscription']),
    },
    data: function() {
      return {
        collapsed: true
      }
    }
  }
</script>
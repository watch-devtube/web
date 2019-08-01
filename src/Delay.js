export default {
  name: 'Delay',

  props: {
    wait: {
      type: Number,
      default: 0
    },
    from: {
      type: Number,
      default: Date.now()
    }
  },

  data: () => ({
    waiting: true
  }),

  created () {
    this.timer = setTimeout(() => {
      this.waiting = false
    }, this.from - Date.now() + this.wait)
  },

  destroyed () {
    clearTimeout(this.timer)
  },

  render (h) {
    return h(
      'div',
      this.waiting ? this.$slots.loading || null : this.$slots.default
    )
  },

  install (Vue, name) {
    Vue.component(name || 'Delay', this)
  }
}

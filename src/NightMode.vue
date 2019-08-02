<template lang="pug">
  a.navbar-item.is-size-7(@click="toggle()" v-if="theme === 'night'") Day mode
  a.navbar-item.is-size-7(@click="toggle()" v-else) Night mode
</template>
<script>
export default {
  mounted() {
    this.theme = localStorage.getItem('theme') || 'day'
    this.toggle()
  },
  data() {
    return {
      theme: ''
    }
  },
  methods: {
    toggle() {
      this.theme = !this.theme || this.theme === 'night' ? 'day' : 'night'
      localStorage.setItem('theme', this.theme)
      const html = document.getElementsByTagName('html')[0]
      html.classList.remove('theme-day', 'theme-night')
      html.classList.add(`theme-${this.theme}`)
    }
  }
}
</script>

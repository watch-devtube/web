<template lang="pug">
  nav.navbar.is-fixed-top.is-dark
    .navbar-brand(style="margin-left: -.75rem")
      .navbar-item
        | &nbsp;&nbsp;&nbsp;
        img#logo.logo(src="/logo.png" srcset="/logo.svg" @click="home()")
        a.is-size-7.has-text-white(href="https://devternity.com" target="_blank")
          span &nbsp; by DevTernity  
      .navbar-item
        Input(placeholder="Search for videos...") 
      .navbar-burger.burger.has-text-white(data-target="navbarMenu" @click="toggle()" v-bind:class="{ 'is-active': active }")
        span
        span
        span
    .navbar-menu#navbarMenu(style=" margin-right: -.75rem" v-bind:class="{ 'is-active': active }")
      .navbar-start
        slot
      .navbar-end
        a.navbar-item.is-size-7(v-if="auth.user" @click="logout()") 
          img(:src="auth.user.picture" style="height: 36px; border-radius: 50%")
          | &nbsp; Sign out
        a.navbar-item.is-size-7(v-else @click="login()") Sign in {{auth.user}}
        a.is-size-7.navbar-item(v-if="auth.error"): span {{auth.error}}
        NightMode
        | &nbsp; &nbsp;  
</template>
<style lang="scss">
header {
  input {
    -webkit-appearance: none;
    outline: none;
    color: white;
    font-weight: 100;
    background-color: inherit;
    padding: 8px 26px 8px 52px;
    border: 1px solid #6498cf;
    border-radius: 3px;
  }  

  input::placeholder{
    color: #fff;
  }  

  @media only screen and (max-width: 768px) {
    input {
      padding: 5px 0px 5px 25px;
    }
    .logo {
      width: 45px;
    }
  }

}
</style>
<script>
  import Input from './Input.vue'
  import NightMode from './NightMode.vue'
  import { mapState, mapActions } from 'vuex'


  export default {
    computed: mapState([ 'auth' ]),
    data: function() {
      return {
        active: false
      }
    },
    methods: {
      // double check if toggle() is not used in children components
      toggle() {
        this.active = !this.active
      },
      hide() {
        this.active = false
      },
      home() {
        window.location = "/"
      },
      ...mapActions('auth', [ 'login', 'logout' ])
    },
    components: { Input, NightMode }  
  }
</script>
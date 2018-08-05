<template lang="pug">
  nav.navbar.is-fixed-top.is-dark(role="navigation" aria-label="main navigation")
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
        a.navbar-item.is-hoverable.is-size-7(v-if="auth.user")
          .face.is-hidden-touch(:style="'background-image: url(' + auth.user.photoUrl + ')'")
          font-awesome-icon.is-hidden-touch(icon="ellipsis-v")
          span.is-hidden-desktop {{auth.user.name}}
          .navbar-dropdown.is-boxed.is-size-7
            a.navbar-item.is-size-7(@click="showWatched()") 
              | Watched videos ({{watchedCount}})
            a.navbar-item(@click="signOut()") Logout

        a.navbar-item.is-hoverable.is-size-7(v-else) Log in
          .navbar-dropdown.is-boxed.is-size-7
            a.navbar-item.is-size-7(@click="signIn('github'); hide()") via Github
            a.navbar-item.is-size-7(@click="signIn('google'); hide()") via Google
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

  .face {
    height: 30px;
    width: 30px;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid white;
    margin-right: 0.5em;
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

  import { mapState, mapActions, mapGetters } from 'vuex'


  export default {
    computed: {
      ...mapState([ 'auth' ]),
      ...mapGetters('videos', [ 'watchedCount' ])
    },
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
      showWatched() {
        this.$router.push({
          name: 'search',
          query: { w: 'true' }
        });
        this.hide();
      },
      ...mapActions('auth', [ 'signOut', 'signIn']),
    },
    components: { Input, NightMode }  
  }
</script>
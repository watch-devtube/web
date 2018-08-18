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
        router-link.navbar-item(:to='{ name: "discovery" }' @click.native="hide()") Discovery
        router-link.navbar-item(v-if="auth.user && hasSubscriptions" :to='{ name: "search", query: { feed: "true" } }' @click.native="hide()") Subscriptions
        router-link.navbar-item(v-if="watchedCount"  :to='{ name: "search", query: { w: "true" } }' @click.native="hide()") 
          | Watched ({{watchedCount}})
        router-link.navbar-item(v-if="favoriteCount" :to='{ name: "search", query: { f: "true" } }' @click.native="hide()") 
          | Favorites ({{favoriteCount}})
        a.navbar-item(@click="$refs.tags.toggleCollapse()")
          i.fas.fa-hashtag 
          | &nbsp;Tags
        ExpandableTags(ref="tags" title="Tags" items="tags" :limit="10" type="tag" attr="tag")
          template(slot-scope="slot") {{slot.item.tag | capitalizeIfNeeded}}
        a.navbar-item(@click="$refs.speakers.toggleCollapse()")
          i.far.fa-user-circle
          | &nbsp;Speakers
        ExpandableTags(ref="speakers" title="Speakers" items="speakers" :limit="10" type="speaker" attr="twitter")
          template(slot-scope="slot") {{slot.item.name | capitalizeIfNeeded}}
        a.navbar-item(@click="$refs.channels.toggleCollapse()")
          i.fab.fa-youtube
          | &nbsp;Channels
        ExpandableTags(ref="channels" title="Channels" items="channels" :limit="10" type="channel" attr="title")
          template(slot-scope="slot") {{slot.item.title | truncate(25) | capitalizeIfNeeded}}
        slot
      .navbar-end
        a.navbar-item.is-hoverable(v-if="auth.user")
          .face.is-hidden-touch(:style="'background-image: url(' + auth.user.photoUrl + ')'")
          font-awesome-icon.is-hidden-touch(icon="ellipsis-v")
          span.is-hidden-desktop {{auth.user.name}}
          .navbar-dropdown.is-right.is-boxed
            NightMode
            a.navbar-item(@click="signOut()") Logout

        a.navbar-item.is-hoverable(v-else) 
          font-awesome-icon(:icon="['far', 'user']")
          | &nbsp;Log in
          .navbar-dropdown.is-right.is-boxed
            a.navbar-item(@click="signIn('github'); hide()") via Github
            a.navbar-item(@click="signIn('twitter'); hide()") via Twitter
            a.navbar-item(@click="signIn('google'); hide()") via Google
        | &nbsp;&nbsp;&nbsp;
</template>
<style lang="scss" scoped>
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

  .navbar-menu .navbar-item {
    font-size: 12px;
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
  import ExpandableTags from './ExpandableTags.vue'

  import { mapState, mapActions, mapGetters } from 'vuex'


  export default {
    computed: {
      ...mapState([ 'auth' ]),
      ...mapGetters('videos', [ 'watchedCount', 'favoriteCount', 'hasSubscriptions' ])
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
      ...mapActions('auth', [ 'signOut', 'signIn']),
    },
    components: { Input, NightMode, ExpandableTags }  
  }
</script>
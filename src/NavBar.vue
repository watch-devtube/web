<template lang="pug">
nav.navbar.is-fixed-top.is-dark(role="navigation", aria-label="main navigation")
  .navbar-brand
    .navbar-item
      img#logo.logo(
        src="/logo.png",
        srcset="/logo.svg",
        @click="home()",
        alt="logo"
      )
      a.is-size-7.has-text-white(
        href="https://devternity.com",
        target="_blank"
      )
        span.is-hidden-mobile
          |
          | by DevTernity
    .navbar-item
      Input(placeholder="Search for videos...")
    .navbar-burger.burger.has-text-white(
      data-target="navbarMenu",
      @click="toggle()",
      v-bind:class="{ 'is-active': active }"
    )
      span
      span
      span
  #navbarMenu.navbar-menu(
    style="margin-right: -0.75rem",
    v-bind:class="{ 'is-active': active }"
  )
    .navbar-start
      router-link.navbar-item(
        v-bind:class="{ 'is-active': $route.name === 'subscriptions' }",
        v-if="auth.user && hasSubscriptions",
        :to="{ name: 'subscriptions' }",
        @click.native="hide()"
      ) Subscriptions
      router-link.navbar-item(
        v-bind:class="{ 'is-active': $route.name === 'watched' }",
        title="Watched",
        :to="{ name: 'watched' }",
        @click.native="hide()"
      )
        span.is-hidden-desktop Watched&nbsp;
        font-awesome-icon(:icon="['far', 'eye']")
      router-link.navbar-item(
        v-bind:class="{ 'is-active': $route.name === 'favorites' }",
        title="Favorites",
        :to="{ name: 'favorites' }",
        @click.native="hide()"
      )
        span.is-hidden-desktop Favorites&nbsp;
        font-awesome-icon(:icon="['far', 'star']")
      a.navbar-item(title="Speakers", @click="$refs.speakers.toggleCollapse()")
        span Speakers
          | &nbsp;
          font-awesome-icon(:icon="['far', 'user-circle']")
      ExpandableTags(
        ref="speakers",
        title="Speakers",
        items="speakers",
        :limit="10",
        type="speaker",
        attr="twitter"
      )
        template(slot-scope="slot") {{ slot.item.name }}
      a.navbar-item(title="Channels", @click="$refs.channels.toggleCollapse()")
        span Channels
          | &nbsp;
          font-awesome-icon(:icon="['fab', 'youtube']")
      ExpandableTags(
        ref="channels",
        title="Channels",
        items="channels",
        :limit="10",
        type="channel",
        attr="title"
      )
        template(slot-scope="slot") {{ slot.item.title | truncate(25) }}
      slot
    .navbar-end
      a.navbar-item.is-hoverable(v-if="auth.user")
        .karma.is-hidden-touch
          .is-inline
            font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
            |
            | {{ karma.karma }}
            |
        .face.is-hidden-touch(
          :style="'background-image: url(' + auth.user.photoUrl + ')'"
        )
        font-awesome-icon.is-hidden-touch(icon="ellipsis-v")
        span.is-hidden-desktop {{ auth.user.name }}
        .navbar-dropdown.is-right.is-boxed
          a.navbar-item(@click="signOut()") Logout

      a.navbar-item.is-hoverable(v-else)
        a.navbar-link Log in
        .navbar-dropdown.is-right.is-boxed
          a.navbar-item(@click="signIn('github'); hide()") via Github
          a.navbar-item(@click="signIn('twitter'); hide()") via Twitter
          a.navbar-item(@click="signIn('google'); hide()") via Google
</template>
<style lang="scss" scoped>
header {
  .logo {
    cursor: pointer;
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
    margin-right: 0.5em;
    margin-left: 0.5em;
  }

  @media only screen and (max-width: 768px) {
    .logo {
      width: 45px;
    }
  }
}
</style>
<script>
import Input from "./Input.vue";
import ExpandableTags from "./ExpandableTags.vue";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: { Input, ExpandableTags },
  data: function() {
    return {
      active: false
    };
  },
  computed: {
    ...mapState(["auth", "karma"]),
    ...mapGetters("videos", ["hasSubscriptions"])
  },
  methods: {
    // double check if toggle() is not used in children components
    toggle() {
      this.active = !this.active;
    },
    hide() {
      this.active = false;
    },
    home() {
      window.location = "/";
    },
    ...mapActions("auth", ["signOut", "signIn"])
  }
};
</script>

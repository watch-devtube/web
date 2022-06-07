<template lang="pug">
section.section.header.p-5.mb-6
  .container(role="navigation", aria-label="main navigation")
    .columns.is-mobile.is-vcentered.is-gapless
      .column.is-narrow
        router-link(:to="'/'")
          img.logo(src="/logo_dark.png", srcset="/logo_dark.svg", alt="logo")
        span.is-hidden-mobile
          br
          a.devternity.is-size-7.is-family-code.has-text-white.has-text-weight-bold(href="https://devternity.com" target="_blank") &nbsp;inspired by DevTernity
      .column
        .is-pulled-right
          .columns.is-mobile.is-vcentered.is-size-5.is-size-7-mobile
            .column.is-narrow(v-if="isLoggedIn && lists.later.length")
              router-link.has-text-weight-bold.has-text-white.is-size-7(:to="'/later'") later
              span.count.has-text-white.is-size-7 {{lists.later.length}}
            .column.is-narrow(v-if="isLoggedIn && lists.favorites.length")
              router-link.has-text-weight-bold.has-text-white.is-size-7(:to="'/favorites'") favorites
              span.count.has-text-white.is-size-7 {{lists.favorites.length}}
            .column.is-narrow(v-if="isLoggedIn &&lists.watched.length")
              router-link.has-text-weight-bold.has-text-white.is-size-7(:to="'/watched'") watched          
              span.count.has-text-white.is-size-7 {{lists.watched.length}}          
            .column.is-narrow
              .columns.is-2.is-variable.is-vcentered.is-mobile(v-if="isLoggedIn")
                .column.is-hidden-mobile.is-size-7.is-narrow
                  font-awesome-icon(:icon="['far', 'heart']").has-text-danger
                  span.has-text-white  {{karma()}}
                .column.is-hidden-mobile(v-if="avatar")
                  figure.image.is-32x32
                    img.is-rounded(:src="avatar")
                .column
                  button.button.is-text.has-text-white.is-small(@click="logout()") logout
              button.button.is-text.is-small.has-text-white(v-else @click="showPopup()") login
</template>
<style lang="scss" scoped>
.header {
  background-color: #343d46;
}
.logo {
  height: 103px;
  height: 30px;
}
@media (max-width: 768px) {
  .logo {
    width: 60px;
  }
}

.count {
  position: relative;
  left: 2px;
  bottom: 5px;
}
</style>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  computed: {
    lists() {
      return this.$store.state.user;
    },
    ...mapState("auth", ["avatar", "username"]),
    ...mapGetters("auth", ["isLoggedIn"])
  },
  methods: {
    karma() {
      const karma = this.$store.state.auth.karma;
      if (karma >= 1000) {
        return Math.round(karma / 1000) + "K";
      } else {
        return karma;
      }
    },
    ...mapActions("auth", ["showPopup", "logout"])
  }
};
</script>

<template lang="pug">
section.section
  .container(role="navigation", aria-label="main navigation")
    .columns.is-mobile.is-vcentered.is-gapless
      .column.is-narrow
        router-link(:to="{ name: 'search' }")
          picture
            source(
              srcset="/logo_dark.svg",
              media="(prefers-color-scheme: dark)"
            )
            img.logo(src="/logo.png", srcset="/logo.svg", alt="logo")
      .column.is-narrow.is-hidden-mobile
        a.is-size-7.has-text-weight-bold(
          style="position: relative; top: -3px",
          href="//devternity.com?utm_source=devtube&utm_medium=header",
          target="_blank",
          ref="noopener"
        ) by DevTernity
      .column
        .is-pulled-right
          .columns.is-mobile.is-vcentered.is-size-5.is-size-7-mobile
            .column.is-narrow(v-if="isAuthEnabled")
              .columns.is-gapless.is-vcentered.is-mobile(v-if="isLoggedIn")
                .column.is-narrow(v-if="avatar")
                  figure.image.is-16x16
                    img.is-rounded(:src="avatar")
                .column.is-narrow
                  a.button.is-text.is-small(@click="logout()") logout
              a.button.is-text.is-small(v-else @click="showPopup()") login
</template>
<style lang="scss" scoped>
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

@media (max-width: 768px) {
  .logo {
    width: 60px;
  }
}
</style>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  computed: {
    isAuthEnabled() {
      return (
        window.location.href.includes(".test") ||
        this.$router.currentRoute.hash == "#enableLogin"
      );
    },
    ...mapState("auth", ["avatar"]),
    ...mapGetters("auth", ["isLoggedIn"])
  },
  methods: {
    ...mapActions("auth", ["showPopup", "logout"])
  }
};
</script>

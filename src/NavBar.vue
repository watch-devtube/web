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
          .columns.is-mobile.is-vcentered.is-size-5.is-size-7-mobile(
            v-if="auth.user"
          )
            .column.is-narrow
              router-link.nav-link(
                v-bind:class="{ 'nav-active': $route.name === 'subscriptions' }",
                v-if="auth.user && hasSubscriptions",
                :to="{ name: 'subscriptions' }"
              ): strong.is-lowercase Subscriptions
            .column.is-narrow
              router-link.nav-link(
                v-bind:class="{ 'nav-active': $route.name === 'watched' }",
                title="Watched",
                :to="{ name: 'watched' }"
              ): strong watched
            .column.is-narrow
              router-link.nav-link(
                v-bind:class="{ 'nav-active': $route.name === 'favorites' }",
                title="Favorites",
                :to="{ name: 'favorites' }"
              ): strong favorites
            .column.is-narrow
              .columns.is-gapless.is-mobile.is-vcentered
                .column.is-narrow.is-hidden-mobile
                  .title.is-size-7
                    font-awesome-icon.has-text-danger(:icon="['far', 'heart']")
                    |
                    | {{ karma.karma }}
                    |
                .column.is-narrow.is-hidden-mobile
                  .face(
                    :style="'background-image: url(' + auth.user.photoUrl + ')'"
                  ) 
                .column.is-narrow
                  a.title.is-size-7(@click="signOut()") logout
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
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["auth", "karma"]),
    ...mapGetters("videos", ["hasSubscriptions"])
  },
  methods: {
    ...mapActions("auth", ["signOut", "signIn"])
  }
};
</script>

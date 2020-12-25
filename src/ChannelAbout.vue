<template lang="pug">
.channel(v-if="profile")
  .columns.is-mobile
    .column.is-narrow
      figure.image.is-128x128
        img.is-rounded(:src="profile.img['128']", :alt="`${channel} logo`")
    .column
      h1.title {{ channel }}
      h2.subtitle.is-size-6 {{ profile.info | noemoji }}
  .buttons
    a.button(@click="toggleChannelSubscription(channel)")
      | {{ hasChannelSubscription(channel) ? 'Unsubscribe' : 'Subscribe' }}
  hr
</template>
<style lang="scss" scoped>
.is-rounded {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3), 0 2px 4px 0 rgba(0, 0, 0, 0.3);
}
</style>
<script>
import { mapGetters, mapActions } from "vuex";
import { dossier } from "./api";
export default {
  props: {
    channel: { type: String }
  },
  data: () => {
    return {
      profile: undefined
    };
  },
  created() {
    dossier
      .get(`/twt/youtube`)
      .then(({ data }) => data)
      .then(profile => (this.profile = profile));
  },
  methods: {
    ...mapActions("videos", ["toggleChannelSubscription"])
  },
  computed: {
    ...mapGetters("videos", ["hasChannelSubscription"])
  }
};
</script>

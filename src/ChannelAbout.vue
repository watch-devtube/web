<template lang="pug">
.channel(v-if="profile")
  .columns
    .column.is-narrow
      figure.image.is-192x192
        img(:src="profile.img['128']", :alt="`${channel} logo`")
    .column
      h1.title {{ channel }}
      h2.subtitle.is-size-6 {{ profile.info | noemoji }}
  .buttons
    a.button(@click="toggleChannelSubscription(channel)")
      | {{ hasChannelSubscription(channel) ? 'Unsubscribe' : 'Subscribe' }}
  hr
</template>
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

<template lang="pug">
.speaker(v-if="profile")
  .columns
    .column.is-narrow
      figure.image.is-192x192
        img(:src="profile.img['128']", :alt="`${twitter} avatar`")
    .column
      h1.title {{ profile.name | noemoji }}
      h2.subtitle.is-size-6 {{ profile.info | noemoji }}
  .buttons
    a.button(@click="toggleSpeakerSubscription(twitter)")
      | {{ hasSpeakerSubscription(twitter) ? 'Unsubscribe' : 'Subscribe' }}
    a.button(:href="`https://twitter.com/${twitter}`", rel="nofollow")
      font-awesome-icon(:icon="['fab', 'twitter']") 
  hr
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { dossier } from "./api";
export default {
  props: {
    twitter: { type: String }
  },
  data: () => {
    return {
      profile: undefined
    };
  },
  created() {
    dossier
      .get(`/twt/${this.twitter}`)
      .then(({ data }) => data)
      .then(profile => (this.profile = profile));
  },
  methods: {
    ...mapActions("videos", ["toggleSpeakerSubscription"])
  },
  computed: {
    ...mapGetters("videos", ["hasSpeakerSubscription"])
  }
};
</script>

<template lang="pug">
  .columns.is-centered
    .column.has-text-centered
      figure.image.is-128x128.container
        img.is-rounded(:src="`https://avatars.io/twitter/${twt}`" :alt="`${twt} avatar`")
      h2.is-size-5 {{profile.name}}
      a.is-size-7.is-lowercased(:href="`https://twitter.com/${twt}`" rel="nofollow")
        font-awesome-icon(:icon="['fab', 'twitter']")
        |  {{twt}}
      p.profileInfo.is-size-7 {{profile.info}}
      hr
      .level.is-mobile
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Videos</p>
            <p>{{stats.videos | kilo}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">On Stage</p>
            <p>{{stats.stage | durationFull}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Likes</p>
            <p>{{stats.likes | kilo}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Views</p>
            <p>{{stats.views | kilo}}</p>
          </div>
        </div>
      br
      .subscriptions
        a.button(@click="toggleSpeakerSubscription(twt)")
          | {{hasSpeakerSubscription(twt) ? 'Unsubscribe' : 'Subscribe'}}
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  props: {
    twt: { type: String, required: true },
    stats: { type: Object, required: true },
  },
  data() {
    return {
      profile: {},
    };
  },
  computed: {
    ...mapState(["auth"]),
    ...mapGetters("videos", ["hasSpeakerSubscription"]),
  },
  created() {
    axios
      .get(`https://dossier.dev.tube/twt/${this.twt}`)
      .then(({ data }) => data)
      .then((profile) => (this.profile = profile));
  },
  methods: {
    ...mapActions("videos", [
      "toggleSubscription",
      "toggleSpeakerSubscription",
    ]),
  },
};
</script>

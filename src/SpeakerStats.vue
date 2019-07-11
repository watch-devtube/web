<template lang="pug">
  .columns.is-centered(v-if="profile && profile.name")
    .column.has-text-centered
      figure.image.is-128x128.container
        img.is-rounded(:src="'https://avatars.io/twitter/' + twt" :alt="twt + ' avatar'")
      h2.is-size-5 {{profile.name}}
      a.is-size-7.is-lowercased(:href="'https://twitter.com/' + twt" rel="nofollow")
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
      .subscriptions(v-if="auth.user") 
        a.button(v-if="hasSubscription(subscription(twt))" @click="toggleSubscription(subscription(twt))") Unsubscribe
        a.button(v-else @click="toggleSubscription(subscription(twt))") Subscribe
      a.button(v-else @click="requreLogin()") Subscribe
</template>
<style lang="scss">
  .is-rounded {
    border: 1px solid white;
  }
  .profileInfo {
    margin-top: 0.5rem;
  }

</style>
<script>
  import { mapState, mapActions, mapGetters } from 'vuex'
  import TalksChart from './TalksChart.vue'
  import axios from 'axios'
  export default {
    props: {
      twt: { type: String, required: true },
      stats: { type: Object, required: false }
    },
    created() {
      this.profile = window.speaker
    },
    computed: {
      ...mapState([ 'auth' ]),
      ...mapGetters('videos', ['hasSubscription']),
    },
    asyncComputed: {
      profile() {
        if (this.twt)
          return window.speaker || axios.get(`https://dossier.dev.tube/twt/` + this.twt).then(response => response.data)
      }
    },
    methods: {
      requreLogin() {
        this.$store.dispatch('notify/error', { text: 'You have to login first.', title: '', duration: 3000 })
      },
      subscription(item) {
        return { topic : item, type : 'speaker' }
      },      
      ...mapActions('videos', [ 'toggleSubscription']),
    },
    components: { TalksChart }
  }
</script>
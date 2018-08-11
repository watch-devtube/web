<template lang="pug">
  .toggles
    a.video-action.watched(@click="toggleWatched(videoId); hide()" v-if="auth.user")
      font-awesome-layers(v-if="isWatched(videoId)" title="unmark watched")
        font-awesome-icon.fa-stack-1x(icon="eye")
        font-awesome-icon.fa-stack-1x(icon="times" transform="shrink-8 up-7 right-7")                        
      font-awesome-layers(v-else title="mark watched")
        font-awesome-icon.fa-stack-1x(icon="eye")
        font-awesome-icon.fa-stack-1x(icon="check" transform="shrink-8 up-7 right-7")          
    a.video-action.favorite(@click="toggleFavorite(videoId)" v-if="auth.user")
      font-awesome-icon.has-text-warning(icon="star" v-if="isFavorite(videoId)")
      font-awesome-icon(icon="star" v-else)
</template>
  
<style lang="scss">

  .toggles {

    .watched {
      height: 1em;
      z-index: 29;
      right: 10px;
      top: 3px;
      position: absolute;
    }

    .favorite {
      height: 1em;
      z-index: 29;
      left: 6px;
      top: 3px;
      position: absolute;      
    }


    .video-action {
      font-size: 22px;
      color: white;
      opacity: 0.8;
    }

    .video-action:hover {
      animation: pulse 1s infinite linear;
    }

  }
</style>
<script>

  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    props: {
      videoId: { type: String, required: true },
      onWatched: { type: Function, required: false }
    },
    computed: {
      ...mapState([ 'videos', 'auth' ]),
      ...mapGetters('videos', ['isWatched', 'isFavorite']),
    },
    methods: {
      hide() {
        if (this.onWatched) {
          this.onWatched()
        }
      },
      ...mapActions('videos', [ 'toggleWatched', 'toggleFavorite' ])
    }
  }
</script>
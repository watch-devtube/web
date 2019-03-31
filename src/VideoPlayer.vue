<template lang="pug">
  .videoPlayer
      video(ref="videoPlayer" class="video-js")
      progress.progress.is-small(:value="elapsed" :max="duration") {{elapsed}}
</template>
<style lang="scss">
  progress {
    border-radius: 0 !important;
    height: 0.25rem !important;
  }
</style>
<script>
import VueTimers from 'vue-timers/mixin'
import { timer } from 'vue-timers'
import videojs from 'video.js'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
    mixins: [VueTimers],
    timers: {
      progress: { time: 1000, autostart: true, repeat: true }
    },
    name: "VideoPlayer",
    props: {
        starts: {
          type: String,
          required: true
        },      
        duration: {
          type: Number,
          required: true
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            elapsed: 0,
            player: null
        }
    },
    computed: {
    },
    methods: {
      progress() {
        this.elapsed = dayjs().diff(this.starts, 'second')
      },
      play() {
        const newTime = dayjs().diff(this.starts, 'second')
        this.player.currentTime(newTime)
        this.player.play()
      }
    },
    mounted() {
        const that = this
        const playTime = dayjs().diff(this.starts, 'second')
        this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
            this.currentTime(playTime)
            this.volume(1.0)
            this.play().catch(error => that.$emit('autoplayPrevented'))    
            that.$emit('playerLoaded')
        })
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>
<template lang="pug">
  delay(:wait="5000")
    .message-widget(v-if="ad")
      .buttons
        a(v-on:click.stop="close"): font-awesome-icon(:icon="['fas', 'times']")
      a(:href="'https://twitter.com/' + this.ad.author"): img.agent(:src="'https://twitter-avatar.now.sh/' + this.ad.author" :alt="this.ad.author + ' avatar'")
      .message
        .content(v-html="ad.message")
</template>
<style lang="scss">
.message-widget {
  opacity: 0.95;
  border-radius: 5px;
  width: 320px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  box-shadow: 2px 10px 40px rgba(22, 20, 19, 0.4);

  .buttons {
    position: absolute;
    right: 10px;
    a {
      color: #dbdbdb;
    }
  }

  .message {
    font-size: 0.9em;
    padding: 30px;
  }

  .agent {
    position: absolute;
    left: -40px;
    top: 20px;
    border: 3px solid #fff;
    width: 60px;
    border-radius: 50%;
  }
}
</style>
<script>
import { ads } from "./api";
import Delay from "./Delay";

export default {
  components: { Delay },
  props: {
    videoId: { type: String, required: true },
    channel: { type: String, required: true },
    speaker: { type: Array, required: true },
    tags: {
      required: false,
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: function() {
    return {
      ad: ""
    };
  },
  watch: {
    $route: "fetch"
  },
  created() {
    this.fetch();
  },
  methods: {
    close() {
      this.ad = undefined;
    },
    fetch() {
      const textForMatching = `${this.videoId}/${
        this.channel
      }/${this.speaker.map(speaker => "@" + speaker.twitter)}/${this.tags.map(
        tag => "#" + tag + "#"
      )}`;
      ads
        .get(`messages.json?r=${Math.random()}`)
        .then(response => {
          this.ad = response.data
            .reverse()
            .find(it => new RegExp(it.pattern, "i").test(textForMatching));
        })
        .catch(() => {});
    }
  }
};
</script>

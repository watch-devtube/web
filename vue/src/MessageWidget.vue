<template lang="pug">
delay(:wait="5000")
  .message-widget(v-if="ad")
    .buttons
      a(v-on:click.stop="close"): font-awesome-icon(:icon="['fas', 'times']")
    MagicCircle.magic(:width='60')
      a(:href="'https://devternity.com?utm_source=devtube&utm_medium=popup'")
        img.agent.is-rounded(
          :src="this.ad.pic",
          :alt="this.ad.name + ' avatar'"
        )
    .message
      .content
        p(v-html='ad.message')
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

  .magic {
    position: absolute;
    left: -40px;
    top: 20px;
  }

  .agent {
    width: 60px;
    border: 3px solid #fff;
  }
}
</style>
<script>
import { devternity } from "./api";
import MagicCircle from "./MagicCircle.vue";
import Delay from "./Delay";

export default {
  components: { Delay, MagicCircle },
  props: {
    videoId: { type: String, required: true },
    channel: { type: String, required: true },
    speaker: { type: Array, required: true }
  },
  data: function() {
    return {
      ad: undefined
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
    async fetch() {
      const schedule = await devternity
        .get(`/js/event.js?r=${Math.random()}`)
        .then(({ data }) => data)
        .then(([event]) => event.program[1].schedule);

      const videoAuthor = this.speaker[0].twitter;
      const session =
        schedule.find(({ twitter }) => twitter === videoAuthor) ||
        schedule.find(({ twitter }) => twitter === "unclebobmartin");
      const firstName = session.name.split(" ")[0];
      const ad = {
        pic: `//dossier.glitch.me/avatar/${session.twitter}`,
        name: firstName,
        message: `${session.name} will be speaking at DevTernity this year with a new talk <b>«${session.title}»</b>.<br><br><a class="button is-success" href="https://devternity.com?utm_source=devtube&utm_medium=popup">Join ${firstName}</a>`
      };
      this.ad = ad;
    }
  }
};
</script>

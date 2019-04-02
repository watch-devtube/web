<template lang="pug">
  .parent
    .hearts
      .heart(v-for="heart in hearts" :style="'color: ' + heart.color + '; font-size: ' + heart.font + 'px; animation: ' + heart.ani")
        i.fa.fa-heart
</template>
<style lang="scss">

  .parent {
    position: relative;
  }

  .hearts {
    width: 50px;
    height: 600px;
    position: absolute;
    bottom: 0px;
    right: 0px;
  }

  .heart {
    width: 30px;
    height: 30px;
    opacity: 0;
    position: absolute;
    bottom: 0;
  }

  .heart i {
    position: absolute;
    left: 0;
    top: 0;
    opacity: .9;
  }

  @keyframes flowOne {
    0% {
      opacity: 0;
      bottom: 0;
      left: 14%
    }
    40% {
      opacity: .8;
    }
    50% {
      opacity: 1;
      left: 0;
    }
    60% {
      opacity: .2;
    }
    80% {
      bottom: 80%
    }
    100% {
      opacity: 0;
      bottom: 100%;
      left: 18%
    }
  }
  @keyframes flowTwo {
    0% {
      opacity: 0;
      bottom: 0;
      left: 0;
    }
    40% {
      opacity: .8;
    }
    50% {
      opacity: 1;
      left: 11%
    }
    60% {
      opacity: .2;
    }
    80% {
      bottom: 60%
    }
    100% {
      opacity: 0;
      bottom: 80%;
      left: 0;
    }
  }

  @keyframes flowThree {
    0% {
      opacity: 0;
      bottom: 0;
      left: 0;
    }
    40% {
      opacity: .8;
    }
    50% {
      opacity: 1;
      left: 30%
    }
    60% {
      opacity: .2;
    }
    80% {
      bottom: 70%
    }
    100% {
      opacity: 0;
      bottom: 90%;
      left: 0;
    }
  }
</style>
<script>
  import { firestore, ts } from './helpers/firebase'
  export default {
    props: ['room'],
    created() {
      firestore
        .collection('chat-rooms')
        .doc(this.room)
        .collection('hearts')
        .onSnapshot(hearts => {    
          this.show()
        })
    },
    methods: {
      send() {
        firestore
          .collection('chat-rooms')
          .doc(this.room)
          .collection('hearts')
          .doc('live')
          .set({
            ts: ts
          })
      },
      show() {
        for (var i = 0; i < 5; i++) {

          let any = (arr, len = arr.length + 1) => arr[Math.floor(Math.random() * len)]
          let random = (min, max) => Math.random() * (max - min) + min

          let animations = ["flowOne", "flowTwo", "flowThree"]
          let colors = ["#fce473", "#f68b39", "#ed6c63", "#847bb9", "#97cd76", "#35b1d1"]

          let maxDuration = 1.6
          let minDuration = 1.2
          let duration = random(minDuration, maxDuration).toFixed(1)

          let maxFont = 24
          let minFont = 12
          let font = Math.floor(random(minFont, maxFont))
          let color = any(colors)
          let animation = any(animations)

          this.hearts.push({
            font: font,
            color: color,
            ani: "" + animation + " " + duration + "s linear"
          })
        }
      }
    },
    data() {
      return {
        hearts: []
      }
    }
  }
</script>
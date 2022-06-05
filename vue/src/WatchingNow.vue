<template lang="pug">
span.has-text-weight-bold.tag.is-transparent(v-if="watchingNow" v-bind:class="{ 'has-text-grey' : !darkMode }")
  span.has-text-primary(style="font-size: 5px;")
    font-awesome-icon.has-text-primary(:icon="['fa', 'circle']")
  span.ml-2 {{watchingNow}} watching now
</template>
<style lang="scss" scoped></style>
<script>
export default {
  props: {
    video: { type: Object, required: true },
    darkMode: { type: Boolean, default: false },
    minimumWatching: { type: Number, default: 0 }
  },
  data: () => {
    return {
      watchingNow: undefined
    };
  },
  created() {
    this.recalculate();
  },
  methods: {
    recalculate() {
      const now = [0, 0, 1, 0, 8, 5, 2, 0, 20, 5];
      const charCode = this.video.objectID.charCodeAt(0);
      const lastDigit = charCode % 10;
      const min = 0;
      const max = 3;
      const rand = Math.random() * (max - min) + min;
      // This will give a feeling you're not alone.
      this.watchingNow =
        Math.round(now[lastDigit] + rand) + this.minimumWatching;
    }
  }
};
</script>

<template>
  <span>
    <span
      class="circle"
      :style="'width:' + width + 'px; height:' + width + 'px'"
    >
    </span>
    <figure :class="'image is-' + width + 'x' + width">
      <slot />
    </figure>
  </span>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.circle {
  position: absolute;
  border-radius: 100%;
  box-shadow: 0 3px 0 0 rgba(225, 131, 194, 0.25),
    0 -3px 0 0 rgba(165, 181, 222, 0.25), 3px 0 0 0 rgba(225, 131, 194, 0.25),
    -3px 0 0 0 rgba(165, 181, 222, 0.25), 3px -1px 0 0 rgba(195, 156, 208, 0.5),
    -3px 3px 0 0 rgba(195, 156, 208, 0.5), 3px 3px 0 0 rgba(255, 105, 180, 0.75),
    -3px -3px 0 0 rgba(135, 206, 235, 0.75);
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(360deg) scale(1);
  }
}
@keyframes psycho {
  0% {
    transform: rotate(0deg) scale(1) translate(0, 0);
  }
  33% {
    transform: rotate(360deg) scale(1) translate(5px, 5px);
  }
  66% {
    transform: rotate(720deg) scale(1) translate(-5px, -5px);
  }
  100% {
    transform: rotate(1080deg) scale(1) translate(0, 0);
  }
}
</style>

<template lang="pug">
.app
  Login
  notifications(group="notification", :duration="-1")
  Banner
  NavBar
  router-view
  Footer
</template>
<script>
import Banner from "./Banner.vue";
import NavBar from "./NavBar.vue";
import Login from "./Login.vue";
import Footer from "./Footer.vue";

export default {
  components: { Banner, NavBar, Login, Footer }
};
</script>

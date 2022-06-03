<template lang="pug">
.app
  Login
  notifications(group="notification", :duration="-1")
  NavBar
  router-view
  Footer
</template>
<script>
import NavBar from "./NavBar.vue";
import Login from "./Login.vue";
import Footer from "./Footer.vue";

export default {
  components: { NavBar, Login, Footer }
};
</script>

<template>
  <div class="profile">
    <a class="profile-logout" v-if="user" title="Click to logout" @click.prevent="logout" href="#" v-html="user.email"></a>
    <a class="profile-login" v-if="isLogin" href="/login">Login</a>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.profile {
  float: right;
  margin: 15px 0 -15px 0;
  @media (max-width: $container-width-xs) {
    margin: 5px 0 -5px 0;
  }
}
.profile-avatar {
  width: 32px;
  height: 32px;
}
</style>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      isLogin: false
    }
  },

  computed: {
    user() {
      return this.$store.state.user;
    }
  },

  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("setUser", user);
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    });
  },

  methods: {
    logout() {
      firebase.auth().signOut();
      this.isLogin = true;
      this.$store.dispatch('setUser', false);
    }
  }
};
</script>

<template>
  <div class="auth-container">
    <section id="firebaseui-auth-container"></section>
  </div>
</template>

<style lang="scss">
.auth-container {
  display: inline-block;
}
</style>

<script>
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(getAuth());
    }
    var uiConfig = {
      signInSuccessUrl: "/", // This redirect can be achived by route using callback.
      signInFlow: "popup",
      signInOptions: [GoogleAuthProvider.PROVIDER_ID]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

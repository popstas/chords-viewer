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
import { firebaseConfig } from "~/utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    // FirebaseUI uses the compat SDK, which keeps its own app registry
    // separate from the modular `initializeApp` in ~/utils/firebase, so the
    // compat default app must be initialized here before calling firebase.auth().
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      signInSuccessUrl: "/", // This redirect can be achived by route using callback.
      signInFlow: "popup",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

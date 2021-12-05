<template>
  <div :class="{'container-wrap': true}" :style="{ paddingTop: chordsHeight + 'px' }">
    <el-container>
      <!-- https://github.com/Mango/slideout#user-content-slideoutoptions -->
      <Slideout
        :toggleSelectors="['.menu-toggle']"
        panel="#panel"
        menu="#menu"
        side="left"
        :padding="140"
        :touch="false"
      >
        <div id="panel">
          <el-header height="42px">
            <button class="menu-toggle">☰</button><!-- коммент, чтобы кодировка не переключалась -->
            <button class="input-clear" @click="onInputClear">&cross;</button>
            <button class="input-clear" @click="showQrCode = !showQrCode"><icon name="qrcode"></icon></button>
            <Profile></Profile>
          </el-header>
          <el-main>
            <div class="qrcode-wrapper" v-if="showQrCode">
              <qrcode-drop-zone v-if="isDesktop" @decode="onDecode">
                <div class="drop-area">
                  Drop QR code here
                </div>
              </qrcode-drop-zone>
              <qrcode-stream @decode="onDecode"></qrcode-stream>
            </div>
            <nuxt />
          </el-main>
        </div>
      </Slideout>
    </el-container>
    <nav id="menu">
      <Sidebar></Sidebar>
    </nav>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";
@import "@/assets/dark-theme.scss";

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body {
  overflow-y: scroll;
}
.el-main {
  max-width: 100vw;
  padding: $main-padding !important;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container-wrap {
  margin: 0 auto;
  background: var(--bg);
  position: relative;
  max-width: $container-width-xs;
  @media (min-width: $min-width-sm) {
    max-width: $container-width-sm;
  }
  @media (min-width: $min-width-md) {
    max-width: $container-width-md;
    .song-list {
      max-width: calc(100vw - (100vw - var(--container-width-md)) - (var(--main-padding) * 2));
    }
  }
  @media (min-width: $min-width-lg) {
    max-width: $container-width-lg;
    .song-list {
      max-width: calc(100vw - (100vw - var(--container-width-lg)) - (var(--main-padding) * 2));
    }
  }
}

.qrcode-wrapper {
  height: 80vh;
}
.drop-area {
  height: 300px;
  background: #ccc;
  line-height: 300px;
  text-align: center;
}

.slideout-panel {
  position: relative;
  z-index: 1;
  // will-change: transform; - it breaks position: fixed
  min-height: 100vh;
  background: var(--bg);
  @media (min-width: $container-width-xs) {
    min-width: $container-width-xs;
  }
  @media (min-width: $container-width-sm) {
    min-width: $container-width-sm;
  }
  @media (min-width: $container-width-md) {
    min-width: $container-width-md;
  }
  @media (min-width: $container-width-lg) {
    min-width: $container-width-lg;
  }

  .slideout-open & {
    overflow: hidden;
  }
}

// always open on wide screen
@media (min-width: 1850px) {
  .slideout-panel {
    transform: none !important;
  }

  .slideout-menu {
    display: block !important;
    left: 0 !important;
    position: fixed !important;
  }

  .el-header .menu-toggle {
    display: none;
  }
}

.el-header {
  padding: 0 5px !important;
  .menu-toggle,
  .input-clear {
    background: none;
    border: none;
    line-height: 42px;
    outline: none;
    cursor: pointer;
  }

  button {
    color: var(--link);
    &:hover {
      color: var(--link-hover);
    }
  }
}
.slideout-menu {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 140px;
  height: 100vh;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;

  &-left {
    left: 0;
  }
  &-right {
    right: 0;
  }

  .slideout-open & {
    display: block;
  }
}

input {
  background-color: var(--bg-hover);
}

.dark-mode {
  .el-popover {
    background: #fff;
    color: #303133;
  }

  .el-divider {
    background-color: var(--link-disabled);
  }
}
/* .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #84a1bd !important;
  border-color: #84a1bd !important;
} */
</style>

<script>
import Profile from "~/components/Profile";
import Sidebar from "~/components/Sidebar";
import Slideout from "vue-slideout";
import "vue-awesome/icons/qrcode";
import Icon from "vue-awesome/components/Icon";

import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAi6BptwN63ruuHJiTmm_ofYUyquAaPf9U",
  authDomain: "chords-viewer.firebaseapp.com",
  databaseURL: "https://chords-viewer.firebaseio.com",
  projectId: "chords-viewer",
  storageBucket: "chords-viewer.appspot.com",
  messagingSenderId: "98010485379",
  appId: "1:98010485379:web:bf6700c3e06ba149ce81b6",
  measurementId: "G-YYGZ8HR9JB"
};
firebase.initializeApp(firebaseConfig);

export default {
  components: { Slideout, Sidebar, Profile },
  data() {
    return {
      chordsHeight: 0,
      showQrCode: false,
    };
  },

  computed: {
    title() {
      const t = [];
      if (this.$store.state.activeSong.title) t.push(this.$store.state.activeSong.title);
      t.push(this.$store.state.name);
      return t.join(' - ');
    },
    isDesktop() {
      return window.innerWidth > 768;
    },
  },

  methods: {
    handleScroll() {
      const chords = this.$el.querySelector(".song-item.active .chords");
      if (!chords) return;
      this.chordsHeight = chords.clientHeight;
    },

    onInputClear() {
      const options = { name: "q", value: "" };
      this.$store.dispatch("changeFilter", options);
      const input = this.$el.querySelector(".search-input input");
      input.value = "";
      // this.$store.dispatch("filterSongs");
    },

    onDecode(url) {
      this.showQrCode = false;
      this.$store.dispatch('changeSong', url);
    },
  },

  head() {
    return {
      title: this.title,
      bodyAttrs: {
        class: this.$store.state.darkMode ? 'dark-mode' : ''
      },
      link: [
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          sizes: "180x180",
          href: "/apple-touch-icon.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png"
        }
      ]
    };
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);

    console.log('this.$store.state.darkMode: ', this.$store.state.darkMode);
    if (this.$store.state.darkMode === undefined) {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.$store.commit('darkMode', isDark);
    }
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

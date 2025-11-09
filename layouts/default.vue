<template>
  <div :class="{'container-wrap': true}" :style="{ paddingTop: chordsHeight + 'px' }">
    <el-container>
      <el-drawer
        v-model="drawerVisible"
        direction="ltr"
        :with-header="false"
        size="140px"
        :show-close="false"
        class="slideout-panel"
      >
        <Sidebar />
      </el-drawer>
      <div id="panel">
        <el-header height="42px">
          <button class="menu-toggle" @click="drawerVisible = true">☰</button>
          <button class="input-clear" @click="onInputClear">&cross;</button>
          <button class="input-clear" @click="showQrCode = !showQrCode">
            <font-awesome-icon :icon="['fas', 'qrcode']"></font-awesome-icon>
          </button>
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
          <nuxt/>
        </el-main>
      </div>
    </el-container>
    <!-- Sidebar always visible on wide screens -->
    <nav id="menu" class="slideout-menu slideout-menu-left">
      <Sidebar />
    </nav>
  </div>
</template>

<style lang="scss">
@use "@/assets/variables.scss" as *;
@use "@/assets/dark-theme.scss" as *;

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
  overflow-y: auto;
}

.el-main {
  max-width: 100vw;
  padding: $main-padding !important;
  @media (max-width: $container-width-xs) {
    width: 100vw;
  }
}

textarea {
  background: var(--bg-hover);
  color: var(--color);
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
  @media (min-width: $min-width-xl) {
    max-width: $container-width-xl;
    .song-list {
      max-width: calc(100vw - (100vw - var(--container-width-xl)) - (var(--main-padding) * 2));
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
  @media (min-width: $container-width-xl) {
    min-width: $container-width-xl;
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
// font-awesome icons are registered globally via plugin

import { initializeApp } from "firebase/app";

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
initializeApp(firebaseConfig);

export default {
  components: { Profile, Sidebar },
  data() {
    return {
      drawerVisible: false,
      showQrCode: false,
      chordsHeight: 0,
      isDesktop: false,
    };
  },
  mounted() {
    this.isDesktop = window.innerWidth > 1024;
  },
  methods: {
    onInputClear() {
      const options = {name: "q", value: ""};
      this.$store.dispatch("changeFilter", options);
      const input = this.$el.querySelector(".search-input input");
      if (input) input.value = "";
    },
    onDecode(url) {
      try {
        const res = url.match(/song_num=(\d+)/);
        if (res) {
          const song_num = parseInt(res[1]);
          const song = this.$store.state.songs[song_num];
          if (song) this.$store.dispatch('changeSong', song.url);
        }
      } catch (e) {
        console.log('unknown qrcode format: ');
        console.log('e: ', e);
        return;
      }
      this.showQrCode = false;
    },
  },
  head() {
    return {
      title: this.title,
      bodyAttrs: {
        class: this.$store.state.darkMode ? 'dark-mode' : ''
      },
      link: [
        {rel: "manifest", href: "/site.webmanifest"},
        {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"},
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
    if (this.$store.state.darkMode === undefined) {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.$store.commit('darkMode', isDark);
    }
  },
};
</script>

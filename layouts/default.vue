<template>
  <div :class="{'container-wrap': true, 'slideout-open': menuOpen}" :style="{ paddingTop: chordsHeight + 'px' }">
    <nav id="menu" class="slideout-menu slideout-menu-left">
      <Sidebar></Sidebar>
    </nav>
    <el-container>
      <div id="panel" class="slideout-panel" @click="onPanelClick">
        <!-- коммент, чтобы кодировка не переключалась -->
        <el-header height="42px">
          <button class="menu-toggle" @click.stop="menuOpen = !menuOpen">☰</button>
          <button class="input-clear" @click="onInputClear">&cross;</button>
          <button class="input-clear" @click="showQrCode = !showQrCode">
            <icon name="qrcode"></icon>
          </button>
          <Profile></Profile>
        </el-header>
        <el-main>
          <div class="qrcode-wrapper" v-if="showQrCode">
            <qrcode-drop-zone v-if="isDesktop" @detect="onDetect">
              <div class="drop-area">
                Drop QR code here
              </div>
            </qrcode-drop-zone>
            <qrcode-stream @detect="onDetect"></qrcode-stream>
          </div>
          <slot/>
        </el-main>
      </div>
    </el-container>
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
  transition: transform 0.3s ease;

  .slideout-open & {
    transform: translateX(140px);
  }
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

// Global: active radio buttons (sort name/shows/count/rate, instrument G/U/P,
// font size, etc.) highlight with border + text only, no filled background.
// The selector mirrors Element Plus' own active-fill rule but adds .el-radio-group
// so it out-specifies it (0,6,0 > 0,5,0).
.el-radio-group .el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner {
  background-color: transparent;
  color: var(--border-hover);
  border-color: var(--border-hover);
  box-shadow: -1px 0 0 0 var(--border-hover);
}
</style>

<script>
import Profile from "~/components/Profile";
import Sidebar from "~/components/Sidebar";
import { useAppStore } from "~/stores/app";
import "~/utils/firebase"; // initialize firebase app

export default {
  components: {Sidebar, Profile},

  setup() {
    const store = useAppStore();
    useHead(() => ({
      title: store.activeSong && store.activeSong.title
        ? `${store.activeSong.title} - ${store.name}`
        : store.name,
      bodyAttrs: {
        class: store.darkMode ? 'dark-mode' : '',
      },
      link: [
        {rel: "manifest", href: "/site.webmanifest"},
        {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"},
        {rel: "apple-touch-icon", type: "image/png", sizes: "180x180", href: "/apple-touch-icon.png"},
        {rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png"},
        {rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png"},
      ],
    }));
    return {};
  },

  data() {
    return {
      chordsHeight: 0,
      showQrCode: false,
      menuOpen: false,
    };
  },

  computed: {
    isDesktop() {
      return window.innerWidth > 768;
    },
  },

  methods: {
    onPanelClick() {
      if (this.menuOpen) this.menuOpen = false;
    },
    // handleScroll() {
    //   const chords = this.$el.querySelector(".song-item.active .chords");
    //   if (!chords) return;
    //   this.chordsHeight = chords.clientHeight;
    // },

    onInputClear() {
      const options = {name: "q", value: ""};
      this.$store.dispatch("changeFilter", options);
      const input = this.$el.querySelector(".search-input input");
      if (input) input.value = "";
      // this.$store.dispatch("filterSongs");
    },

    // vue-qrcode-reader v4: @detect emits an array of detected codes
    onDetect(detected) {
      try {
        const codes = Array.isArray(detected) ? detected : [detected];
        const url = codes[0] && (codes[0].rawValue || codes[0].content || codes[0]);
        if (!url) return;
        const res = String(url).match(/song_num=(\d+)/);
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

  created() {
    if (this.$store.state.darkMode === undefined) {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.$store.commit('darkMode', isDark);
    }
  },
};
</script>

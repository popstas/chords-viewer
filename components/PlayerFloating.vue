<template>
  <div :class="{toolbar: true, toolbar_fixed: true, toolbar_hidden: toolbarHidden}">
    <div class="toolbar-body">
      <div class="toolbar__current-song">
        <el-button class="toolbar__up" @click="toTop">
          <icon name="chevron-up"></icon>
        </el-button>
        <el-button class="toolbar__hide" @click="hideToolbar">
          <icon name="chevron-down"></icon>
        </el-button>
        <button @click="$emit('scrollToLast')">{{ $store.getters.activeSongTitle }}</button>

        <div @click="showQrCode = !showQrCode" class="toolbar__qrcode" v-if="showQrCode">
          <qr-code :size="340" :text="$store.state.activeSong.url"></qr-code>
        </div>
        <a v-if="$store.getters.activeSongTitle && !showQrCode" class="toolbar__qrcode-link" @click.prevent="showQrCode = !showQrCode">
          <icon name="qrcode"></icon>
        </a>
      </div>

      <div class="toolbar__filters">
        <!-- <el-button icon="el-icon-close" class="hidden-xs-only" size="mini" circle @click="toolbarHidden = true"></el-button> -->
        <el-row class="toolbar__controls" :gutter="20">
          <el-col :span="6" class="toolbar__autoscroll">
            <el-slider v-model="autoScrollSpeed" :min="1" :max="6"></el-slider>
          </el-col>
          <el-col :span="4">
            <el-button :disabled="playlistCurrent <= 0" class="toolbar__prev" @click="prevSong">
              <icon name="backward"></icon>
            </el-button>
            <input
              type="hidden"
              v-shortkey="{k:['k'], kRus: ['л'], left: ['arrowleft']}"
              @shortkey="prevSong"
            >
          </el-col>
          <el-col :span="4">
            <el-checkbox-button class="toolbar__play" v-model="autoScroll">
              <icon :name="autoScroll ? 'pause' : 'play'"></icon>
            </el-checkbox-button>
            <input type="hidden" v-shortkey="['space']" @shortkey="autoScroll = !autoScroll">
          </el-col>
          <el-col :span="4">
            <el-button class="toolbar__next" @click="nextSong">
              <icon name="forward"></icon>
            </el-button>
            <input
              type="hidden"
              v-shortkey="{j:['j'], jRus: ['о'], right: ['arrowright']}"
              @shortkey="nextSong"
            >
          </el-col>
          <el-col :span="7" class="toolbar__instrument">
            <el-radio-group v-model="instrument" size="mini">
              <el-radio-button title="guitar" label="guitar">G</el-radio-button>
              <el-radio-button title="ukulele" label="ukulele">U</el-radio-button>
              <el-radio-button title="piano" label="piano">P</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.toolbar {
  background: var(--bg);
  text-align: center;
  margin: 0 auto;
  max-width: $container-width-xs;
  @media (min-width: $container-width-sm) {
    max-width: $container-width-sm;
  }
  @media (min-width: $container-width-md) {
    max-width: $container-width-md;
  }
  @media (min-width: $container-width-lg) {
    max-width: $container-width-lg;
  }

  &__up, &__hide {
    display: none !important;
  }

  &__qrcode {
    text-align: center;

    > div {
      display: inline-block !important;
      padding: 5px;
      background: #fff;
    }
  }
  &__qrcode-link {
    float: right;
    padding: 10px;
    color: var(--link);
  }

  &__artists-counter {
    width: 40px;
    text-align: right;
    float: right;
    color: #8492a6;
    font-size: 13px;

    &_active {
      color: #ccc;
    }
  }

  &_fixed {
    .toolbar-spacer {
      height: 212px;
    }
    .toolbar-body {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      padding: 5px;
      box-shadow: 0 0 1px #ccc;
      background: rgba(0,0,0,0.2);

      .toolbar__up {
        display: block !important;
        float: left;
        margin-left: 7px;
      }
      .toolbar__hide {
        display: block !important;
        float: left;
        margin-left: 0px;
      }

      .search-letters {
        display: none;
      }

      .search-genres {
        display: none;
      }

      .search-artists {
        display: none;
      }

      .search-artists-sort {
        display: none;
      }

      .toolbar__search {
        display: none;
      }

    }
  }

  &_hidden .toolbar-body{
    display: none;
  }

  // switches
  .el-switch {
    margin: 15px 15px 15px 0;
  }

  &__controls {
    display: flex;
    align-items: center;
    margin-left: -5px !important;
    margin-right: -5px !important;

    > .el-col:first-child {
      padding-left: 0 !important;
    }

    // autoscroll speed
    .el-slider {
      margin: 0 8px;
    }
  }

  &__autoscroll {
    @media (min-width: 1200px) {
      visibility: hidden;
    }
  }

  // search letters
  .search-letters {
    list-style: none;
    padding: 0;

    &__letter {
      padding: 0;
      display: inline-block;
      font-size: 13px;
      min-width: 23px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      margin: 0;

      &.active {
        color: #409eff;
      }
    }
  }

  // search genres
  .search-genres {
    list-style: none;
    padding: 0;
    margin-bottom: 8px;

    &__genre {
      padding: 0 5px;
      display: inline-block;
      font-size: 13px;
      min-width: 23px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      margin: 0;

      &.active {
        color: #409eff;
      }
    }
  }

  .search-artists {
    margin-bottom: 15px;
    margin-right: 0; // for 3rd button "count"

    $input-height: 30px;
    .el-input__icon, input {
      line-height: $input-height;
      height: $input-height;
    }

    &-sort {
      margin-bottom: 3px;

      .el-radio-button__inner {
        padding: 7px 10px;
      }
    }
  }

  // close button
  .el-button,
  .el-checkbox-button__inner {
    border: none !important;
    border-radius: 4px !important;
    background: none !important;
    color: var(--link) !important;
    &:disabled {
      color: var(--bg-hover) !important;
    }
    padding: 7px;
    // float: right;
  }

  // font size radiobuttons
  &__instrument {
    text-align: right;
    padding: 0 5px !important;

    .el-radio-button__inner {
      @media (max-width: 800px) {
        padding: 7px 8px !important;
      }
    }
  }

  // current song breadcrumbs
  &__current-song {
    button {
      padding: 10px;
      border: none;
      background: none;
      cursor: pointer;
      outline: none;
      color: var(--color);
    }
  }
}
</style>

<script>
import SearchInput from "~/components/SearchInput";
import _ from "lodash";
import "vue-awesome/icons/play";
import "vue-awesome/icons/pause";
import "vue-awesome/icons/backward";
import "vue-awesome/icons/forward";
import "vue-awesome/icons/chevron-up";
import "vue-awesome/icons/chevron-down";
import Icon from "vue-awesome/components/Icon";

const speedMapping = {
  1: 1024,
  2: 512,
  3: 256,
  4: 128,
  5: 64,
  6: 32
};
const speedMapping2 = {
  1: 8000,
  2: 5000,
  3: 3000,
  4: 2000,
  5: 1000,
  6: 700
};

export default {
  components: {
    SearchInput
  },

  data() {
    return {
      autoScroll: false,
      scrollInterval: false,

      toolbarFixed: false,
      lastScrollTop: 0,

      artist: "",

      showQrCode: false,
    };
  },

  computed: {
    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    },

    artistsSort: {
      get() {
        return this.$store.state.artistsSort;
      },
      set(val) {
        this.$store.commit("artistsSort", val);
        this.buildArtists();
      }
    },

    q: {
      get() {
        return this.$store.state.filter.q;
      },
      set(val) {
        this.changeFilter("q", val);
      }
    },

    autoScrollSpeed: {
      get() {
        return this.$store.state.autoScrollSpeed;
      },
      set(val) {
        this.$store.commit("autoScrollSpeed", val);
      }
    },

    instrument: {
      get() {
        return this.$store.state.instrument;
      },
      set(val) {
        this.$store.commit("instrument", val);
      }
    },

    playlistCurrent() {
      return this.$store.state.playlistCurrent;
    }
  },

  watch: {
    autoScroll(val) {
      this.$store.commit("setToolbarHidden", val);
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    },

    artist(val) {
      this.q = '^' + val;
    }
  },

  methods: {
    shortkey(opts) {
      console.log("opts: ", opts);
    },

    changeFilter(name, value) {
      this.$store.dispatch("changeFilter", { name, value });
      // this.$emit("changeFilter", { name, value });
    },

    changeAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      if (this.autoScroll) {
        this.scrollInterval = setInterval(() => {
          window.scrollBy({
            left: 0,
            top: 20,
            behavior : 'smooth',
          });
        }, speedMapping2[this.autoScrollSpeed]);
      }
    },

    handleScroll(event) {
      const el = event.target;
      const scrollY = el.scrollY || el.scrollTop;
      const delta = scrollY - this.lastScrollTop;
      this.lastScrollTop = scrollY;
      this.toolbarFixed = scrollY > 0;

      if (scrollY === 0) {
        this.autoScroll = false;
      }

      // console.log('window.scrollY:', window.scrollY);
      // console.log('delta:', delta);
      if (delta == 1) {
        return; // ignore autoscroll
      }

      // too fast for human
      if (Math.abs(delta) > 20) {
        return;
      }

      if (delta < 0) {
        this.$store.commit("setToolbarHidden", false);
      }
      if (delta > 1 && this.toolbarFixed) {
        this.$store.commit("setToolbarHidden", true);
      }

      // stop when 2+ columns
      if(this.$el.parentElement?.offsetWidth > 1200) {
        this.autoScroll = false;
      }
    },

    hideToolbar() {
      this.$store.commit("setToolbarHidden", true);
    },

    prevSong() {
      this.$store.dispatch("setPrevSong");
    },

    nextSong() {
      this.$store.dispatch("setNextSong");
    },

    toTop() {
      window.scrollTo(0, 0);
    }
  },

  created() {
    setTimeout(() => {
      const scroller = document.querySelector(".vue-recycle-scroller");
      if (scroller) scroller.addEventListener("scroll", this.handleScroll);
      else window.addEventListener("scroll", this.handleScroll);
    }, 500);
    this.q = this.$store.state.filter.q;
    this.fontSize = this.$store.state.fontSize;
  },

  destroyed() {
    const scroller = document.querySelector(".vue-recycle-scroller");
    if (scroller) scroller.removeEventListener("scroll", this.handleScroll);
    else window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.scrollInterval);
  }
};
</script>

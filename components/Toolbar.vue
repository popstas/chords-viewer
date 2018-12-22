<template>
  <div :class="{toolbar: true, toolbar_fixed: toolbarFixed, toolbar_hidden: toolbarHidden}">
    <SearchInput class="toolbar__search" v-model="q"></SearchInput>

    <div class="toolbar__current-song">
      <button @click="$emit('scrollToLast')">{{ $store.getters.activeSongTitle }}</button>
    </div>

    <div class="toolbar__filters">
      <!-- <el-button icon="el-icon-close" class="hidden-xs-only" size="mini" circle @click="toolbarHidden = true"></el-button> -->
      <el-row class="toolbar__autoscroll" :gutter="20">
        <el-col :span="6">
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
        <el-col :span="6" class="toolbar__font-size">
          <el-radio-group v-model="fontSize" size="mini" @change="changeFontSize">
            <el-radio-button label="1"></el-radio-button>
            <el-radio-button label="2"></el-radio-button>
            <el-radio-button label="3"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>

    <ul class="toolbar__search-letters search-letters">
      <li
        :class="{'search-letters__letter': true, active: q == '^' + letter}"
        v-for="letter in letters"
        :key="letter"
        @click="q = '^' + letter"
      >{{ letter }}</li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.toolbar {
  background: #fff;
  text-align: center;
  margin: 0 auto;
  max-width: $container-width;
  @media (min-width: 1400px) {
    max-width: $container-width-wide;
  }

  &_fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px;
    box-shadow: 0 0 1px #ccc;

    .search-letters {
      display: none;
    }

    .toolbar__search {
      display: none;
    }
  }

  &_hidden {
    display: none;
  }

  // switches
  .el-switch {
    margin: 15px 15px 15px 0;
  }

  &__autoscroll {
    display: flex;
    align-items: center;
    margin-left: -5px !important;
    margin-right: -5px !important;

    // autoscroll speed
    .el-slider {
      margin: 0 8px;
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

  // close button
  .el-button,
  .el-checkbox-button__inner {
    border: none !important;
    border-radius: 4px !important;
    background: none !important;
    color: #999 !important;
    &:disabled {
      color: #eee !important;
    }
    padding: 7px;
    // float: right;
  }

  // font size radiobuttons
  &__font-size {
    text-align: right;

    .el-radio-button__inner {
      @media (max-width: 800px) {
        padding: 7px 8px;
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
      color: #666;
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
import Icon from "vue-awesome/components/Icon";

const speedMapping = {
  1: 1024,
  2: 512,
  3: 256,
  4: 128,
  5: 64,
  6: 32
};

export default {
  components: {
    SearchInput
  },

  data() {
    return {
      autoScroll: false,
      autoScrollSpeed: 4,
      scrollInterval: false,
      fontSize: 1,

      toolbarFixed: false,
      lastScrollTop: 0,

      q: ""
    };
  },

  computed: {
    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    },

    playlistCurrent() {
      return this.$store.state.playlistCurrent;
    }
  },

  watch: {
    q(val) {
      this.changeFilter("q", val);
    },

    autoScroll(val) {
      this.$store.commit("setToolbarHidden", val);
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    }
  },

  methods: {
    shortkey(opts) {
      console.log("opts: ", opts);
    },

    changeFilter(name, value) {
      this.$store.commit("changeFilter", { name, value });
      this.$emit("changeFilter", { name, value });
    },

    changeAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      if (this.autoScroll) {
        this.scrollInterval = setInterval(() => {
          window.scrollBy(0, 1);
        }, speedMapping[this.autoScrollSpeed]);
      }
    },

    handleScroll(event) {
      const delta = window.scrollY - this.lastScrollTop;
      this.lastScrollTop = window.scrollY;
      this.toolbarFixed = window.scrollY > 0;

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
    },

    buildLetters() {
      let letters = this.$store.state.songs.map(song => {
        return song.title[0];
      });
      letters.sort();
      letters = letters.filter((letter, pos, arr) => {
        return arr.indexOf(letter) == pos;
      });
      this.letters = letters;
    },

    prevSong() {
      this.$store.dispatch("setPrevSong");
    },

    nextSong() {
      this.$store.dispatch("setNextSong");
    },

    changeFontSize(size) {
      this.$store.commit("fontSize", size);
    }
  },

  created() {
    this.buildLetters();
    window.addEventListener("scroll", this.handleScroll);
    this.q = this.$store.state.filter.q;
    this.fontSize = this.$store.state.fontSize;
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.scrollInterval);
  }
};
</script>

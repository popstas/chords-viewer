<template>
  <div :class="{toolbar: true, toolbar_fixed: toolbarFixed, toolbar_hidden: toolbarHidden}">
    <SearchInput v-model="q"></SearchInput>

    <div class="toolbar__filters">
      <el-button icon="el-icon-close" class="hidden-xs-only" size="mini" circle @click="toolbarHidden = true"></el-button>

      <el-row class="toolbar__autoscroll" :gutter="20">
        <el-col :span="8">
          <el-switch v-model="autoScroll" active-text="autoscroll"></el-switch>
        </el-col>
        <el-col :span="16">
          <el-slider v-model="autoScrollSpeed" :min="1" :max="6"></el-slider>
        </el-col>
      </el-row>
    </div>

    <ul class="toolbar__search-letters search-letters">
      <li
        :class="{'search-letters__letter': true, active: q == '^' + letter}"
        v-for="letter in letters" :key="letter"
        @click="q = '^' + letter"
      >{{ letter }}</li>
    </ul>
  </div>
</template>

<style lang="scss">
$max_width: 640px;

.toolbar {
  background: #fff;
  text-align: center;
  margin: 0 auto;
  max-width: $max_width;

  &_fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 5px;
    box-shadow: 0 0 1px #ccc;

    .search-letters {
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
  .el-button {
    border: none;
    padding: 7px;
    float: right;
  }
}
</style>

<script>
import SearchInput from "~/components/SearchInput";

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

      toolbarFixed: false,
      toolbarHidden: false,
      lastScrollTop: 0,

      q: "",
    };
  },

  computed: {},

  watch: {
    q(val) {
      this.changeFilter("q", val);
    },

    autoScroll() {
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    },
  },

  methods: {
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
        this.toolbarHidden = false;
      }
      if (delta > 1 && this.toolbarFixed) {
        this.toolbarHidden = true;
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
    }
  },

  created() {
    this.buildLetters();
    window.addEventListener("scroll", this.handleScroll);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.scrollInterval);
  }
};
</script>

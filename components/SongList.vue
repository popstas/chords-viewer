<template>
  <div>
    <div :class="{toolbar: true, toolbar__fixed: toolbarFixed, toolbar__hidden: toolbarHidden}">
      <SearchInput v-model="q"></SearchInput>

      <div class="toolbar-filters">
        <el-switch v-model="withChords" active-text="chords"></el-switch>
        <el-switch v-model="withTexts" class="hidden-xs-only" active-text="texts"></el-switch>
        <el-switch v-model="sortByDate" active-text="by date"></el-switch>
        <el-switch v-model="noSleep" active-text="no sleep"></el-switch>
        <el-button icon="el-icon-close" class="hidden-xs-only" size="mini" circle @click="toolbarHidden = true"></el-button>

        <el-row class="toolbar-autoscroll" :gutter="20">
          <el-col :span="8">
            <el-switch v-model="autoScroll" active-text="autoscroll"></el-switch>
          </el-col>
          <el-col :span="16">
            <el-slider v-model="autoScrollSpeed" :min="1" :max="6"></el-slider>
          </el-col>
        </el-row>
      </div>

      <ul class="search-letters">
        <li
          :class="{'search-letter': true, active: q == '^' + letter}"
          v-for="letter in letters" :key="letter"
          @click="q = '^' + letter"
        >{{ letter }}</li>
      </ul>
    </div>

    <div class="search-total">total: {{ count }}, updated: {{ lastUpdated }}</div>
    <el-collapse accordion @change="changeSong">
      <SongItem v-for="song in filteredSongs" :song="song" :key="song.url" :active="song.url == activeSong.url" @active="scrollTo"></SongItem>
    </el-collapse>
  </div>
</template>

<style lang="scss">
$max_width: 640px;

.el-container {
  margin: 0 auto;
  max-width: $max_width;
}

.toolbar {
  background: #fff;
  text-align: center;
  margin: 0 auto;
  max-width: $max_width;

  &__fixed {
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

  &__hidden {
    display: none;
  }

  // switches
  .el-switch {
    margin: 15px 15px 15px 0;
  }

  &-autoscroll {
    display: flex;
    align-items: center;

    // autoscroll speed
    .el-slider {
      margin: 0 8px;
    }
  }

  // search letters
  .search-letters {
    list-style: none;
    padding: 0;

    li {
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
import SongItem from "~/components/SongItem";
import songs from "~/chords.json";
import NoSleep from "nosleep.js";
import dateformat from "dateformat";

const nosleep = new NoSleep();

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
    SongItem,
    SearchInput
  },

  data() {
    return {
      q: "",
      withChords: false,
      withTexts: false,
      sortByDate: false,
      autoScroll: false,
      autoScrollSpeed: 4,
      scrollInterval: false,
      filteredSongs: [],
      toolbarFixed: false,
      toolbarHidden: false,
      lastScrollTop: 0,
      activeSong: {},
      noSleep: false
    };
  },

  computed: {
    count() {
      return this.filteredSongs.length;
    },

    lastUpdated() {
      let date = Math.max.apply(
        Math,
        songs.map(song => new Date(song.created))
      );
      return dateformat(new Date(date), "dd.mm.yyyy");
    }
  },

  watch: {
    q() {
      this.filterSongs();
    },

    withChords() {
      this.filterSongs();
    },

    withTexts() {
      this.filterSongs();
    },

    sortByDate() {
      this.filterSongs();
    },

    autoScroll() {
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    },

    noSleep(val) {
      val ? nosleep.enable() : nosleep.disable();
    }
  },

  methods: {
    sortSongs(result) {
      if (this.sortByDate) {
        result = result
          .slice()
          .sort((a, b) => new Date(b.created) - new Date(a.created));
      }
      return result;
    },

    filterSongs() {
      const q = this.q.toLowerCase();
      let result = songs;

      if (q) {
        let isLetter = q.match(/\^.$/);
        result = result.filter(song => {
          return (
            song.title.toLowerCase().search(q) >= 0 ||
            (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
          );
        });
      }

      if (this.withChords) {
        result = result.filter(song => song.details.chords);
      }

      if (this.withTexts) {
        result = result.filter(song => song.text);
      }

      result = this.sortSongs(result);
      this.filteredSongs = result;
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

    changeSong(activeName) {
      // console.log(activeName);
      this.activeSong = songs.find(song => song.url == activeName) || {};
    },

    scrollTo(offset) {
      // console.log('scrollTo', offset);
      // window.scrollTo(0, offset);
    },

    buildLetters() {
      let letters = songs.map(song => {
        return song.title[0];
      });
      letters.sort();
      letters = letters.filter((letter, pos, arr) => {
        return arr.indexOf(letter) == pos;
      });
      this.letters = letters;
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
    }
  },

  created() {
    this.filterSongs();
    this.buildLetters();
    window.addEventListener("scroll", this.handleScroll);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.scrollInterval);
  }
};
</script>

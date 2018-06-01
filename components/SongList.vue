<template>
  <div>
    <div :class="{toolbar: true, toolbar__fixed: toolbarFixed, toolbar__hidden: toolbarHidden}">
      <SearchInput v-model="q"></SearchInput>
      <el-switch v-model="withChords" active-text="chords"></el-switch>
      <el-switch v-model="withTexts" active-text="texts"></el-switch>
      <el-switch v-model="autoScroll" active-text="autoscroll"></el-switch>
      <el-button icon="el-icon-close" class="hidden-xs-only" size="mini" circle @click="toolbarHidden = true"></el-button>
      <el-slider v-model="autoScrollDelay" :min="1" :max="10"></el-slider>
      <ul class="search-letters">
        <li
          :class="{'search-letter': true, active: q == '^' + letter}"
          v-for="letter in letters" :key="letter"
          @click="q = '^' + letter"
        >{{ letter }}</li>
      </ul>
    </div>
    <div class="search-total">total: {{ count }}</div>
    <el-collapse accordion>
      <SongItem v-for="song in filteredSongs" :song="song" :key="song.url"></SongItem>
    </el-collapse>
  </div>
</template>

<style>
.el-container,
.toolbar {
  margin: 0 auto;
  max-width: 640px;
}
.el-switch {
  margin: 15px 15px 15px 0;
}
.el-slider {
  margin: 0 8px;
}
.el-button {
  border: none;
  padding: 7px;
  float: right;
}
.toolbar {
  background: #fff;
  text-align: center;
}
.toolbar__fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 5px;
}
.toolbar__fixed .search-letters {
  display: none;
}
.toolbar__hidden {
  display: none;
}
.search-letters {
  list-style: none;
  padding: 0;
}
.search-letters li {
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
}
.search-letters li.active {
  color: #409eff;
}
</style>

<script>
import SearchInput from "~/components/SearchInput";
import SongItem from "~/components/SongItem";
import songs from "~/chords.json";

const speedMapping = {
  1: 1000,
  2: 500,
  3: 400,
  4: 300,
  5: 200,
  6: 100,
  7: 90,
  8: 80,
  9: 70,
  10: 50
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
      autoScroll: false,
      autoScrollDelay: 5,
      scrollInterval: false,
      filteredSongs: [],
      toolbarFixed: false,
      toolbarHidden: false,
      lastScrollTop: 0
    };
  },

  /* async asyncData({app, store, params, query, error}) {
    let asyncData;
    try {
      asyncData = {
        songs: await app.$axios.$get('http://test.home.popstas.ru/chords.json'),
      };
      // store.commit('songs', asyncData.songs);
    }
    catch (e) {
      console.log('error while get data');
      throw Error(e)
    }
    console.log('got songs');
    return asyncData;
  }, */

  computed: {
    count() {
      return this.filteredSongs.length;
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

    autoScroll() {
      this.changeAutoScroll();
    },

    autoScrollDelay() {
      this.changeAutoScroll();
    }
  },

  methods: {
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

      this.filteredSongs = result;
    },

    changeAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      if (this.autoScroll) {
        this.scrollInterval = setInterval(() => {
          window.scrollBy(0, 1);
        }, speedMapping[this.autoScrollDelay]);
      }
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

      if (delta == 1) {
        return; // ignore autoscroll
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

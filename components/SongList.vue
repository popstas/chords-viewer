<template>
  <div>
    <div :class="{toolbar: true, toolbar__fixed: toolbarFixed, toolbar__hidden: toolbarHidden}">
      <SearchInput v-model="q"></SearchInput>
      <el-switch v-model="withChords" active-text="chords"></el-switch>
      <el-switch v-model="withTexts" active-text="texts"></el-switch>
      <el-switch v-model="autoScroll" active-text="autoscroll"></el-switch>
    </div>
    <div class="search-total">total: {{ count }}</div>
    <el-collapse accordion>
      <SongItem v-for="song in filteredSongs" :song="song" :key="song.url"></SongItem>
    </el-collapse>
  </div>
</template>

<style>
.el-switch {
  margin: 15px 15px 15px 0;
}
.toolbar {
  background: #fff;
}
.toolbar__fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 5px;
}
.toolbar__hidden {
  display: none;
}
</style>

<script>
import SearchInput from "~/components/SearchInput";
import SongItem from "~/components/SongItem";
import songs from "~/chords.json";
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
      console.log("count");
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
    }
  },
  methods: {
    filterSongs() {
      const q = this.q.toLowerCase();
      let result = songs;
      if (q) {
        result = result.filter(song => {
          return (
            song.title.toLowerCase().search(q) >= 0 ||
            (song.text && song.text.toLowerCase().search(q) >= 0)
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
        }, 300);
      }
    },
    handleScroll(event) {
      let delta = window.scrollY - this.lastScrollTop;
      this.lastScrollTop = window.scrollY;
      this.toolbarFixed = window.scrollY > 90;
      if (delta == 1) {
        return; // ignore autoscroll
      }
      this.toolbarHidden = this.toolbarFixed && delta > 0;
    }
  },
  created() {
    this.filterSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

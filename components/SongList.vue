<template>
  <div>
    <div class="search-total">total: {{ count }}</div>
    <Toolbar @changeFilter="$store.dispatch('filterSongs')"></Toolbar>
    <el-collapse accordion @change="changeSong" :value="activeSong.url">
      <SongItem v-for="song in filteredSongs" :song="song" :key="song.url" :active="song.url == activeSong.url" @active="scrollTo"></SongItem>
    </el-collapse>
  </div>
</template>

<style lang="scss">
</style>

<script>
import SongItem from '~/components/SongItem';
import Toolbar from '~/components/Toolbar';
// import mapState from "vuex";

export default {
  components: {
    SongItem,
    Toolbar
  },

  computed: {
    filter() {
      return this.$store.state.filter;
    },
    filteredSongs() {
      return this.$store.state.filteredSongs;
    },
    activeSong() {
      return this.$store.state.activeSong;
    },
    songs() {
      return this.$store.state.songs;
    },

    count() {
      return this.$store.state.filteredSongs.length;
    }
    //...mapState(['songs', 'activeSong']) // TODO
  },

  watch: {
    // open single filtered chords
    filteredSongs(val) {
      if (val.length == 1) {
        this.changeSong(val[0].url);
      }
    }
  },

  methods: {
    changeSong(activeName) {
      let activeSong = this.songs.find(song => song.url == activeName) || {};
      this.$store.commit('activeSong', activeSong);
    },

    scrollTo(offset) {
      const fixedTopOffset = 100;
      window.scrollTo(0, offset - fixedTopOffset);
    }
  },
  created() {
    this.$store.dispatch('filterSongs');
  }
};
</script>

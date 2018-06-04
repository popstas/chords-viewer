<template>
  <div>
    <div class="search-total">total: {{ count }}</div>
    <Toolbar @changeFilter="filterSongs"></Toolbar>
    <el-collapse accordion @change="changeSong" :value="activeSong.url">
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
</style>

<script>
import SongItem from "~/components/SongItem";
import Toolbar from "~/components/Toolbar";
import Fuse from "fuse.js";
// import mapState from "vuex";

export default {
  components: {
    SongItem,
    Toolbar
  },

  data() {
    return {
      filteredSongs: []
    };
  },

  computed: {
    filter() {
      return this.$store.state.filter;
    },
    songs() {
      return this.$store.state.songs;
    },
    activeSong() {
      return this.$store.state.activeSong;
    },

    count() {
      return this.filteredSongs.length;
    }
    //...mapState(['songs', 'activeSong']) // TODO
  },

  watch: {
    filteredSongs(val) {
      if (val.length == 1) {
        this.changeSong(val[0].url);
      }
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
      const q = this.$store.state.filter.q.toLowerCase();
      let result = this.songs;

      if (q) {
        let isLetter = q.match(/\^.$/);
        if (isLetter) {
          result = result.filter(
            song => song.title.toLowerCase().search(q) >= 0
          );
        } else {
          let fuse = new Fuse(result, {
            keys: [
              {
                name: "title",
                weight: 0.7
              },
              {
                name: "text",
                weight: 0.3
              }
            ]
          });
          result = fuse.search(q);
          /* result = result.filter(song => {
            return (
              song.title.toLowerCase().search(q) >= 0 ||
              (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
            );
          }); */
        }
      }

      if (this.$store.state.filter.withChords) {
        result = result.filter(song => song.details.chords);
      }

      if (this.$store.state.filter.withTexts) {
        result = result.filter(song => song.text);
      }

      result = this.sortSongs(result);
      this.filteredSongs = result;
    },

    changeSong(activeName) {
      // console.log(activeName);
      let activeSong = this.songs.find(song => song.url == activeName) || {};
      this.$store.commit("activeSong", activeSong);
    },

    scrollTo(offset) {
      // console.log('scrollTo', offset);
      // window.scrollTo(0, offset);
    }
  },

  created() {
    this.filterSongs();
  }
};
</script>

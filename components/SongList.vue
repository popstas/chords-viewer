<template>
  <div :class="['song-list', 'size' + this.$store.state.fontSize]">
    <div class="search-total">total: {{ count }}</div>
    <Toolbar @changeFilter="$store.dispatch('filterSongs')"></Toolbar>
    <el-collapse accordion @change="changeSong" :value="activeSong.url">
      <SongItem
        v-for="song in filteredSongs"
        :song="song"
        :key="song.url"
        :active="song.url == activeSong.url"
        @active="scrollTo"
      ></SongItem>
    </el-collapse>
    <button class="current-song" @click="scrollTo(lastOffset)">{{ activeSongTitle }}</button>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.current-song {
  @media (max-width: 1400px) {
    display: none;
  }
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  color: #666;
}

// global text size
.el-collapse-item__content {
  font-size: 13px;
  .size1 & {
    font-size: $font-size-1;
  }
  .size2 & {
    font-size: $font-size-2;
  }
  .size3 & {
    font-size: $font-size-3;
  }
}
</style>

<script>
import SongItem from "~/components/SongItem";
import Toolbar from "~/components/Toolbar";
// import mapState from "vuex";

export default {
  components: {
    SongItem,
    Toolbar
  },

  data() {
    return {
      lastOffset: 0
    };
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

    activeSongTitle() {
      if (!this.activeSong.title) return "";
      let title = this.activeSong.title;
      if (this.activeSong.details) {
        title =
          this.activeSong.details.artist +
          " - " +
          this.activeSong.details.title;
      }
      title = title.trim(",");
      return title;
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
      this.$store.commit("activeSong", activeSong);
      this.$store.commit(
        "playlistCurrent",
        this.$store.state.playlistCurrent + 1
      );
      this.$store.commit("playlist", [
        ...this.$store.state.playlist,
        activeSong
      ]);
    },

    scrollTo(offset) {
      this.lastOffset = offset;
      const fixedTopOffset = 0;
      window.scrollTo(0, offset - fixedTopOffset);
    }

    /* handleAddToHomeScreen(event) {
      this.$store.dispatch('setRandomSong');
      console.log('add to homescreen', result);
      event.preventDefault();
      event.prompt();
      event.userChoice.then(choice => {
        console.log('after choice: ', choice);
        if (choice.outcome === 'dismissed') {
          // They dismissed, send to analytics
        } else {
          // User accepted! Send to analytics
        }
      });
    } */
  },

  created() {
    this.$store.dispatch("filterSongs");
    // window.addEventListener('beforeinstallprompt', this.handleAddToHomeScreen);
  }
};
</script>

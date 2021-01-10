<template>
  <div :class="['song-list', 'size' + this.$store.state.fontSize]">
    <div class="search-total">total: {{ count }}</div>
    <Toolbar @scrollToLast="scrollTo(lastOffset)"></Toolbar>
    <el-collapse accordion @change="changeSong" :value="activeSong.url">
      <SongItem
        v-for="song in filteredSongs"
        :song="song"
        :key="song.url"
        :active="song.url == activeSong.url"
        @active="scrollTo"
      ></SongItem>
    </el-collapse>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

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
      lastOffset: 0,
      showTimer: null
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
    },

    activeSong(song) {
      if (!song) return;
      const query = { url: song.url };
      this.$router.push({ query });

      clearTimeout(this.showTimer);
      this.showTimer = setTimeout(() => {
        const safeUrl = song.url.replace(/[\/\.]/g, '_');
        this.$store.dispatch("addShow", safeUrl);
      }, 60000);
    },
  },

  methods: {
    changeSong(url) {
      this.$store.dispatch('changeSong', url);
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
    // this.$store.dispatch("filterSongs");
    // window.addEventListener('beforeinstallprompt', this.handleAddToHomeScreen);
  },

  mounted() {
    if (this.$route.query["url"]) {
      this.changeSong(this.$route.query["url"]);
      setTimeout(() => {
        clearTimeout(this.showTimer); // первый переход не считаем
      }, 100)
    }

    this.$router.afterEach((to, from) => {
      if (this.$route.query["url"]) {
        this.changeSong(this.$route.query["url"]);
      }
    });
  }
};
</script>

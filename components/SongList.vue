<template>
  <div :class="['song-list', 'size' + this.$store.state.fontSize]">
    <el-collapse accordion @change="changeSong" :value="activeSong.url">
      <DynamicScroller v-if="isMobile()"
                       class="scroller"
                       :items="filteredSongs"
                       :min-item-size="itemHeight"
                       keyField="url"
                       ref="scroller"
                       :buffer="scrollerBuffer"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.active]"
            :data-index="index"
          >
            <SongItem
              :song="item"
              :key="item.url"
              :active="item.url === activeSong.url"
              @active="scrollTo"
              @change="changeSong(item.url === activeSong.url ? '' : item.url)"
            ></SongItem>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      <SongItem v-else
                v-for="item in filteredSongs"
                :song="item"
                :key="item.url"
                :active="item.url === activeSong.url"
                @active="scrollTo"
                @change="changeSong(item.url === activeSong.url ? '' : item.url)"
      ></SongItem>

    </el-collapse>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.scroller {
  height: 100vh;
}

.el-collapse {
  border: none !important;
}

.el-collapse-item__header {
  border: none !important;
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

const itemHeight = 48;

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
    SongItem,
  },

  data() {
    return {
      // lastOffset: 0,
      showTimer: null,
      itemHeight: 48,
      // itemComponent: ItemComponent,
    };
  },

  computed: {
    lastOffset: {
      get() {
        return this.$store.state.lastOffset;
      },
      set(value) {
        this.$store.commit('lastOffset', value);
      },
    },
    autoscroll: {
      get() {
        return this.$store.state.autoscroll;
      },
      set(val) {
        this.$store.commit("autoscroll", val);
      }
    },

    autoScrollSpeed() {
      return this.$store.state.autoScrollSpeed;
    },
    filter() {
      return this.$store.state.filter;
    },
    filteredSongs() {
      return this.$store.state.filteredSongs;
    },
    activeSong() {
      return this.$store.state.activeSong;
    },
    scrollerBuffer() {
      // default buffer 200 cancels beat right after scroll to next song, 50 is better
      // small buffer 50 is bad for fast list scrolling
      return this.activeSong.url ? 50 : 1000;
    },

    songs() {
      return this.$store.state.songs;
    },
  },

  watch: {
    // open single filtered chords
    filteredSongs(val) {
      if (val.length === 1 && val[0].title !== "Loading...") {
        this.changeSong(val[0].url);
      }
    },
    activeSong(song) {
      // update url
      const query = {...this.$router.history.current.query};
      if (query.song_num !== undefined) delete (query.song_num);
      if (song.url) query.url = song.url;
      else delete query.url;
      // const query = song.url ? {url: song.url} : {};
      this.$router.push({query});

      if (!song) return;

      // show timer
      clearTimeout(this.showTimer);
      this.showTimer = setTimeout(() => {
        if (!song.url) return; // fix empty song addShow error
        const safeUrl = song.url.replace(/[\/.]/g, '_');
        this.$store.dispatch("addShow", safeUrl);
      }, 60000);

      this.scrollerToActiveSong();
    },
    autoscroll(val) {
      this.$store.commit("setToolbarHidden", val);
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    },
  },

  methods: {
    isMobile() {
      return screen.width <= 600;
    },

    changeAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      if (this.autoscroll) {
        if (!this.isMobile()) return; // desktop autoscroll is in Toolbar
        // console.log('autoscroll songlist');
        // if (this.isMobile()) return; // in SongList
        this.scrollInterval = setInterval(() => {
          try {
            const scroller = document.querySelector(".vue-recycle-scroller");
            if (!scroller) return;
            scroller.scrollTo(0, scroller.scrollTop + 20);
          }
          catch (e) {
            console.error('scroll error: ', e);
          }
        }, speedMapping2[this.autoScrollSpeed]);
      }
    },

    scrollerToActiveSong() {
      // scroll to song
      // to active="scrollTo"
      if (!this.$refs.scroller) return;
      const index = this.filteredSongs.findIndex(s => s.url === this.activeSong.url);
      if (index === -1) return;
      setTimeout(() => {
        try {
          this.$refs.scroller.scrollToItem(index);
          this.itemToScroll = false;
        } catch (e) {
          // second try, on page load
          setTimeout(() => this.$refs.scroller.scrollToItem(index), 1000);
        }
      }, 50);
    },

    // TODO: changeSong intersects with watch for activeSong change
    changeSong(url) {
      this.$store.dispatch('changeSong', url);
    },

    scrollTo(offset) {
      setTimeout(() => {
        this.lastOffset = offset;
        const fixedTopOffset = 0;
        window.scrollTo(0, offset - fixedTopOffset);
      }, 100);
    },

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

    // get url with filtered songs, read from get query ?q=...
    if (this.$route.query["q"]) {
      this.$store.state.filter.q = this.$route.query["q"];
    }

    if (this.$route.query["song_num"]) {
      const num = parseInt(this.$route.query["song_num"]);
      const song = this.$store.state.songs[num];
      if (song) {
        this.changeSong(song.url);
        this.$store.commit('readerMode', true);
      }
    }

    /*this.$router.afterEach((to, from) => {
      console.log('from: ', from);
      console.log('to: ', to);
      if (this.$route.query["url"]) {
        this.changeSong(this.$route.query["url"]);
      }
    });*/
  }
};
</script>

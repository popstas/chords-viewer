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
@use "@/assets/variables.scss" as *;

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
// NOTE: dark-theme.scss has `.dark-mode .el-collapse-item__content { font-size: 13px }`
// (same specificity, loaded later) so the size classes must be more specific.
.el-collapse-item__content {
  font-size: 13px;
}

.song-list.size1 .el-collapse-item__content {
  font-size: $font-size-1;
}

.song-list.size2 .el-collapse-item__content {
  font-size: $font-size-2;
}

.song-list.size3 .el-collapse-item__content {
  font-size: $font-size-3;
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
      const query = {...this.$route.query};
      if (query.song_num !== undefined) delete (query.song_num);
      if (song.url) query.url = song.url;
      else delete query.url;
      // const query = song.url ? {url: song.url} : {};
      this.$router.push({query});

      // vue-virtual-scroller can keep a just-collapsed song's *expanded* size
      // cached (ResizeObserver/recycle race), leaving an empty gap the height
      // of the song. Clear the size cache so visible items are re-measured
      // from the real DOM whenever the active song toggles.
      this.remeasureScroller();

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

    // Clear the virtual scroller's size cache after a song expands/collapses
    // so every visible item is re-measured (fixes stale expanded heights that
    // leave an empty gap). No-op on desktop (no scroller).
    remeasureScroller() {
      this.$nextTick(() => {
        const sc = this.$refs.scroller;
        if (sc && typeof sc.forceUpdate === 'function') sc.forceUpdate(true);
      });
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
          // leave one collapsed-song row above the open song so the floating
          // chords panel (pinned at top) doesn't cover its collapse header
          const sc = document.querySelector('.vue-recycle-scroller');
          if (sc) sc.scrollTop = Math.max(0, sc.scrollTop - this.itemHeight);
          this.itemToScroll = false;
        } catch (e) {
          // second try, on page load
          setTimeout(() => this.$refs.scroller.scrollToItem(index), 1000);
        }
      }, 50);
    },

    // scroll the page to the start of the active song (same placement as on open).
    // called when the song title in the bottom player is clicked.
    scrollToActiveSong() {
      if (!this.activeSong.url) return;
      if (this.isMobile()) {
        this.scrollerToActiveSong();
      } else {
        const el = document.querySelector('.song-item.active');
        if (el) window.scrollTo(0, el.offsetTop - this.songLineHeight());
      }
    },

    // TODO: changeSong intersects with watch for activeSong change
    changeSong(url) {
      this.$store.dispatch('changeSong', url);
    },

    // height of one song text line, used to shift the opened song down
    // so floating chords (pinned at top) don't cover the first line
    songLineHeight() {
      const el = document.querySelector('.song-item.active .song-item__line_text');
      if (el) {
        const lh = parseFloat(getComputedStyle(el).lineHeight);
        if (lh) return lh;
      }
      return 30;
    },

    scrollTo(offset) {
      setTimeout(() => {
        this.lastOffset = offset;
        // on desktop shift the song one line lower so floating chords don't cover the first line
        const fixedTopOffset = this.isMobile() ? 0 : this.songLineHeight();
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

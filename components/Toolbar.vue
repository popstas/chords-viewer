<template>
  <div :class="{toolbar: true, toolbar_top: true, toolbar_fixed: toolbarFixed, toolbar_hidden: toolbarHidden}">
    <div class="toolbar-spacer"></div>
    <div class="toolbar-body">
      <SearchInput class="toolbar__search" v-model="q"></SearchInput>

      <div class="toolbar__current-song">
        <el-button class="toolbar__up" @click="toTop">
          <icon name="chevron-up"></icon>
        </el-button>
        <el-button class="toolbar__hide" @click="hideToolbar">
          <icon name="chevron-down"></icon>
        </el-button>
        <button @click="$emit('scrollToLast')">{{ $store.getters.activeSongTitle }}</button>

        <div @click="showQrCode = !showQrCode" class="toolbar__qrcode" v-if="showQrCode">
          <qr-code :size="340" :text="$store.state.activeSong.url"></qr-code>
        </div>
        <a v-if="$store.getters.activeSongTitle && !showQrCode" class="toolbar__qrcode-link"
           @click.prevent="showQrCode = !showQrCode">
          <icon name="qrcode"></icon>
        </a>
      </div>

      <ul class="toolbar__search-letters search-letters">
        <li
          :class="{'search-letters__letter': true, active: q === '^' + letter}"
          v-for="letter in letters"
          :key="letter"
          @click="q = '^' + letter"
        >{{ letter }}
        </li>
      </ul>

      <ul class="toolbar__search-genres search-genres">
        <li
          v-if="queueLength"
          :class="{'search-genres__genre': true, 'search-genres__genre_queue': true, active: q === 'жанр: next'}"
          @click="q = q === 'жанр: next' ? '' : 'жанр: next'"
        >next ({{ queueLength }})<span class="search-genres__clear" title="Очистить очередь" @click.stop="clearQueue">×</span>
        </li>
        <li
          :class="{'search-genres__genre': true, active: q === 'жанр: ' + genre}"
          v-for="genre in genres"
          :key="genre"
          @click="q = q==='жанр: ' + genre ? '' : 'жанр: ' + genre"
        >{{ genre }}
        </li>
      </ul>

      <div class="toolbar__artists-row">
        <el-select class="toolbar__search-artists search-artists" popper-class="artists-dropdown" placeholder="Select artist" v-model="artist">
          <el-option
            v-for="item in artists"
            :key="item.name"
            :value="item.name">
            <span style="float: left">{{ item.name }}</span>
            <span :class="{'toolbar__artists-counter': true, 'toolbar__artists-counter_active': artistsSort === 'rate' }">{{
                item.rate
              }}</span>
            <span
              :class="{'toolbar__artists-counter': true, 'toolbar__artists-counter_active': artistsSort === 'count' }">{{
                item.count
              }}</span>
            <span
              :class="{'toolbar__artists-counter': true, 'toolbar__artists-counter_active': artistsSort === 'shows' }">{{
                item.shows
              }}</span>
          </el-option>
        </el-select>

        <el-radio-group class="search-artists-sort" v-model="artistsSort" size="small">
          <el-radio-button value="name" title="По алфавиту"><icon name="arrow-down-a-z"></icon></el-radio-button>
          <el-radio-button value="shows" title="По показам"><icon name="eye"></icon></el-radio-button>
          <el-radio-button value="count" title="По количеству"><icon name="hashtag"></icon></el-radio-button>
          <el-radio-button value="rate" title="По рейтингу"><icon name="star"></icon></el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.toolbar {
  background: var(--bg);
  text-align: center;
  margin: 0 auto;
  max-width: $container-width-xs;
  @media (min-width: $container-width-sm) {
    max-width: $container-width-sm;
  }
  @media (min-width: $container-width-md) {
    max-width: $container-width-md;
  }
  @media (min-width: $container-width-lg) {
    max-width: $container-width-lg;
  }

  &__up, &__hide {
    display: none !important;
  }

  &__qrcode {
    text-align: center;

    > div {
      display: inline-block !important;
      padding: 5px;
      background: #fff;
    }
  }

  &__qrcode-link {
    float: right;
    padding: 10px;
    color: var(--link);
  }

  &__artists-counter {
    width: 40px;
    text-align: right;
    float: right;
    color: #8492a6;
    font-size: 13px;

    &_active {
      color: #ccc;
    }
  }

  &_fixed {
    .toolbar-spacer {
      height: 212px;
    }

    .toolbar-body {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 5px;
      box-shadow: 0 0 1px #ccc;
      background: rgba(0, 0, 0, 0.2);

      .toolbar__up {
        display: block !important;
        float: left;
        margin-left: 7px;
      }

      .toolbar__hide {
        display: block !important;
        float: left;
        margin-left: 0;
      }

      .search-letters {
        display: none;
      }

      .search-genres {
        display: none;
      }

      .search-artists {
        display: none;
      }

      .search-artists-sort {
        display: none;
      }

      .toolbar__search {
        display: none;
      }

    }
  }

  &_hidden .toolbar-body {
    display: none;
  }

  // switches
  .el-switch {
    margin: 15px 15px 15px 0;
  }

  // search letters
  .search-letters {
    list-style: none;
    padding: 0;

    // mobile: keep the alphabet on a single horizontally-scrollable row
    @media (max-width: 600px) {
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      text-align: left;
    }

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
        color: var(--border-hover);
      }
    }
  }

  // search genres
  .search-genres {
    list-style: none;
    padding: 0;
    margin-bottom: 8px;

    // mobile: keep all genre chips (incl. "next") on a single, horizontally
    // scrollable row instead of wrapping
    @media (max-width: 600px) {
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      text-align: left;
    }

    &__genre {
      padding: 0 5px;
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
        color: var(--border-hover);
      }
    }

    &__genre_queue {
      font-weight: bold;
    }

    &__clear {
      margin-left: 4px;
      cursor: pointer;
      color: var(--color);
      font-size: 16px;
      line-height: 1;
      opacity: 0.6;

      &:hover {
        opacity: 1;
        color: #f56c6c;
      }
    }
  }

  // artist select + sort buttons on a single row
  &__artists-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 15px;
  }

  .search-artists {
    flex: 0 1 180px;
    min-width: 0;
    margin-right: 0; // for 3rd button "count"

    $input-height: 30px;

    .el-input__icon, input {
      line-height: $input-height;
      height: $input-height;
    }

    // Element Plus' new .el-select__wrapper isn't covered by dark-theme.scss
    // (which targets the old .el-input__inner), so it stays white. Use theme
    // colors: background = page bg, light text.
    .el-select__wrapper {
      background-color: var(--bg);
      box-shadow: 0 0 0 1px var(--border) inset;
    }
    .el-select__placeholder,
    .el-select__selected-item,
    .el-select__input {
      color: var(--color);
    }

    &-sort {
      flex: 0 0 auto;

      .el-radio-button__inner {
        padding: 7px 9px;
      }
    }
  }

  // close button
  .el-button,
  .el-checkbox-button__inner {
    border: none !important;
    border-radius: 4px !important;
    background: none !important;
    color: var(--link) !important;

    &:disabled {
      color: var(--bg-hover) !important;
    }

    padding: 7px;
    // float: right;
  }

  // current song breadcrumbs
  &__current-song {
    button {
      padding: 10px;
      border: none;
      background: none;
      cursor: pointer;
      outline: none;
      color: var(--color);
    }
  }
}

// The top toolbar and the bottom PlayerFloating share the global `.toolbar`
// styles, so component-specific tweaks are scoped via the `toolbar_top`
// modifier (higher specificity, wins over PlayerFloating's duplicate rules).
.toolbar.toolbar_top {
  // top toolbar renders only when no song is active, so the current-song title
  // is always empty here — collapse its line box to shrink the search↔alphabet gap
  .toolbar__current-song {
    line-height: 0;

    button {
      padding: 4px 10px;
    }
  }

  // align the artist select and the sort buttons by height (zero the asymmetric
  // bottom margins that PlayerFloating's duplicate rules apply)
  .toolbar__artists-row .search-artists,
  .toolbar__artists-row .search-artists-sort {
    margin-top: 0;
    margin-bottom: 0;
  }
}

// The artist dropdown is teleported to <body>, so it must be styled globally.
// Widen it (the narrow select truncates artist names) so it spans to about the
// right edge of the sort buttons.
.artists-dropdown.el-select-dropdown {
  width: 450px !important;
  max-width: calc(100vw - 16px);
}
</style>

<script>
import SearchInput from "~/components/SearchInput";
import _ from "lodash";

/*const speedMapping = {
  1: 1024,
  2: 512,
  3: 256,
  4: 128,
  5: 64,
  6: 32
};*/
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
    SearchInput
  },

  data() {
    return {
      // autoscroll: false,
      scrollInterval: false,

      toolbarFixed: false,
      lastScrollTop: 0,

      artist: "",
      // declared here so reassignment in build*() is reactive; without this the
      // artist list won't re-render when the name/shows/count/rate sort changes
      letters: [],
      genres: [],
      artists: [],

      showQrCode: false,
    };
  },

  computed: {
    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    },

    artistsSort: {
      get() {
        return this.$store.state.artistsSort;
      },
      set(val) {
        this.$store.commit("artistsSort", val);
        this.buildArtists();
      }
    },

    autoscroll: {
      get() {
        return this.$store.state.autoscroll;
      },
      set(val) {
        this.$store.commit("autoscroll", val);
      }
    },

    q: {
      get() {
        return this.$store.state.filter.q;
      },
      set(val) {
        if (this.$store.state.filter.q === val) return;
        this.changeFilter("q", val);
      }
    },

    autoScrollSpeed: {
      get() {
        return this.$store.state.autoScrollSpeed;
      },
      set(val) {
        this.$store.commit("autoScrollSpeed", val);
      }
    },

    queueLength() {
      return this.$store.state.queue.length;
    }
  },

  watch: {
    autoscroll(val) {
      this.$store.commit("setToolbarHidden", val);
      this.changeAutoScroll();
    },

    autoScrollSpeed() {
      this.changeAutoScroll();
    },

    artist(val) {
      this.q = '^' + val;
    }
  },

  methods: {
    shortkey(opts) {
      console.log("opts: ", opts);
    },

    changeFilter(name, value) {
      this.$store.dispatch("changeFilter", {name, value});
      // this.$emit("changeFilter", { name, value });
    },

    clearQueue() {
      this.$store.dispatch("clearQueue");
    },

    isMobile() {
      return screen.width <= 600;
    },

    changeAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      if (this.autoscroll) {
        // console.log('autoscroll toolbar');
        if (this.isMobile()) return; // in SongList
        this.scrollInterval = setInterval(() => {
          window.scrollBy({
            left: 0,
            top: 20,
            behavior: 'smooth',
          });
        }, speedMapping2[this.autoScrollSpeed]);
      }
    },

    handleScroll() {
      const delta = window.scrollY - this.lastScrollTop;
      this.lastScrollTop = window.scrollY;
      // top toolbar no longer docks to the bottom on scroll (that produced a
      // second bottom bar over PlayerFloating + an empty 212px spacer). It now
      // scrolls away in normal flow; the pinned app header gives quick access.
      // this.toolbarFixed = window.scrollY > 0;

      if (window.scrollY === 0) {
        this.autoscroll = false;
      }

      // console.log('window.scrollY:', window.scrollY);
      // console.log('delta:', delta);
      if (delta === 1) {
        return; // ignore autoscroll
      }

      // too fast for human
      if (Math.abs(delta) > 20) {
        return;
      }

      if (delta < 0) {
        this.$store.commit("setToolbarHidden", false);
      }
      if (delta > 1 && this.toolbarFixed) {
        this.$store.commit("setToolbarHidden", true);
      }

      // stop when 2+ columns
      if (this.$el.parentElement.offsetWidth > 1200) {
        this.autoscroll = false;
      }
    },

    hideToolbar() {
      this.$store.commit("setToolbarHidden", true);
    },

    buildLetters() {
      let letters = this.$store.state.songs.map(song => {
        return song.title[0].toUpperCase();
      });
      letters.sort();
      // unique letters
      this.letters = letters.filter((letter, pos, arr) => {
        return arr.indexOf(letter) === pos;
      });
    },

    buildGenres() {
      let genres = this.$store.state.songs.map(song => {
        if (!song.tags) return [];
        let g = song.tags.map(tag => {
          if (tag.indexOf('жанр:') === 0) return tag.replace('жанр: ', '');
        });
        g = g.filter(Boolean);
        return g;
      });
      genres = genres
        // .filter((genre, index) => genres.indexOf(genre) !== index)
        .flat()
        .filter((genre, index, arr) => arr.indexOf(genre) === index)

      genres.sort();

      this.genres = genres;
    },

    buildArtists() {
      let artists = [];
      const shows = this.$store.state.shows || {};

      const safeUrl = url => url.replace(/[\/.]/g, '_');
      const songShows = song => shows[safeUrl(song.url)] || 0;

      this.$store.state.songs.map(song => {
        if (!song.details || !song.details.artist) return;

        const foundIndex = artists.findIndex(artist => {
          return artist && artist.name === song.details.artist;
        });
        if (foundIndex === -1) {
          artists.push({name: song.details.artist, count: 1, shows: songShows(song)});
        } else {
          artists[foundIndex].count++;
          artists[foundIndex].shows += songShows(song);
        }
      });

      // rate calculate
      artists = artists.map(a => {
        // rounded to 1 decimal place
        a.rate = Math.round(a.shows / a.count * 10) / 10;
        if (a.count < 3) a.rate = 0;
        return a;
      });

      if (this.artistsSort === 'count') {
        artists.sort((a, b) => {
          return a.count > b.count ? 1 : a.count < b.count ? -1 : 0;
        }).reverse();
      }

      if (this.artistsSort === 'shows') {
        artists.sort((a, b) => {
          return a.shows > b.shows ? 1 : a.shows < b.shows ? -1 : 0;
        }).reverse();
      }

      if (this.artistsSort === 'rate') {
        artists.sort((a, b) => {
          return a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0;
        }).reverse();
      }

      this.artists = artists.filter((letter, pos, arr) => {
        return arr.indexOf(letter) === pos;
      });
    },

    toTop() {
      const sc = document.querySelector('.vue-recycle-scroller');
      if (sc) sc.scrollTo(0, 0);
      window.scrollTo(0, 0);
    }
  },

  created() {
    this.buildLetters();
    this.buildGenres();
    this.buildArtists();
    window.addEventListener("scroll", this.handleScroll);
    this.q = this.$store.state.filter.q;
    this.fontSize = this.$store.state.fontSize;
  },

  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.scrollInterval);
  }
};
</script>

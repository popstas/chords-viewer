<template>
  <div :class="{'el-collapse-item': true, 'song-item': true, active: active}">
    <div role="button" :class="{'el-collapse-item__header': true, 'is-opening': opening}" @click="onHeaderClick">
      <span v-if="$store.state.filter.sortByDate" class="song-item__date">{{ song.created.replace(/T.*/, '') }}</span>
      <span v-if="$store.state.filter.sortByShows" class="song-item__shows" v-html="shows || ''"></span>
      {{ title }}
      <span v-if="opening" class="song-item__spinner" aria-hidden="true"></span>

      <icon v-if="isBeat && $store.state.filter.beats !== '1' && !$store.state.readerMode" style="margin-left: 5px" name="drum"></icon>
      <icon v-if="isPiano && $store.state.showBeats&& !$store.state.readerMode" style="margin-left: 5px" name="keyboard"></icon>

      <span class="song-item__badges" v-if="$store.state.showShows">
        <span class="song-item__shows" v-html="shows || ''"></span>
      </span>

      <span class="song-item__badges" v-if="$store.state.showBadges">
        <span v-if="complexity !== ''" :class="{ 'song-item__complexity': true, [complexityClass]: true }"
              v-html="complexity" title="song complexity"></span>
      </span>
    </div>

    <div role="tabpanel" class="el-collapse-item__wrap" v-if="active">
      <div class="el-collapse-item__content">
        <div class="song-item__content">
          <div v-if="active && !$store.state.readerMode" class="song-transpose">
            <input type="hidden" v-shortkey="{cDown: ['ctrl', 'arrowdown']}" @shortkey="transposeLevel--"/>
            <input type="hidden" v-shortkey="{cUp: ['ctrl', 'arrowup']}" @shortkey="transposeLevel++"/>
            <el-button size="small" @click="transposeLevel--">&minus;</el-button>
            <el-button size="small" disabled>{{ transposeLevel }}</el-button>
            <el-button size="small" @click="transposeLevel++">&plus;</el-button>
            <span class="song-transpose__right">
              <el-button
                v-if="chordsOverflow"
                :class="{'song-transpose__nowrap': true, 'song-transpose__nowrap_active': $store.state.chordNowrap}"
                size="small"
                :title="$store.state.chordNowrap ? 'Перенос аккордов' : 'Без переноса аккордов'"
                @click="toggleChordNowrap"
              >
                <icon name="arrows-left-right"></icon>
              </el-button>
              <el-button
                v-if="$store.state.showBeats && (isBeat || isPianoAllowed)"
                class="song-transpose__beat"
                size="small"
                title="Beat"
                @click="showBeatControls = !showBeatControls"
              >
                <icon name="drum"></icon>
              </el-button>
              <el-button
                :class="{'song-transpose__queue': true, 'song-transpose__queue_active': inQueue}"
                size="small"
                :title="inQueue ? 'Убрать из очереди' : 'Добавить в очередь'"
                @click="toggleQueue"
              >
                <icon :name="inQueue ? 'check' : 'list-ul'"></icon>
              </el-button>
              <FontSize></FontSize>
            </span>
          </div>
          <div v-else>
            <FontSize style="float: right"></FontSize>
          </div>

          <template v-if="$store.state.showBeats && showBeatControls">
            <div v-if="isBeat" class="song-midi">
              <BeatPlayer :beat="song.beat" name="beat" :rever="true" :piano="false"
                          :chords="song.details.chords"></BeatPlayer>
            </div>
            <div v-if="!isBeat && isPianoAllowed" class="song-midi">
              <BeatPlayer :beat="song.beat" name="beat" :rever="true" :piano="true"
                          :chords="song.details.chords"></BeatPlayer>
            </div>
          </template>

          <div v-if="song.text" class="song-text">
            <template class="song-text__line" v-for="(line, lineKey) in textLines">
              <div v-if="line.type === 'chords' && !$store.state.readerMode"
                   :class="{'song-item__line_chords': true, 'song-item__line_chords_nowrap': $store.state.chordNowrap, 'song-item__line_chords_glue': textLines[lineKey+1] && textLines[lineKey+1].type && textLines[lineKey+1].type === 'text'}"
                   :key="lineKey">
                <template v-for="(chord, chordKey) in line.data">
                  <template v-if="chord !== ''">
                    <Chord :chord="chord.trim()" :transposeLevel="transposeLevel" :key="chordKey"></Chord>
                  </template>
                  <template v-else>&nbsp;</template>
                </template>
              </div>
              <div
                v-if="line.type === 'text'"
                class="song-item__line_text"
                v-html="line.data"
                :key="lineKey"
              ></div>
              <div
                v-if="line.type === 'hr'"
                class="song-item__line_text"
                :key="lineKey"
              >
                <hr :class="{ big: line.big, big_chorus: line.chorus }">
              </div>
            </template>
          </div>

          <a class="song-item__link" target="_blank" :href="song.url">
            <icon name="link"></icon>
          </a>
          <a v-if="isShare" class="song-item__link" @click.prevent="share">
            <icon name="share-nodes"></icon>
          </a>
          <a class="song-item__link" @click.prevent="copyText">
            <icon name="copy"></icon>
          </a>
          <a class="song-item__link" @click.prevent="showQrCode = !showQrCode">
            <icon name="qrcode"></icon>
          </a>
          <a class="song-item__link" @click.prevent="showComment = !showComment">
            <icon name="pen-to-square"></icon>
          </a>

          <div class="song-item__qrcode" v-if="showQrCode">
            <qr-code :size="340" :text="song.url"></qr-code>
          </div>

          <ul v-if="active" class="song-categories">
            <li class="song-categories__item song-categories__item_date">{{ song.created.replace(/T.*/, '') }}</li>
            <li
              class="song-categories__item song-categories__item_artist"
              @click="selectArtist(song.details.artist)"
            >{{ song.details.artist }}
            </li>
            <li
              class="song-categories__item song-categories__item_genre"
              v-for="genre in genres" :key="genre"
              @click="changeFilter('q', 'жанр: ' + genre)"
            >{{ genre }}
            </li>
            <li class="song-categories__item song-categories__item_shows">просмотров:
              <el-button size="small" disabled v-html="shows"></el-button>
              <el-button size="small" @click="addShows(-1)">&minus;</el-button>
              <el-button size="small" @click="addShows(1)">&plus;</el-button>
            </li>
          </ul>

          <details :open="showComment || !!this.comment">
            <summary v-html="this.comment ? 'Заметка' : ''"/>
            <div>
              <textarea ref="comment" class="song-item__comment" v-model="comment" v-shortkey.avoid/>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.song-midi {
  margin-top: 10px;
}
</style>

<script>
import Chord from "~/components/Chord";
import FontSize from "~/components/FontSize";
import BeatPlayer from "~/components/BeatPlayer";
// import { transposeMap } from "~/store";
import { detectChoruses } from "~/utils/chorus";
import "assets/components/SongItem.scss"
import copy from 'copy-to-clipboard';

export default {
  components: {Chord, FontSize, BeatPlayer},
  props: ["song", "active"],
  emits: ["change", "active"],

  data() {
    return {
      isShare: false,
      shows: 0,
      showQrCode: false,
      showComment: false,
      opening: false,
      // true when at least one rendered chord line is wider than its container
      // (i.e. would overflow the screen). Drives the nowrap-toggle visibility
      // (Task 5). Measured client-only on song open / font-change / resize.
      chordsOverflow: false,
      _overflowResizeHandler: null,
    };
  },

  watch: {
    active(val) {
      // the song finished expanding (or collapsed) — drop the opening spinner
      this.opening = false;
      if (!val) {
        this.chordsOverflow = false;
        return;
      }
      this.$emit("active", this.$el.offsetTop);
      this.scheduleOverflowMeasure();
      setTimeout(() => {
        this.$emit("active", this.$el.offsetTop);
        this.scheduleOverflowMeasure();
      }, 1000);
    },

    transposeLevel(val) {
      // cycle transpose
      if (Math.abs(val) === 12) this.transposeLevel = 0;
      // transposing can widen/narrow chord chips → re-check overflow
      this.scheduleOverflowMeasure();
    },

    // font-size changes shrink/grow chord chips → overflow may flip
    fontSizeStore() {
      this.scheduleOverflowMeasure();
    },

    showsStore() {
      this.shows = this.showsStore;
    },

    showComment(val) {
      if (val) setTimeout(() => {
        this.$refs.comment.focus()
      }, 100);
    }
  },

  computed: {
    title() {
      let title = this.song.title;
      if (this.song.details.title) {
        title = this.song.details.artist + " - " + this.song.details.title;
      }
      title = title.trim(",");
      return title;
    },

    isBeat() {
      return !!this.song.beat?.name;
    },

    inQueue() {
      return this.$store.state.queue.includes(this.song.url);
    },

    isPiano() {
      return this.chordsList.length === 4;
    },
    isPianoAllowed() {
      return this.chordsList.length >= 4;
    },

    chordsList() {
      let chords = this.song.details?.chords?.replace(/\(.*?\)/g, '').trim().split(' ') || [];
      if (chords.length === 2) {
        chords = [chords[0], chords[0], chords[1], chords[1]];
      }
      return chords;
    },

    safeUrl() {
      return this.song.url.replace(/[\/.]/g, '_');
    },

    showsStore() {
      return this.$store.state.shows[this.safeUrl] || 0;
    },

    transposeLevel: {
      get() {
        return this.$store.state.transposeLevel;
      },
      set(val) {
        this.$store.commit('transposeLevel', val);
      },
    },

    genres() {
      if (!this.song.tags) return [];
      let genres = this.song.tags.map(tag => {
        if (tag.indexOf('жанр:') === 0) return tag.replace('жанр: ', '');
      });
      genres = genres.filter(Boolean);
      /* genres = genres
      .flat()
      .filter((genre, index, arr) => arr.indexOf(genre) == index) */

      genres.sort();

      return genres;
    },

    complexity() {
      return 'complexity' in this.song.details ? this.song.details.complexity : "";
    },

    complexityClass() {
      const c = this.song.details.complexity || 0;
      // if (c == 0) return "song-item__complexity_0";
      if (c < 6) return "song-item__complexity_1";
      if (c < 10) return "song-item__complexity_2";
      return "song-item__complexity_3";
    },

    textLines() {
      if (!this.song.text) return "";
      // const textFixed = this.song.text;
      const textFixed = this.song.text
        .replace(/(\[.*?][: ])(.+)/g, '$1\n$2') // [куплет 1]:Am Em
        .replace(/(\d+) раза?/g, 'x$1') // 2 раза -> x2
        .replace(/(\d+)р/g, 'x$1') // 2 раза -> x2
        .replace(/Вступление:/g, 'Intro:')
        .replace(/вст\./g, 'Intro')
        .replace(/Кода:/g, 'Coda:')
        .replace(/Проигрыш/g, 'Coda')
      const lines = textFixed.split("\n").map(line => {
        if (!line.match(/[а-яА-Я]/)) {
          if (!line.trim()) {
            return {type: "hr", data: ''};
          }
          // find something like chords in line
          if (line.match(/[A-H]{1}#{0,1}[a-z]{0,1}m?[0-9#]{0,1}(\s|$)/)) {
            return {type: "chords", data: line.split(" ")};
          }
        }
        return {type: "text", data: line};
      });

      // collapse runs of consecutive blank lines into a single "big" separator
      // (two empty lines usually divide large blocks, e.g. verse / chorus)
      const merged = [];
      for (const line of lines) {
        const prev = merged[merged.length - 1];
        if (line.type === "hr" && prev && prev.type === "hr") {
          prev.big = true;
          continue;
        }
        merged.push({...line});
      }

      // Group the classified lines into blocks (runs of non-hr lines between
      // separators), detect which blocks are choruses, and flag every hr that
      // *follows* a chorus block so it can render bolder. The `chorus` flag is
      // independent of the double-blank `big` flag — both may apply.
      const blocks = [];          // each block: array of raw line strings
      const hrBlockIndex = [];    // for each hr object, the index of its preceding block
      let current = [];
      for (const line of merged) {
        if (line.type === "hr") {
          hrBlockIndex.push({ hr: line, blockIndex: blocks.length });
          blocks.push(current);
          current = [];
          continue;
        }
        const raw = line.type === "chords" ? line.data.join(" ") : line.data;
        current.push(raw);
      }
      blocks.push(current); // trailing block after the last hr (no separator)

      const isChorus = detectChoruses(blocks);
      for (const { hr, blockIndex } of hrBlockIndex) {
        if (isChorus[blockIndex]) hr.chorus = true;
      }

      return merged;
    },

    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    },

    // watched so a font-size change re-measures chord-line overflow
    fontSizeStore() {
      return this.$store.state.fontSize;
    },

    // store-backed so the mobile virtual scroller can recycle this component
    // without the beats panel collapsing itself (only the active song renders it)
    showBeatControls: {
      get() {
        return this.$store.state.showBeatControls;
      },
      set(val) {
        this.$store.commit('showBeatControls', val);
      }
    },

    comment: {
      get() {
        return this.$store.state.comments[this.safeUrl] || "";
      },
      set(val) {
        this.$store.dispatch('addComment', {url: this.safeUrl, comment: val})
      }
    }
  },

  methods: {
    // Rendering a song's content can freeze the main thread for 1-2s on mobile,
    // so the tap feels unresponsive. Show a spinner immediately and defer the
    // (heavy) expand by two frames so the browser paints the feedback first.
    // The spinner animates via CSS transform (compositor thread), so it keeps
    // spinning even while the main thread is blocked by the render.
    onHeaderClick() {
      if (this.active) {
        // collapsing is cheap — no spinner needed
        this.$emit("change");
        return;
      }
      this.opening = true;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.$emit("change");
      }));
      // safety net in case `active` never flips (e.g. song filtered out)
      setTimeout(() => { this.opening = false; }, 2500);
    },

    changeFilter(name, value) {
      this.$store.dispatch("changeFilter", {name, value});
      // this.$emit("changeFilter", { name, value });
    },

    // клик по артисту в конце песни: отфильтровать по артисту,
    // закрыть открытую песню и промотать страницу в начало
    selectArtist(artist) {
      this.changeFilter('q', '^' + artist);
      if (this.active) this.$emit('change'); // закрыть песню
      window.scrollTo(0, 0);
    },

    toggleChordNowrap() {
      this.$store.dispatch("toggleChordNowrap");
    },

    toggleQueue() {
      const added = !this.inQueue;
      this.$store.dispatch("toggleQueue", this.song.url);
      // collapse the song after adding it to the queue
      if (added) this.$emit("change");
    },

    share() {
      if (navigator.share) {
        navigator.share({
          title: this.title,
          text: this.song.text,
          url: window.location.href
        });
      }
    },

    copyText() {
      copy(this.song.text);
    },

    addShows(count) {
      this.shows = this.shows + count;
      this.$store.dispatch('setShow', {url: this.safeUrl, shows: this.shows});
    },

    // Re-measure chord-line overflow after the DOM has settled. Client-only and
    // deferred to nextTick so chord chips are laid out before we read geometry.
    scheduleOverflowMeasure() {
      if (typeof window === "undefined") return;
      this.$nextTick(() => this.measureChordsOverflow());
    },

    // True when any rendered chord line would be wider than its container.
    // Chord lines wrap by default (so their natural scrollWidth equals
    // clientWidth), so we temporarily force `white-space: nowrap` to read the
    // single-line content width, then restore the inline style.
    measureChordsOverflow() {
      if (typeof window === "undefined" || !this.active) {
        this.chordsOverflow = false;
        return;
      }
      const el = this.$el;
      const lines = el && el.querySelectorAll
        ? el.querySelectorAll(".song-item__line_chords")
        : [];
      let overflow = false;
      for (const line of lines) {
        const prev = line.style.whiteSpace;
        line.style.whiteSpace = "nowrap";
        if (line.scrollWidth > line.clientWidth + 1) overflow = true;
        line.style.whiteSpace = prev;
        if (overflow) break;
      }
      this.chordsOverflow = overflow;
    }
  },

  mounted() {
    this.isShare = !!navigator.share;
    this.shows = this.$store.state.shows[this.safeUrl] || 0;

    // re-check overflow on window resize (debounced ~150ms), client-only
    if (typeof window !== "undefined") {
      let resizeTimer = null;
      this._overflowResizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.measureChordsOverflow(), 150);
      };
      window.addEventListener("resize", this._overflowResizeHandler);
      if (this.active) this.scheduleOverflowMeasure();
    }
  },

  beforeUnmount() {
    if (typeof window !== "undefined" && this._overflowResizeHandler) {
      window.removeEventListener("resize", this._overflowResizeHandler);
      this._overflowResizeHandler = null;
    }
  }
};
</script>

<template>
  <div :class="{'el-collapse-item': true, 'song-item': true, active: active}">
    <div role="button" class="el-collapse-item__header" @click="$emit('change')">
      <span v-if="$store.state.filter.sortByDate" class="song-item__date">{{ song.created.replace(/T.*/, '') }}</span>
      <span v-if="$store.state.filter.sortByShows" class="song-item__shows" v-html="shows || ''"></span>
      {{ title }}
      <i v-if="song.popular && $store.state.showBadges" class="el-icon-star-off" title="popular song"></i>
      <span class="song-item__badges" v-if="$store.state.showBadges">
        <span v-if="complexity !== ''" :class="{ 'song-item__complexity': true, [complexityClass]: true }" v-html="complexity" title="song complexity"></span>
        <i v-if="song.text" class="el-icon-tickets" title="with text"></i>
      </span>
    </div>

    <div role="tabpanel" class="el-collapse-item__wrap" v-if="active"><div class="el-collapse-item__content">
      <div class="song-item__content">
        <div v-if="active" class="song-transpose">
          <input type="hidden" v-shortkey="{cDown: ['ctrl', 'arrowdown']}" @shortkey="transposeLevel--"/>
          <input type="hidden" v-shortkey="{cUp: ['ctrl', 'arrowup']}" @shortkey="transposeLevel++"/>
          <el-button size="mini" icon="el-icon-minus" @click="transposeLevel--"></el-button>
          <el-button size="mini" disabled>{{ transposeLevel }}</el-button>
          <el-button size="mini" icon="el-icon-plus" @click="transposeLevel++"></el-button>
        </div>

        <div v-if="chords" :class="{text: true, item: true, chords: true, chords_images: $store.state.showImages}">
          <span class="chords__section" v-for="(sec, secKey) in chords" :key="secKey">
            <span class="chords__sequence" v-for="(sequence, seqKey) in sec" :key="seqKey">
              <Chord
                v-for="(chord, key) in sequence"
                :chord="chord"
                :transposeLevel="transposeLevel - defaultTransposeLevel"
                :key="key"
                :image="$store.state.showImages"
              ></Chord>
            </span>
          </span>
        </div>

        <div v-if="song.text" class="song-text">
          <template class="song-text__line" v-for="(line, lineKey) in textLines">
            <div v-if="line.type == 'chords'" class="song-item__line_chords" :key="lineKey">
              <template v-for="(chord, chordKey) in line.data">
                <template v-if="chord != ''">
                  <Chord :chord="chord.trim()" :transposeLevel="transposeLevel" :key="chordKey"></Chord>
                </template>
                <template v-else>&nbsp;</template>
              </template>
            </div>
            <div
              v-if="line.type == 'text'"
              class="song-item__line_text"
              v-html="line.data"
              :key="lineKey"
            ></div>
          </template>
        </div>

        <a class="song-item__link" target="_blank" :href="song.url">
          <icon name="link"></icon>
        </a>
        <a v-if="isShare" class="song-item__link" @click.prevent="share">
          <icon name="share-alt"></icon>
        </a>
        <a class="song-item__link" @click.prevent="showQrCode = !showQrCode">
          <icon name="qrcode"></icon>
        </a>

        <div class="song-item__qrcode" v-if="showQrCode">
          <qr-code :size="340" :text="song.url"></qr-code>
        </div>

        <ul v-if="active" class="song-categories">
          <li class="song-categories__item song-categories__item_date">{{ song.created.replace(/T.*/, '') }}</li>
          <li
            class="song-categories__item song-categories__item_artist"
            @click="changeFilter('q', '^' + song.details.artist)"
          >{{ song.details.artist }}</li>
          <li
            class="song-categories__item song-categories__item_genre"
            v-for="genre in genres" :key="genre"
            @click="changeFilter('q', 'жанр: ' + genre)"
          >{{ genre }}</li>
          <li class="song-categories__item song-categories__item_shows">просмотров:
            <el-button size="mini" disabled v-html="shows"></el-button>
            <el-button size="mini" icon="el-icon-minus" @click="addShows(-1)"></el-button>
            <el-button size="mini" icon="el-icon-plus" @click="addShows(1)"></el-button>
          </li>
        </ul>

      </div>
    </div></div>
  </div>
</template>

<style lang="scss">
.song-item {
  &.active {
    margin-bottom: 50px;
  }

  &__badges {
    float: right;
  }

  [role="tab"] {
    overflow: hidden;
  }

  [role="button"] {
    display: block;

    &:hover {
      background: var(--bg-hover);
    }
  }

  .el-collapse-item__arrow {
    display: none;
  }

  .el-collapse-item__header {
    overflow: hidden;
  }

  &__date, &__shows {
    color: #999;
  }

  &__complexity {
    padding: 2px 4px;
    border-radius: 100%;
    color: #000;
    &_1 {
      background: #aaffaa;
    }
    &_2 {
      background: #ffffaa;
    }
    &_3 {
      background: #ffaaaa;
    }
  }

  &__content {
    overflow-x: auto;
  }
  &.active .song-item__content {
    @media (min-width: 1200px) {
      columns: 2;
    }
    @media (min-width: 1400px) {
      columns: 3;
    }
    @media (min-width: 1600px) {
      columns: 4;
    }
  }

  .chords {
    position: fixed;
    top: 0;
    left: auto;
    right: 0;
    text-align: center;
    background: var(--bg);
    padding: 5px;

    &_images {
      position: static;
    }

    @media (min-width: 1200px) {
      padding: 10px;
    }

    .slideout-open & {
      display: none;
    }

    &__section {
      display: block;
    }

    &__sequence {
      // white-space: nowrap;
      &:after {
        content: " .. ";
      }
      &:last-child:after {
        content: "";
      }
    }
  }

  &__line_chords {
    .chord_known .el-button {
      color: #999;
      border: none;
      background: none;
    }
  }

  .song-transpose .el-button {
    border: none;
  }

  &__link {
    display: inline-block;
    color: #999;
    text-decoration: none;
    margin-right: 10px;
    padding: 10px;
  }

  &__qrcode img{
    padding: 5px;
    background: #fff;
  }
}

.song-categories {
  list-style: none;
  padding: 0;

  &__item {
    padding: 0 5px 0 0;
    display: inline-block;
    color: #999;
    font-size: 13px;
    min-width: 23px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    margin: 0;

    &.active {
      color: #409eff;
    }

    &_artist {
      color: #ccc;
    }

    &_date, &_shows {
      cursor: default;
    }

    &_shows .el-button {
      border: none;
      padding: 0;
      margin: 0;
    }
  }
}

</style>

<script>
import Chord from "~/components/Chord";
import { transposeMap } from "~/store";
import "vue-awesome/icons/qrcode";
import "vue-awesome/icons/share-alt";
import "vue-awesome/icons/link";

export default {
  components: { Chord },
  props: ["song", "active"],

  data() {
    return {
      transposeLevel: 0,
      isShare: false,
      shows: 0,
      showQrCode: false,
    };
  },

  watch: {
    active(val) {
      if (!val) return;
      this.$emit("active", this.$el.offsetTop);
      setTimeout(() => {
        this.$emit("active", this.$el.offsetTop);
      }, 1000);

      this.transposeLevel = this.defaultTransposeLevel;
    },

    transposeLevel(val) {
      // cycle transpose
      if (Math.abs(val) == 12) this.transposeLevel = 0;
    },

    showsStore(val) {
      this.shows = this.showsStore;
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

    safeUrl() {
      return this.song.url.replace(/[\/\.]/g, '_');
    },

    showsStore() {
      return this.$store.state.shows[this.safeUrl] || 0;
    },

    genres() {
      if (!this.song.tags) return [];
      let genres = this.song.tags.map(tag => {
        if(tag.indexOf('жанр:') === 0) return tag.replace('жанр: ', '');
      });
      genres = genres.filter((genre, pos, arr) => {
        return genre;
      });
      /* genres = genres
      .flat()
      .filter((genre, index, arr) => arr.indexOf(genre) == index) */

      genres.sort();

      return genres;
    },

    defaultTransposeLevel() {
      const transpose = this.song.title.match(
        /\((капо|кап|capo|cap)\.? (\d+)\)/
      );
      return transpose ? transpose[2] * -1 : 0;
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
      return this.song.text.split("\n").map(line => {
        if (!line.match(/[а-яА-Я]/)) {
          return { type: "chords", data: line.split(" ") };
        }
        return { type: "text", data: line };
      });
    },

    chords() {
      if (!this.song.details) return [];
      // split by ' - ', then by ' .. ', then by ' '
      return this.song.details.chords
        .split(" - ")
        .map(section =>
          section.split(" .. ").map(subsection => {
            return subsection
            .replace(/\(([A-Z])/g, '( $1') // (C
            .replace(/([A-Zm0-9#])\)/g, '$1 )') // C)
            .replace(/\(кап\.? ([0-9]) \)/, '(кап.\xa0$1)') // (кап. 2 )
            .replace(/\((x[0-9]) \)/g, '($1)') // (x3 )
            .replace(/([A-Zm#])\.\.?([A-Z])/g, '$1 . $2') // C..G
            .split(" ")
          })
        );
    },

    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    }
  },

  methods: {
    changeFilter(name, value) {
      this.$store.dispatch("changeFilter", { name, value });
      // this.$emit("changeFilter", { name, value });
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

    addShows(count) {
      this.shows = this.shows + count;
      this.$store.commit('setShow', { url: this.safeUrl, shows: this.shows });
    }
  },

  mounted() {
    this.isShare = !!navigator.share;
    this.shows = this.$store.state.shows[this.safeUrl] || 0;
  }
};
</script>

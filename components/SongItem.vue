<template>
  <div :class="{'el-collapse-item': true, 'song-item': true, active: active}">
    <div role="button" class="el-collapse-item__header" @click="$emit('change')">
      <span v-if="$store.state.filter.sortByDate" class="song-item__date">{{ song.created.replace(/T.*/, '') }}</span>
      <span v-if="$store.state.filter.sortByShows" class="song-item__shows" v-html="shows || ''"></span>
      {{ title }}

      <span class="song-item__badges" v-if="$store.state.showShows">
        <span class="song-item__shows" v-html="shows || ''"></span>
      </span>

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
          <FontSize style="float: right"></FontSize>
        </div>

        <div v-if="song.beat.name" class="song-midi">
          <BeatPlayer :beat="song.beat" name="beat" :rever="true"></BeatPlayer>
        </div>

        <div v-if="song.text" class="song-text">
          <template class="song-text__line" v-for="(line, lineKey) in textLines">
            <div v-if="line.type == 'chords'" :class="{'song-item__line_chords': true, 'song-item__line_chords_glue': textLines[lineKey+1] && textLines[lineKey+1].type && textLines[lineKey+1].type == 'text'}" :key="lineKey">
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
            <div
              v-if="line.type == 'hr'"
              class="song-item__line_text"
              :key="lineKey"
            ><hr></div>
          </template>
        </div>

        <a class="song-item__link" target="_blank" :href="song.url">
          <icon name="link"></icon>
        </a>
        <a v-if="isShare" class="song-item__link" @click.prevent="share">
          <icon name="share-alt"></icon>
        </a>
        <a class="song-item__link" @click.prevent="copyText">
          <i class="el-icon-copy-document"></i>
        </a>
        <a class="song-item__link" @click.prevent="showQrCode = !showQrCode">
          <icon name="qrcode"></icon>
        </a>
        <a class="song-item__link" @click.prevent="showComment = !showComment">
          <icon name="edit"> </icon>
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

        <details :open="showComment || !!this.comment">
          <summary v-html="this.comment ? 'Заметка' : ''" />
          <div>
            <textarea ref="comment" class="song-item__comment" v-model="comment" v-shortkey.avoid />
          </div>
        </details>
      </div>
    </div></div>
  </div>
</template>

<script>
import Chord from "~/components/Chord";
import FontSize from "~/components/FontSize";
import BeatPlayer from "~/components/BeatPlayer";
import { transposeMap } from "~/store";
import "vue-awesome/icons/edit";
import "vue-awesome/icons/qrcode";
import "vue-awesome/icons/share-alt";
import "vue-awesome/icons/link";
import "assets/components/SongItem.scss"
import copy from 'copy-to-clipboard';

export default {
  components: { Chord, FontSize, BeatPlayer },
  props: ["song", "active"],

  data() {
    return {
      isShare: false,
      shows: 0,
      showQrCode: false,
      showComment: false,
    };
  },

  watch: {
    active(val) {
      if (!val) return;
      this.$emit("active", this.$el.offsetTop);
      setTimeout(() => {
        this.$emit("active", this.$el.offsetTop);
      }, 1000);
    },

    transposeLevel(val) {
      // cycle transpose
      if (Math.abs(val) == 12) this.transposeLevel = 0;
    },

    showsStore(val) {
      this.shows = this.showsStore;
    },

    showComment(val) {
      if (val) setTimeout(() => { this.$refs.comment.focus() }, 100);
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

    transposeLevel: {
      get(){
        return this.$store.state.transposeLevel;
      },
      set(val){
        console.log('transposeLevel: ', val);
        this.$store.commit('transposeLevel', val);
      },
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
      const lines = this.song.text.split("\n").map(line => {
        if (!line.match(/[а-яА-Я]/)) {
          if (!line.trim()) {
            return { type: "hr", data: '' };
          }
          // find something like chords in line
          if (line.match(/[A-H]{1}#{0,1}[a-z]{0,1}[0-9#]{0,1}(\s|$)/)) {
            return { type: "chords", data: line.split(" ") };
          }
        }
        return { type: "text", data: line };
      });

      return lines;
    },

    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    },

    comment: {
      get() { return this.$store.state.comments[this.safeUrl] || ""; },
      set(val) {
        this.$store.dispatch('addComment', { url: this.safeUrl, comment: val })
      }
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

    copyText(){
      copy(this.song.text);
    },

    addShows(count) {
      this.shows = this.shows + count;
      this.$store.dispatch('setShow', { url: this.safeUrl, shows: this.shows });
    }
  },

  mounted() {
    this.isShare = !!navigator.share;
    this.shows = this.$store.state.shows[this.safeUrl] || 0;
  }
};
</script>

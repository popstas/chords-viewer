<template>
  <el-collapse-item :title="title" :name="song.url" :class="{active: active}">
    <template slot="title">
      {{ title }}
      <i v-if="song.text" class="el-icon-tickets"></i>
      <i v-if="song.details.chords" class="el-icon-check"></i>
    </template>

    <div v-if="active" class="song-transpose">
      <el-button size="mini" icon="el-icon-minus" @click="transposeLevel--"></el-button>
      <el-button size="mini" disabled>{{ transposeLevel }}</el-button>
      <el-button size="mini" icon="el-icon-plus" @click="transposeLevel++"></el-button>
    </div>

    <div v-if="chords" class="text item chords">
      <span class="chords-section" v-for="(sec, secKey) in chords" :key="secKey">
        <span class="chords-sequence" v-for="(sequence, seqKey) in sec" :key="seqKey">
          <Chord v-for="(chord, key) in sequence" :chord="chord" :key="key"></Chord>
        </span>
      </span>
    </div>

    <div class="sont-text" v-html="textHtml"></div>
    <a target="_blank" :href="song.url">link</a>
  </el-collapse-item>
</template>

<style lang="scss">
.el-collapse-item {
  [role="tab"] {
    overflow: hidden;
  }

  .chords {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: #fff;
    padding: 5px;
    box-shadow: 0 0 2px #ccc;

    &-section {
      display: block;
    }
    &-sequence {
      white-space: nowrap;
      &:after {
        content: " .. ";
      }
      &:last-child:after {
        content: "";
      }
    }
  }

  .chords-line {
    color: #999;
  }

  .song-transpose .el-button {
    border: none;
  }
}
</style>

<script>
import { Popover } from "element-ui";
import Chord from "~/components/Chord";
import { transposeMap } from "~/store";

export default {
  components: { Chord },
  props: ["song", "active"],

  data() {
    return {
      transposeLevel: 0
    };
  },

  watch: {
    active(val) {
      if (val) this.$emit("active", this.$el.offsetTop);
    },
    transposeLevel(val) {
      // cycle transpose
      if (Math.abs(val) == 12) this.transposeLevel = 0;
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

    textHtml() {
      if (!this.song.text) {
        return "";
      }

      let html = this.song.text
        .split("\n")
        .map(line => {
          if (!line.match(/[а-яА-Я]/)) {
            line =
              '<span class="chords-line">' +
              this.chordsRender(line)
                .split(" ")
                .join("&nbsp;") +
              "</span>";
          }
          return line;
        })
        .join("<br>");
      return html;
    },

    chords() {
      if (!this.song.details) return [];
      let chords = this.chordsRender(this.song.details.chords);
      return chords
        .split(" - ")
        .map(section =>
          section.split(" .. ").map(subsection => subsection.split(" "))
        );

      /* chords = chords
        .split(" ")
        .map(chord => {
          if (chord.match(/^\(/) || chord == "-" || chord == "..") return chord;
          if (!this.isKnownChord(chord)) return chord;

          let chordUrl = this.getChordImageUrl(chord);
          return `<a target="_blank" href="${chordUrl}">${chord}</a>`;
        })
        .join(" ");

      chords =
        '<span class="chord-sequence">' +
        chords.split("..").join('</span> .. <span class="chord-sequence">') +
        "</span>";
      chords = chords.split(" - ").join(" - <br />"); */

      return chords;
    }
  },

  methods: {
    chordsRender(line) {
      let chords = line.split(" ");
      chords = this.chordsReplace(chords);
      chords = this.chordsTranspose(chords);
      return chords.join(" ");
    },

    chordsReplace(chords) {
      return chords.map(chord => chord.replace("B", "H").replace("m#", "#m"));
    },

    chordsTranspose(chords) {
      if (this.transposeLevel == 0) {
        return chords;
      }

      return chords.map(chord => {
        if (!chord) return chord;

        // find chain
        let chain = transposeMap.find(chain => chain.indexOf(chord) != -1);
        if (!chain) {
          return chord;
        }

        // iterate over chain at transposeLevel
        let currentIndex = chain.indexOf(chord);
        for (let i = 0; i < Math.abs(this.transposeLevel); i++) {
          if (this.transposeLevel > 0) {
            currentIndex =
              currentIndex + 1 >= chain.length ? 0 : currentIndex + 1;
          } else {
            currentIndex =
              currentIndex - 1 < 0 ? chain.length - 1 : currentIndex - 1;
          }
        }
        return chain[currentIndex];
      });
    }
  }
};
</script>

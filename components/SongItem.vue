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
      {{ chords }}
    </div>
    <div class="sont-text" v-html="textHtml"></div>
    <a target="_blank" :href="song.url">link</a>
  </el-collapse-item>
</template>

<style>
.el-collapse-item {
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
}
.chords-line {
  color: #999;
}
.song-transpose .el-button {
  border: none;
}
</style>

<script>
export default {
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
              this.chordsTranspose(line)
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
      return this.song.details.chords
        ? this.chordsTranspose(this.song.details.chords)
        : "";
    }
  },

  methods: {
    replaceChord(chord) {
      return chord.replace("B", "H");
    },

    chordsTranspose(line) {
      let chords = line.split(" ");
      chords = chords.map(chord => this.replaceChord(chord));

      if (this.transposeLevel == 0) {
        return line;
      }

      const transposeMap = [
        [
          "Am",
          "Am#",
          "Hm",
          "Cm",
          "Cm#",
          "Dm",
          "Dm#",
          "Em",
          "Fm",
          "Fm#",
          "Gm",
          "Gm#"
        ],
        ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"],
        [
          "A7",
          "A#7",
          "H7",
          "C7",
          "C#7",
          "D7",
          "D#7",
          "E7",
          "F7",
          "F#7",
          "G7",
          "G#7"
        ],
        [
          "Am7",
          "A#m7",
          "Hm7",
          "Cm7",
          "C#m7",
          "Dm7",
          "D#m7",
          "Em7",
          "Fm7",
          "F#m7",
          "Gm7",
          "G#m7"
        ]
      ];

      let transposedChords = chords.map(chord => {
        if (!chord) return chord;

        // find chain
        let chain = transposeMap.find(chain => chain.indexOf(chord) != -1);
        if (!chain) return chord;

        // iterate over chain at transposeLevel
        let currentIndex = chain.indexOf(chord);
        for (let i = 0; i < Math.abs(this.transposeLevel); i++) {
          if (this.transposeLevel > 0) {
            currentIndex =
              currentIndex + 1 >= chain.length ? 0 : currentIndex + 1;
          } else {
            currentIndex =
              currentIndex - 1 <= 0 ? chain.length - 1 : currentIndex - 1;
          }
        }
        return chain[currentIndex];
      });
      return transposedChords.join(" ");
    }
  }
};
</script>

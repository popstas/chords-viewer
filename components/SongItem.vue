<template>
  <el-collapse-item :title="title" :name="song.url" :class="{'song-item': true, active: active}">
    <template slot="title">
      {{ title }}
      <i v-if="song.text" class="el-icon-tickets"></i>
      <i v-if="song.details.chords" class="el-icon-check"></i>
    </template>

    <div class="song-item__content" v-if="active">
      <div v-if="active" class="song-transpose">
        <el-button size="mini" icon="el-icon-minus" @click="transposeLevel--"></el-button>
        <el-button size="mini" disabled>{{ transposeLevel }}</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="transposeLevel++"></el-button>
      </div>

      <div v-if="chords" class="text item chords">
        <span class="chords__section" v-for="(sec, secKey) in chords" :key="secKey">
          <span class="chords__sequence" v-for="(sequence, seqKey) in sec" :key="seqKey">
            <Chord v-for="(chord, key) in sequence" :chord="chord" :transposeLevel="transposeLevel" :key="key"></Chord>
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
          <div v-if="line.type == 'text'" class="song-item__line_text" v-html="line.data" :key="lineKey"></div>
        </template>
      </div>

      <a target="_blank" :href="song.url">link</a>
    </div>
  </el-collapse-item>
</template>

<style lang="scss">
.song-item {
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

    &__section {
      display: block;
    }

    &__sequence {
      white-space: nowrap;
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
}
</style>

<script>
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
          section.split(" .. ").map(subsection => subsection.split(" "))
        );
    }
  },

  methods: {}
};
</script>

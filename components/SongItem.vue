<template>
  <el-collapse-item :title="title" :name="song.url" :class="{'song-item': true, active: active}">
    <template slot="title">
      {{ title }}
      <i v-if="song.text" class="el-icon-tickets"></i>
      <i v-if="song.details.chords" class="el-icon-check"></i>
      <span :class="{ 'song-item__complexity': true, [complexityClass]: true }" v-html="complexity"></span>
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
            <Chord
              v-for="(chord, key) in sequence"
              :chord="chord"
              :transposeLevel="defaultTransposeLevel - transposeLevel"
              :key="key"
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

      <a target="_blank" :href="song.url">link</a>
    </div>
  </el-collapse-item>
</template>

<style lang="scss">
.song-item {
  &.active {
    margin-bottom: 50px;
  }

  [role="tab"] {
    overflow: hidden;
  }

  [role="button"] {
    display: block;
  }

  .el-collapse-item__arrow {
    display: none;
  }

  &__complexity {
    padding: 2px 4px;
    border-radius: 100%;
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
  }

  .chords {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: #fff;
    padding: 0px;
    box-shadow: 0 0 2px #ccc;

    @media (min-width: 1200px) {
      left: auto;
      box-shadow: none;
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

    defaultTransposeLevel() {
      const transpose = this.song.title.match(
        /\((капо|кап|capo|cap)\.? (\d+)\)/
      );
      return transpose ? transpose[2] * -1 : 0;
    },

    complexity() {
      return this.song.details.complexity || "?";
    },

    complexityClass() {
      const c = this.song.details.complexity || 0;
      if (c == 0) return "song-item__complexity_0";
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
          section.split(" .. ").map(subsection => subsection.split(" "))
        );
    },

    toolbarHidden() {
      return this.$store.state.toolbarHidden;
    }
  }
};
</script>

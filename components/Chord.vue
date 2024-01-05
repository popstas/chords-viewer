<template>
  <span :class="{
    chord: true,
    chord_known: isKnown,
    chord_separator: chord.match(/^[-.]+$/),
    chord_separator_short: chord === '.',
    chord_separator_bracket_left: chord === '(',
    chord_separator_bracket_right: chord === ')'
    }" :data-chord="chord">
    <el-popover v-if="isKnown" placement="top-start" trigger="hover">
      <el-button slot="reference">{{ html }} <img v-if="image" :alt="chord" height="100" class="chord__image" :src="imageUrl"
                                                  slot="default"></el-button>
      <img class="chord__image" :alt="chord" :src="imageUrl" slot="default">
    </el-popover>
    <template v-if="!isKnown">{{ html }}</template>
    <slot></slot>
  </span>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.chord {
  white-space: nowrap;

  &:after {
    content: " ";
  }

  &_known .el-button {
    font-size: $font-size-1;

    .size1 & {
      font-size: $font-size-1;
    }

    .size2 & {
      font-size: $font-size-2;
    }

    .size3 & {
      font-size: $font-size-3;
    }

    display: inline-block;
    color: #000;
    padding: 5px 3px;
    margin: 2px 0;
    border: 1px solid #ededed;

    background: #f9f9f9;
    // highlight even sequence different
    .chords__section:nth-child(even) & {
      background: #ededed;
    }

    min-width: 25px;

    &:hover,
    &:focus {
      background: #ededed;
    }
  }

  &_separator_short {
    margin: 0 -5px;
  }

  &_separator_bracket_left {
    margin-right: -4px;
  }

  &_separator_bracket_right {
    margin-left: -7px;
  }
}

.chord_separator_short + .chord .el-button {
  padding: 5px 1px;
  min-width: auto;
}

.el-popover {
  img {
    max-width: 150px;
    height: auto;
  }
}
</style>

<script>
export default {
  name: "chord",
  props: {
    chord: String,
    transposeLevel: Number,
    image: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    imageUrl() {
      let chord = this.transposedChord;
      switch (this.$store.state.instrument) {
        case 'ukulele':
          chord = this.chordifyReplace(chord);
          return `https://chordify.net/img/diagrams/ukulele/${chord}.png`
        case 'piano':
          chord = this.chordifyReplace(chord);
          return `https://chordify.net/img/diagrams/piano/${chord}.png`
        case 'guitar':
        default:
          chord = this.amdmReplace(chord);
          return `https://cs.amdm.ru/images/chords/${chord}_0.gif`;
      }

    },

    isKnown() {
      return this.$store.getters.isKnownChord(this.chord);
    },

    html() {
      if (!this.isKnown) return this.replacedChord;
      return this.chord.match(/\(.*\)/) ? `(${this.transposedChord})` : this.transposedChord;
      // console.log(this.chord, this.transposeLevel, this.transposedChord, this.replacedChord);
    },

    replacedChord() {
      return this.$store.getters.replacedChord(this.chord);
    },

    transposedChord() {
      return this.$store.getters.transposeChord(this.chord, this.transposeLevel);
    }
  },

  methods: {
    chordifyReplace(chord) {
      const chordifyReplaceMap = {
        '^([ABCDEFG])$': '$1_maj',
        '^([ABCDEFG])5$': '$1_5',
        '^([ABCDEFG])7$': '$1_7',
        '^([ABCDEFG])m$': '$1_min',
        '^([ABCDEFG])m5$': '$1_min5',
        '^([ABCDEFG])m7$': '$1_min7',
        '^([ABCDEFG])#$': '$1s_maj',
        '^([ABCDEFG])#m$': '$1s_min',
        '^A#$': 'Bb_maj',
      }

      for (let from in chordifyReplaceMap) {
        const regFrom = new RegExp(from);
        const to = chordifyReplaceMap[from];
        chord = chord.replace(regFrom, to);
      }
      // console.log(`${o} -> ${chord}`);
      return chord;
    },

    amdmReplace(chord) {
      return chord.replace(/#/g, 'w').replace(/\+/g, 'p').replace(/-/g, 'z');
    }
  }
};
</script>

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
      <template #reference>
        <el-button>{{ html }} <img v-if="image" :alt="chord" height="100" class="chord__image" :src="imageUrl"></el-button>
      </template>
      <img class="chord__image" :alt="chord" :src="imageUrl">
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

    // dark mode: Element Plus' dark .el-button overrides the light chip bg/text,
    // making even-section chips light-on-light (unreadable). Re-assert the light
    // chips with dark text in the floating panel so they match the original.
    .dark-mode .chords & {
      background: #f9f9f9;
      border-color: #ededed;
      color: #000;
    }
    .dark-mode .chords .chords__section:nth-child(even) & {
      background: #ededed;
    }

    // floating panel: compact chips. Element Plus / dark-theme.scss inflate the
    // default .el-button padding to 12px 20px (h≈32, w≈63); keep ~25 tall and
    // 25-27 wide so rows don't overlap. (0,3,0 beats .dark-mode .el-button.)
    .chords & {
      box-sizing: border-box;
      height: 25px;
      min-width: 25px;
      padding: 1px 2px;
      margin: 1px 0;
      line-height: 21px;
      font-size: 14px;
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

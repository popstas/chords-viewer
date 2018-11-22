<template>
  <span :class="{chord: true, chord_known: isKnown, chord_separator: chord.match(/^[-.]+$/)}">
    <el-popover
      v-if="isKnown"
      placement="top-start"
      trigger="hover"
      >
      <el-button slot="reference">{{ html }}</el-button>
      <img class="chord__image" :src="imageUrl" slot="default" />
    </el-popover>
    <template v-if="!isKnown">{{ html }}</template>
    <slot></slot>
  </span>
</template>

<style lang="scss">
.chord {
  white-space: nowrap;
  &:after {
    content: ' ';
  }
  &_known .el-button {
    display: inline-block;
    color: #000;
    padding: 5px 3px;
    margin: 2px 0;
    border: 1px solid #ededed;

    background: #f9f9f9;
    // highlight even sequence different
    .chords__section:nth-child(even) &{
      background: #ededed;
    }

    min-width: 25px;
    &:hover,
    &:focus {
      background: #ededed;
    }
  }
}
</style>

<script>
import { transposeMap } from '~/store';
export default {
  name: 'chord',
  props: ['chord', 'transposeLevel'],

  computed: {
    imageUrl() {
      let chord = this.transposedChord
        .split('#')
        .join('w')
        .split('+')
        .join('p');
      return `https://amdm.ru/images/chords/${chord}_0.gif`;
    },

    isKnown() {
      return transposeMap.find(chain => chain.indexOf(this.replacedChord) != -1) || false;
    },

    html() {
      if (!this.isKnown) return this.replacedChord;
      return this.transposedChord;
      // console.log(this.chord, this.transposeLevel, this.transposedChord, this.replacedChord);
    },

    replacedChord() {
      return this.chord.replace('B', 'H').replace('m#', '#m');
    },

    transposedChord() {
      if (!this.replacedChord || this.transposeLevel == 0) return this.replacedChord;
      let chord = this.replacedChord;

      // find chain
      let chain = transposeMap.find(chain => chain.indexOf(chord) != -1);
      if (!chain) {
        return chord;
      }

      // iterate over chain at this.transposeLevel
      let currentIndex = chain.indexOf(chord);
      for (let i = 0; i < Math.abs(this.transposeLevel); i++) {
        if (this.transposeLevel > 0) {
          currentIndex = currentIndex + 1 >= chain.length ? 0 : currentIndex + 1;
        } else {
          currentIndex = currentIndex - 1 < 0 ? chain.length - 1 : currentIndex - 1;
        }
      }
      return chain[currentIndex];
    }
  },

  methods: {}
};
</script>

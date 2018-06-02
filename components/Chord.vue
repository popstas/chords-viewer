<template>
  <Chord :class="{chord: true, chord__known: isKnown, chord__separator: chord.match(/^[-.]+$/)}">
    <el-popover
      v-if="isKnown"
      placement="top-start"
      trigger="hover"
      >
      <el-button slot="reference">{{ chord }}</el-button>
      <img class="chord-image" :src="imageUrl" slot="default" />
    </el-popover>
    <span v-if="!isKnown">{{ chord }}</span>
  </Chord>
</template>

<style lang="scss">
.chord {
  white-space: nowrap;
  &:after {
    content: " ";
  }
  &__known .el-button {
    display: inline-block;
    color: #000;
    padding: 5px 3px;
    margin: 2px 0;
    border: 1px solid #ededed;
    background: #f9f9f9;
    min-width: 25px;
    &:hover,
    &:focus {
      background: #ededed;
    }
  }
}
</style>

<script>
import { transposeMap } from "~/store";
export default {
  name: "chord",
  props: ["chord"],

  computed: {
    imageUrl() {
      let chord = this.chord
        .split("#")
        .join("w")
        .split("+")
        .join("p");
      return `https://amdm.ru/images/chords/${chord}_0.gif`;
    },

    isKnown() {
      return (
        transposeMap.find(chain => chain.indexOf(this.chord) != -1) || false
      );
    }
  },

  methods: {}
};
</script>

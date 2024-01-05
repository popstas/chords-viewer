<template>
  <div v-if="chords.length > 0" :class="{text: true, item: true, chords: true, chords_images: $store.state.showImages}">
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
</template>

<style lang="scss">
.chords {
  position: fixed;
  z-index: 2;
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
</style>
<script>
import Chord from "~/components/Chord";

export default {
  components: {Chord},

  computed: {
    chords() {
      if (!this.$store.state.activeSong.details) return [];
      // split by ' - ', then by ' .. ', then by ' '
      return this.$store.state.activeSong.details.chords
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
    transposeLevel() {
      return this.$store.state.transposeLevel;
    },
    defaultTransposeLevel() {
      return this.$store.state.defaultTransposeLevel;
    },
  },
};
</script>

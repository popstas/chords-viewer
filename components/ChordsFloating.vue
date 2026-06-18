<template>
  <div v-if="chords.length > 0" :class="{text: true, item: true, chords: true, chords_images: $store.state.showImages}">
    <div class="chords__metronome" v-if="$store.state.beatPlaying">
      <div class="chords__metronome-bar" :style="{width: beatProgress + '%', background: beatProgressColor}"></div>
      <div class="chords__metronome-section" v-for="n in 3" :key="n" :style="{left: n * 25 + '%'}"></div>
    </div>
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
  // mobile: keep chord names + metronome above the sticky app header (z-index 5)
  z-index: 6;
  top: 0;
  left: auto;
  right: 0;
  text-align: right;
  background: none;
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

  // metronome progressbar, mobile only
  &__metronome {
    display: none;

    @media (max-width: 600px) {
      display: block;
      position: fixed;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 8px;
      border-radius: 3px;
      background: var(--bg-hover);
      overflow: hidden;
    }
  }

  &__metronome-bar {
    height: 100%;
  }

  &__metronome-section {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--bg);
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
    beatProgress() {
      return this.$store.state.beatProgress;
    },
    // same colors as BeatPlayer.beatProgressColor
    beatProgressColor() {
      const num = this.beatProgress;
      if (num < 25) return '#409EFF';
      if (num < 50) return 'green';
      if (num < 75) return 'orange';
      return 'red';
    },
    defaultTransposeLevel() {
      return this.$store.state.defaultTransposeLevel;
    },
  },
};
</script>

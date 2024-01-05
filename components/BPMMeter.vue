<template>
  <el-button @click="calculateBPM">{{ bpmCurrent }}</el-button>
</template>

<style scoped lang="scss">

</style>

<script>
const lastLimit = 5;
const minTaps = 4;
const forgetTimeout = 5000;

export default {
  props: ["bpm"],

  data() {
    return {
      lastTaps: [],
      bpmCurrent: 0,
    };
  },

  watch: {
    bpm(val) {
      if (this.bpmCurrent !== val) {
        this.bpmCurrent = val;
      }
    }
  },

  methods: {
    calculateBPM() {
      const now = Date.now();
      this.lastTaps.push(now);
      this.lastTaps = this.lastTaps.slice(-lastLimit);
      if (this.lastTaps.length < minTaps) return;

      const diff = now - this.lastTaps[0];
      if (diff > forgetTimeout) {
        this.lastTaps = [now];
        return;
      }

      const tapDelay = diff / (this.lastTaps.length - 1);
      this.bpmCurrent = Math.round(60000 / tapDelay);
      this.$emit("change", this.bpmCurrent);
    }
  },

  mounted() {
    this.bpmCurrent = this.bpm;
  }
};
</script>


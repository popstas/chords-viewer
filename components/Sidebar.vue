<template>
  <div class="sidebar">
    <el-row><el-switch v-model="withChords" active-text="chords"></el-switch></el-row>
    <el-row><el-switch v-model="withTexts" active-text="texts"></el-switch></el-row>
    <el-row><el-switch v-model="popular" active-text="popular"></el-switch></el-row>
    <el-row><el-switch v-model="sortByDate" active-text="by date"></el-switch></el-row>
    <el-row><el-switch v-model="noSleep" active-text="no sleep"></el-switch></el-row>
  </div>
</template>

<style lang="scss">
.sidebar {
  padding: 10px;

  .el-row {
    margin-bottom: 10px;
  }
}
</style>

<script>
import NoSleep from 'nosleep.js';
const nosleep = new NoSleep();

export default {
  components: {},

  data() {
    return {
      withChords: false,
      withTexts: false,
      popular: false,
      sortByDate: false,
      noSleep: false
    };
  },

  computed: {},

  watch: {
    withChords(val) {
      this.changeFilter('withChords', val);
    },
    withTexts(val) {
      this.changeFilter('withTexts', val);
    },
    popular(val) {
      this.changeFilter('popular', val);
    },
    sortByDate(val) {
      this.changeFilter('sortByDate', val);
    },

    noSleep(val) {
      this.$store.commit('setNoSleep', val);
      val ? nosleep.enable() : nosleep.disable();
    }
  },

  methods: {
    changeFilter(name, value) {
      this.$store.commit('changeFilter', { name, value });
      this.$emit('changeFilter', { name, value });
    }
  },

  mounted() {
    ['withChords', 'withTexts', 'popular', 'sortByDate'].forEach(name => {
      this[name] = this.$store.state.filter[name];
    });
    this.noSleep = this.$store.state.noSleep;
  }
};
</script>

<template>
  <div class="sidebar">
    <el-row style="text-align:center">
      <label>chords:</label>
      <el-radio-group v-model="withChords" size="mini">
        <el-radio-button label="-1">any</el-radio-button>
        <el-radio-button label="1">yes</el-radio-button>
        <el-radio-button label="0">no</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row style="text-align:center">
      <label>texts:</label>
      <el-radio-group v-model="withTexts" size="mini">
        <el-radio-button label="-1">any</el-radio-button>
        <el-radio-button label="1">yes</el-radio-button>
        <el-radio-button label="0">no</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row style="text-align:center">
      <label>popular:</label>
      <el-radio-group v-model="popular" size="mini">
        <el-radio-button label="-1">any</el-radio-button>
        <el-radio-button label="1">yes</el-radio-button>
        <el-radio-button label="0">no</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-switch v-model="sortByDate" active-text="by date"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="noSleep" active-text="no sleep"></el-switch>
    </el-row>
    <el-row style="text-align:center">
      <label>font size:</label>
      <el-radio-group class="sidebar__font-size" v-model="fontSize" size="mini" @change="changeFontSize">
        <el-radio-button label="1"></el-radio-button>
        <el-radio-button label="2"></el-radio-button>
        <el-radio-button label="3"></el-radio-button>
      </el-radio-group>
    </el-row>
  </div>
</template>

<style lang="scss">
.sidebar {
  padding: 10px;

  .el-row {
    margin-bottom: 10px;
  }

  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px;
  }

  // font size radiobuttons
  &__font-size {
    text-align: right;

    .el-radio-button__inner {
      padding: 7px 8px;
    }
  }
}
</style>

<script>
import NoSleep from "nosleep.js";
const nosleep = new NoSleep();

export default {
  components: {},

  data() {
    return {
      withChords: -1,
      withTexts: -1,
      popular: -1,
      sortByDate: false,
      noSleep: false,
      fontSize: 1
    };
  },

  computed: {},

  watch: {
    withChords(val) {
      this.changeFilter("withChords", val);
    },
    withTexts(val) {
      this.changeFilter("withTexts", val);
    },
    popular(val) {
      this.changeFilter("popular", val);
    },
    sortByDate(val) {
      this.changeFilter("sortByDate", val);
    },

    noSleep(val) {
      this.$store.commit("setNoSleep", val);
      val ? nosleep.enable() : nosleep.disable();
    }
  },

  methods: {
    changeFilter(name, value) {
      this.$store.commit("changeFilter", { name, value });
      this.$emit("changeFilter", { name, value });
    },

    changeFontSize(size) {
      this.$store.commit("fontSize", size);
    }
  },

  created() {
    this.fontSize = this.$store.state.fontSize;
  },

  mounted() {
    ["withChords", "withTexts", "popular", "sortByDate"].forEach(name => {
      this[name] = this.$store.state.filter[name];
    });
    this.noSleep = this.$store.state.noSleep;
  }
};
</script>

<template>
  <div class="sidebar">
    <el-row>
      <el-switch v-model="sortByDate" active-text="by date"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="sortByShows" active-text="by shows"></el-switch>
    </el-row>

    <el-divider></el-divider>

    <el-row>
      <el-switch v-model="darkMode" active-text="dark mode"></el-switch>
    </el-row>
    <el-row style="text-align:center">
      <label>font size:</label>
      <el-radio-group class="sidebar__font-size" v-model="fontSize" size="mini" @change="changeFontSize">
        <el-radio-button label="1"></el-radio-button>
        <el-radio-button label="2"></el-radio-button>
        <el-radio-button label="3"></el-radio-button>
      </el-radio-group>
    </el-row>

    <el-divider></el-divider>

    <el-row>
      <el-switch v-model="showImages" active-text="images"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="showBadges" active-text="badges"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="noSleep" active-text="no sleep"></el-switch>
    </el-row>

    <el-divider></el-divider>

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

    <el-divider></el-divider>

    <el-row style="text-align:center">
      <a class="sidebar__link" href="https://github.com/popstas/chords-viewer/blob/master/CHANGELOG.md" target="_blank">
        <icon name="brands/github"></icon>
        {{ $store.state.name }} {{ $store.state.version }} (changelog)
      </a>
    </el-row>
    <el-row style="text-align:center">
      <a class="sidebar__link" href="https://github.com/popstas/chords-data" target="_blank">
        <icon name="calendar-alt"></icon>
        songs updated: {{ $store.getters.lastUpdated }}
      </a>
    </el-row>
    <el-row style="text-align:center">
      <span class="sidebar__help">
        <el-popover placement="top-start" trigger="hover" content="
        j/k, left/right - переключение песен,
        space - автопрокрутка,
        ctrl+up/down - транспонировать">
          <span slot="reference">help</span>
        </el-popover>
      </span>
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
    padding: 7px !important;
  }

  // font size radiobuttons
  &__font-size {
    text-align: right;

    .el-radio-button__inner {
      padding: 7px 8px;
    }
  }

  &__link {
    display: inline-block;
    margin-right: 15px;
    text-decoration: none;
    color: var(--link);
    &:hover {
      color: var(--link-hover);
    }
  }

}
</style>

<script>
import "vue-awesome/icons/brands/github";
import "vue-awesome/icons/calendar-alt";
import Icon from "vue-awesome/components/Icon";

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
      sortByShows: false,
      noSleep: false,
      darkMode: false,
      fontSize: 1,
      showImages: false,
      showBadges: false
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
    sortByShows(val) {
      this.changeFilter("sortByShows", val);
    },

    noSleep(val) {
      this.$store.commit("setNoSleep", val);
      val ? nosleep.enable() : nosleep.disable();
    },

    darkMode(val) {
      this.$store.commit("darkMode", val);
    },

    showImages(val) {
      this.$store.commit("showImages", val);
    },
    showBadges(val) {
      this.$store.commit("showBadges", val);
    }
  },

  methods: {
    changeFilter(name, value) {
      if(name == "sortByDate" && value && this.sortByShows) {
        this.sortByShows = false;
      }
      if(name == "sortByShows" && value && this.sortByShows) {
        this.sortByDate = false;
      }
      this.$store.dispatch("changeFilter", { name, value });
      // this.$emit("changeFilter", { name, value });
    },

    changeFontSize(size) {
      this.$store.commit("fontSize", size);
    }
  },

  created() {
    this.fontSize = this.$store.state.fontSize;
    this.showImages = this.$store.state.showImages;
    this.noSleep = this.$store.state.noSleep;
    this.darkMode = this.$store.state.darkMode;
  },

  mounted() {
    ["withChords", "withTexts", "popular", "sortByDate", "sortByShows"].forEach(name => {
      this[name] = this.$store.state.filter[name];
    });
  }
};
</script>

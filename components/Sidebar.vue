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
    <el-row>
      <el-switch v-model="readerMode" active-text="text only"></el-switch>
    </el-row>
    <el-row style="text-align:center">
      <label>font size:</label>
      <FontSize></FontSize>
    </el-row>

    <el-divider></el-divider>

    <el-row>
      <el-switch v-model="showSize" active-text="sizes"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="showImages" active-text="images"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="showBadges" active-text="badges"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="showShows" active-text="shows"></el-switch>
    </el-row>
    <el-row>
      <el-switch v-model="showBeats" active-text="beats"></el-switch>
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
      <label>comments:</label>
      <el-radio-group v-model="comments" size="mini">
        <el-radio-button label="-1">any</el-radio-button>
        <el-radio-button label="1">yes</el-radio-button>
        <el-radio-button label="0">no</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row style="text-align:center">
      <label>beats:</label>
      <el-radio-group v-model="beats" size="mini">
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
  .font-size .el-radio-group {
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
import FontSize from "~/components/FontSize";
import "vue-awesome/icons/brands/github";
import "vue-awesome/icons/calendar-alt";

import NoSleep from "nosleep.js";

const nosleep = new NoSleep();

export default {
  components: {FontSize},

  data() {
    return {
      // filters
      withChords: -1,
      withTexts: -1,
      comments: -1,
      beats: -1,
      sortByDate: false,
      sortByShows: false,
    };
  },

  computed: {
    noSleep: {
      get() {
        return this.$store.state.noSleep;
      },
      set(val) {
        this.$store.commit("noSleep", val);
      },
    },
    darkMode: {
      get() {
        return this.$store.state.darkMode;
      },
      set(val) {
        this.$store.commit("darkMode", val);
      },
    },
    readerMode: {
      get() {
        return this.$store.state.readerMode;
      },
      set(val) {
        this.$store.commit("readerMode", val);
      },
    },
    showSize: {
      get() {
        return this.$store.state.showSize;
      },
      set(val) {
        this.$store.commit("showSize", val);
      },
    },
    showImages: {
      get() {
        return this.$store.state.showImages;
      },
      set(val) {
        this.$store.commit("showImages", val);
      },
    },
    showBadges: {
      get() {
        return this.$store.state.showBadges;
      },
      set(val) {
        this.$store.commit("showBadges", val);
      },
    },
    showShows: {
      get() {
        return this.$store.state.showShows;
      },
      set(val) {
        this.$store.commit("showShows", val);
      },
    },
    showBeats: {
      get() {
        return this.$store.state.showBeats;
      },
      set(val) {
        this.$store.commit("showBeats", val);
      },
    },
  },

  watch: {
    withChords(val) {
      this.changeFilter("withChords", val);
    },
    withTexts(val) {
      this.changeFilter("withTexts", val);
    },
    comments(val) {
      this.changeFilter("comments", val);
    },
    beats(val) {
      this.changeFilter("beats", val);
    },
    sortByDate(val) {
      this.changeFilter("sortByDate", val);
    },
    sortByShows(val) {
      this.changeFilter("sortByShows", val);
    },

    noSleep(val) {
      val ? nosleep.enable() : nosleep.disable();
    },
  },

  methods: {
    changeFilter(name, value) {
      if (name === "sortByDate" && value && this.sortByShows) {
        this.sortByShows = false;
      }
      if (name === "sortByShows" && value && this.sortByShows) {
        this.sortByDate = false;
      }
      this.$store.dispatch("changeFilter", {name, value});
      // this.$emit("changeFilter", { name, value });
    },
  },

  mounted() {
    ["withChords", "withTexts", "comments", "beats", "sortByDate", "sortByShows"].forEach(name => {
      this[name] = this.$store.state.filter[name];
    });
  }
};
</script>

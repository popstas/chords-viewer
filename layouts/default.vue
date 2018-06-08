<template>
    <div class="container-wrap">
      <el-container>
        <!-- https://github.com/Mango/slideout#user-content-slideoutoptions -->
        <Slideout :toggleSelectors="['.menu-toggle']" panel="#panel" menu="#menu"
            side="left" :padding="130">
          <div id="panel">
            <el-header height="42px">
              <button class="menu-toggle">☰</button>
            </el-header>
            <el-main>
              <nuxt/>
            </el-main>
            <Footer></Footer>
          </div>
        </Slideout>
      </el-container>
      <nav id="menu">
        <Sidebar @changeFilter="$store.dispatch('filterSongs')"></Sidebar>
      </nav>
    </div>
</template>

<style lang="scss">
$max_width: 640px;

.container-wrap {
  margin: 0 auto;
  max-width: $max_width;
  background: #fff;
  position: relative;
}

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.el-main {
  padding: 5px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.el-header {
  padding: 0 5px;
  .menu-toggle {
    background: none;
    border: none;
    line-height: 42px;
    outline: none;
  }
}
.slideout-menu {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 130px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;

  &-left {
    left: 0;
  }
  &-right {
    right: 0;
  }

  .slideout-open & {
    display: block;
  }
}

.slideout-panel {
  position: relative;
  z-index: 1;
  // will-change: transform; - it breaks position: fixed
  min-height: 100vh;
  background: #fff;

  .slideout-open & {
    overflow: hidden;
  }
}
</style>

<script>
import Footer from "~/components/Footer";
import Sidebar from "~/components/Sidebar";
import Slideout from "vue-slideout";

export default {
  components: { Footer, Slideout, Sidebar },
  computed: {
    title() {
      return (
        (this.$store.state.activeSong.title
          ? this.$store.state.activeSong.title + " - "
          : "") + this.$store.state.name
      );
    }
  },
  head() {
    return {
      title: this.title
      /* meta: {
        name: "mobile-web-app-capable",
        content: "yes"
      } */
    };
  }
};
</script>

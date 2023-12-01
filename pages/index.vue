<template>
  <div>
    <div v-if="!activeSong.url">
      <div class="search-total">total: {{ count }}</div>
      <Toolbar @scrollToLast="scrollTo(lastOffset)"></Toolbar>
    </div>
    <ChordsFloating></ChordsFloating>
    <PlayerFloating></PlayerFloating>
    <SongList></SongList>
  </div>
</template>

<style>
</style>

<script>
import Toolbar from "~/components/Toolbar";
import PlayerFloating from "~/components/PlayerFloating";
import SongList from "~/components/SongList";
import ChordsFloating from "~/components/ChordsFloating";
export default {
  components: {
    Toolbar,
    SongList,
    ChordsFloating,
    PlayerFloating,
  },
  computed: {
    count() {
      return this.$store.state.filteredSongs.length;
    },
    activeSong() {
      return this.$store.state.activeSong;
    },
  },
};
</script>

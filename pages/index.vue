<template>
  <div>
    <div v-if="!activeSong.url">
      <div class="search-total">total: {{ count }}</div>
      <Toolbar @scrollToLast="scrollTo(lastOffset)"></Toolbar>
    </div>
    <ChordsFloating></ChordsFloating>
    <PlayerFloating></PlayerFloating>
    <div v-if="!activeSong.url && isTest">
      <BeatPlayer :beat="{name: 'loop-2-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'loop-10-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-1-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-2-tum-tum-tsh-ts-100-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-3-not-angels-72-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-4-pachka-90-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-5-tum-tum-tsh-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-6-vyhoda-net-85-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-7-gruppa-krovi-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-8-tum-tsh-120-bpm'}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-9-slow-tum-tsh--tum-tum-tsh-85-bpm'}"></BeatPlayer>
    </div>
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
import BeatPlayer from "~/components/BeatPlayer";
export default {
  components: {
    Toolbar,
    SongList,
    ChordsFloating,
    PlayerFloating,
    BeatPlayer,
  },
  computed: {
    count() {
      return this.$store.state.filteredSongs.length;
    },
    isTest() {
      return location.host.includes("3001");
    },
    activeSong() {
      return this.$store.state.activeSong;
    },
  },
};
</script>

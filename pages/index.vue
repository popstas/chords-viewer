<template>
  <div>
    <div v-if="!activeSong.url">
      <div class="search-total">total: {{ count }}</div>
      <Toolbar @scrollToLast="scrollTo(lastOffset)"></Toolbar>
    </div>
    <ChordsFloating></ChordsFloating>
    <PlayerFloating></PlayerFloating>
    <div v-if="!activeSong.url && isTest">
      <BeatPlayer :beat="{name: 'simple-13-tum-tum-100-bpm', bpm: 240}" :rever="false"></BeatPlayer>
      <BeatPlayerAll :bpm="100" :rever="true"></BeatPlayerAll>
      <!-- <BeatPlayer :beat="{name: 'simple-1-120-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-2-tum-tum-tsh-ts-100-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-3-not-angels-72-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-4-rock-slow-tum-tsh--tum-tum-tsh-90-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-4-rock-slow-tum-tsh--tum-tum-tsh-90-bpm', bpm: 120}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-5-tum-tum-tsh-120-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-6-vyhoda-net-85-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-7-rock-tum-tsh-120-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-8-tum-tsh-120-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-9-slow-tum-tsh--tum--tum-tsh-85-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-10-hard-rap-85-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-11-rock-tum-tsh--tum-tum-tsh-100-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-12-tum-tsh-100-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-13-tum-tum-100-bpm', bpm: 140}"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-15-rap-vydyhay-100-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'simple-23-rock-fast-tum-tsh-tum-tum-tsh-102-bpm'}" :rever="true"></BeatPlayer>
      <BeatPlayer :beat="{name: 'piano-em-c-d-hm', bpm: 100}" :rever="true" :piano="true" chords="Em C D Hm"></BeatPlayer>
      <BeatPlayer :beat="{name: 'piano Em Hm G D', bpm: 120}" :rever="true" :piano="true" chords="Em Hm G D"></BeatPlayer>
      <BeatPlayer :beat="{name: 'piano Am F C E', bpm: 100}" :rever="true" :piano="true" chords="Am F C E"></BeatPlayer>
      <BeatPlayer :beat="{name: 'piano Em G D C', bpm: 100}" :rever="true" :piano="true" chords="Em G D C"></BeatPlayer> -->
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
import BeatPlayerAll from "~/components/BeatPlayerAll";
export default {
  components: {
    Toolbar,
    SongList,
    ChordsFloating,
    PlayerFloating,
    BeatPlayer,
    BeatPlayerAll,
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
    lastOffset: {
      get() {
        return this.$store.state.lastOffset;
      },
      set(value) {
        this.$store.commit('lastOffset', value);
      },
    },
  },
  methods: {
    scrollTo(offset) {
      console.log('toolbar scrollTo: ', offset);
      this.lastOffset = offset;
      const fixedTopOffset = 0;
      window.scrollTo(0, offset - fixedTopOffset);
    },
  }
};
</script>

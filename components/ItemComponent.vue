<template>
  <el-collapse accordion @change="changeSong" :value="activeSong.url">
    <SongItem
      :song="source"
      :key="source.url"
      :active="source.url == activeSong.url"
      @active="scrollTo"
      @change="changeSong(source.url == activeSong.url ? '' : source.url)"
    ></SongItem>
  </el-collapse>
</template>

<script>
import SongItem from "~/components/SongItem";
  export default {
    name: 'item-component',
    components: {
      SongItem,
    },
    computed: {
      activeSong() {
        return this.$store.state.activeSong;
      },
      lastOffset: {
        get() {
          return this.$store.state.lastOffset;
        },
        set(value) {
          this.$store.dispatch('lastOffset', value);
        },
      },
    },
    props: {
      index: { // index of current item
        type: Number
      },
      source: { // here is: {uid: 'unique_1', text: 'abc'}
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      activeSong(song) {
        if (!song) return;
        const query = { url: song.url };
        this.$router.push({ query });

        clearTimeout(this.showTimer);
        this.showTimer = setTimeout(() => {
          if (!song.url) return; // fix empty song addShow error
          const safeUrl = song.url.replace(/[\/\.]/g, '_');
          this.$store.dispatch("addShow", safeUrl);
        }, 60000);
      },
    },
    methods: {
      changeSong(url) {
        this.$store.dispatch('changeSong', url);
      },

      scrollTo(offset) {
        this.lastOffset = offset;
        const fixedTopOffset = 0;
        window.scrollTo(0, offset - fixedTopOffset);
      }
    },
  }
</script>
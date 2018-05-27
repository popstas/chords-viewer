<template>
  <div>
    <SearchInput v-model="q"></SearchInput>
    total: {{ count }}
    <el-collapse accordion>
      <SongItem v-for="song in filteredSongs" :song="song" :key="song.url"></SongItem>
    </el-collapse>
  </div>
</template>

<script>
import SearchInput from '~/components/SearchInput'
import SongItem from '~/components/SongItem'
import songs from '~/chords.json'
export default {
  components: {
    SongItem,
    SearchInput,
  },
  data(){
    return {
      q: '',
      filteredSongs: [],
    }
  },
  /* async asyncData({app, store, params, query, error}) {
    let asyncData;
    try {
      asyncData = {
        songs: await app.$axios.$get('http://test.home.popstas.ru/chords.json'),
      };
      // store.commit('songs', asyncData.songs);
    }
    catch (e) {
      console.log('error while get data');
      throw Error(e)
    }
    console.log('got songs');
    return asyncData;
  }, */
  computed: {
    count() {
      console.log('count');
      return this.filteredSongs.length
    }
  },
  watch: {
    q(){
      this.filterSongs()
    }
  },
  methods: {
    filterSongs(){
      console.log('filterSongs')
      const q = this.q.toLowerCase()
      let result = songs
      if (q) {
        result = result.filter(song => {
          return (
            song.title.toLowerCase().search(q) >= 0 ||
            (song.text && song.text.toLowerCase().search(q) >= 0)
          )
        })
      }
      console.log(result);
      this.filteredSongs = result
    }
  },
  created: function() {
    this.filterSongs()
  }
}
</script>

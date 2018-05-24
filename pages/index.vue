<template>
  <div>
    <SongList :songs="songs"></SongList>
  </div>
</template>

<style>
</style>

<script>
import SongList from '~/components/SongList'
export default {
  components: {
    SongList
  },
  async asyncData({app, store, params, query, error}) {
    let asyncData;
    try {
      asyncData = {
        songs: await app.$axios.$get('http://test.home.popstas.ru/chords.json'),
      };
      store.commit('songs', asyncData.songs);
    }
    catch (e) {
      console.log('error while get data');
      throw Error(e)
    }
    return asyncData;
  },
}
</script>

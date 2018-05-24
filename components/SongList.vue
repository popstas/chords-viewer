<template>
  <div>
    total: {{ count }}
    <el-collapse>
      <SongItem v-for="song in songs" :song="song" :key="song.url"></SongItem>
    </el-collapse>
  </div>
</template>

<script>
import SongItem from '~/components/SongItem'
export default {
  components: {
    SongItem
  },
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  computed: {
    count() {
      return this.songs.length
    }
  }
}
</script>

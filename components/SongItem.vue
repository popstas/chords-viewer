<template>
  <el-collapse-item :title="title" :name="song.url">
    <div class="text item">
      {{ song.details.chords }}
    </div>
    <pre>{{ song.html }}</pre>
    <a target="_blank" :href="song.url">link</a>
  </el-collapse-item>
</template>

<style>
.el-collapse-item{ overflow: hidden; }
</style>

<script>
export default {
  props: ['song'],
  computed: {
    title(){
      if(this.song.details.title){
        return this.song.details.artist + ' - ' + this.song.details.title
      } else {
        return this.song.title
      }
    }
  }
}
</script>

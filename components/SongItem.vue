<template>
  <el-collapse-item :title="title" :name="song.url">
    <template slot="title">
      {{ title }}
      <i v-if="song.text" class="el-icon-tickets"></i>
      <i v-if="song.details.chords" class="el-icon-check"></i>
    </template>
    <div class="text item chords">
      {{ song.details.chords }}
    </div>
    <pre>{{ song.text }}</pre>
    <a target="_blank" :href="song.url">link</a>
  </el-collapse-item>
</template>

<style>
.el-collapse-item{ overflow: hidden; }
.chords{
  position: fixed; top: 0; left: 0; right: 0;
  text-align: center; background: #fff; padding: 5px; box-shadow: 0 0 2px #ccc;
}
</style>

<script>
export default {
  props: ['song'],
  computed: {
    title(){
      let title = this.song.title
      if(this.song.details.title){
        title = this.song.details.artist + ' - ' + this.song.details.title
      }
      title = title.trim(',');
      return title
    }
  }
}
</script>

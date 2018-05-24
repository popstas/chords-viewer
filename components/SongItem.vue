<template>
  <el-collapse-item :title="song.title" :name="song.url">
    <el-card class="box-card">
      <div class="text item">
        {{ song.details.chords }}
      </div>
      <pre>{{ song.html }}</pre>
      <a target="_blank" :href="song.url">link</a>
    </el-card>
  </el-collapse-item>
</template>

<script>
export default {
  props: ['song']
}
</script>

<template>
  <span class="font-size" v-if="showSize">
    <el-radio-group v-model="fontSize" size="small">
      <el-radio-button class="font-size1" value="1">1</el-radio-button>
      <el-radio-button class="font-size2" value="2">2</el-radio-button>
      <el-radio-button class="font-size3" value="3">3</el-radio-button>
    </el-radio-group>
  </span>
</template>

<style lang="scss">
@use "@/assets/variables.scss" as *;

.font-size1 .el-radio-button__inner {
  font-size: $font-size-1 !important;
}

.font-size2 .el-radio-button__inner {
  font-size: $font-size-2 !important;
}

.font-size3 .el-radio-button__inner {
  font-size: $font-size-3 !important;
}
</style>

<script>
export default {
  computed: {
    showSize() {
      return this.$store.state.showSize;
    },
    fontSize: {
      get() {
        return this.$store.state.fontSize;
      },
      set(val) {
        this.$store.commit("fontSize", val);
      }
    }
  },
};
</script>

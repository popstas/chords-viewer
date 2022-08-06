<template>
  <span class="font-size">
    <el-radio-group v-model="fontSize" size="mini">
      <el-radio-button style="font-size1" label="1"></el-radio-button>
      <el-radio-button class="font-size2" label="2"></el-radio-button>
      <el-radio-button class="font-size3" label="3"></el-radio-button>
    </el-radio-group>
  </span>
</template>

<style lang="scss">
@import "@/assets/variables.scss";
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

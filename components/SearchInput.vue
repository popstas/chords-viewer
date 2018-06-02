<template>
  <el-input popper-class="my-input" v-model="q" clearable></el-input>
</template>

<script>
export default {
  props: {
    value: {
      default: ""
    }
  },

  data() {
    return { q: this.value };
  },

  watch: {
    value(val) {
      this.q = val;
    },

    q(val) {
      this.$emit("input", val);
    }
  }
};
</script>

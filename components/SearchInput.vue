<template>
  <div class="search-input">
    <input v-model="q" v-shortkey.avoid/>
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <a
          :class="{'search-input__amdm-search':true}"
          v-if="q"
          :href="'https://amdm.ru/search/?q=' + encodeURIComponent(q)"
          target="_blank"
        >
          <span class="search-input__amdm-search-text">amdm.ru</span>
        </a>
      </span>
    </span>
  </div>
</template>

<style lang="scss">
.search-input {
  display: inline-block;
  width: 100%;
  font-size: 14px;
  position: relative;

  input {
    display: inline-block;
    width: 100%;
    padding: 0 30px 0 15px;
    border-radius: 4px;
    border: 1px solid var(--bg-hover);
    color: var(--link);
    height: 40px;
    line-height: 40px;

    &:hover {
      border-color: #c0c4cc;
    }

    &:focus {
      border-color: #409eff;
      outline: 0;
    }
  }

  &__amdm-search {
    border: none;
    background: none;
    position: absolute;
    right: 37px;
    top: 0;
    bottom: 0;
    line-height: 40px;
    outline: none;
    cursor: pointer;
    text-decoration: none;

    &:hover .search-input__amdm-search-text {
      background: var(--bg-hover);
    }

    &-text {
      padding: 2px 4px;
      background: var(--bg);
      border-radius: 2px;
      color: var(--link);
      font-size: 10px;
    }
  }
}
</style>

<script>

export default {
  props: {
    modelValue: {
      default: ""
    }
  },
  emits: ["update:modelValue"],

  data() {
    return {
      q: this.modelValue
    };
  },

  watch: {
    modelValue(val) {
      this.q = val;
    },

    q(val) {
      this.$emit("update:modelValue", val);
    }
  }
};
</script>

<template>
  <el-footer>
    <div class="app-version">{{ name }} version: {{ version }}</div>
    <a class="app-link" :href="homepage" target="_blank"><icon name="brands/github"></icon> Github</a>
  </el-footer>
</template>

<style>
.el-footer {
  padding: 0 5px;
}
.app-link {
  text-decoration: none;
  color: #000;
}
</style>

<script>
import pjson from "~/package.json";
import "vue-awesome/icons/brands/github";
import Icon from "vue-awesome/components/Icon";

export default {
  data() {
    return {
      version: pjson.version,
      name: pjson.name,
      description: pjson.description,
      homepage: pjson.homepage
    };
  }
};
</script>

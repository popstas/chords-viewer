<template>
  <el-footer class="footer">
    <a class="footer__link" :href="$store.state.homepage" target="_blank">
      <icon name="brands/github"></icon>
      {{ $store.state.name }} {{ $store.state.version }}
    </a>
    <a class="footer__link" href="https://github.com/popstas/chords-data" target="_blank">
      <icon name="calendar-alt"></icon>
      songs updated: {{ $store.getters.lastUpdated }}
    </a>
    <span class="footer__help">
      <el-popover
        placement="top-start"
        trigger="hover"
        content="Hotkeys: j/k, arrows, space"
      >
        <span slot="reference">help</span>
      </el-popover>
    </span>
  </el-footer>
</template>

<style lang="scss">
.footer {
  padding: 30px 5px 0;
  &__link {
    display: inline-block;
    margin-right: 15px;
    text-decoration: none;
    color: #333;
    &:hover {
      color: #666;
    }
  }
  .app-updated {
    margin-left: 20px;
  }
}
</style>

<script>
import 'vue-awesome/icons/brands/github';
import 'vue-awesome/icons/calendar-alt';
import Icon from 'vue-awesome/components/Icon';

export default {};
</script>

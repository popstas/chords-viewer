<template>
  <span v-if="isDesktop" class="text2json">
    <a class="sidebar__link text2json__link" @click.prevent="dialogVisible = true">
      <icon name="code"></icon>
      text → json
    </a>

    <el-dialog
      v-model="dialogVisible"
      title="Text → JSON"
      width="600px"
      append-to-body
    >
      <div class="text2json__body">
        <label class="text2json__label">Text</label>
        <el-input
          v-model="text"
          type="textarea"
          :rows="8"
          placeholder="Вставьте текст"
        ></el-input>

        <el-button type="primary" class="text2json__convert" @click="convert">Convert</el-button>

        <label class="text2json__label">JSON</label>
        <el-input
          v-model="json"
          type="textarea"
          :rows="8"
          readonly
          placeholder='"..."'
        ></el-input>

        <el-button class="text2json__copy" @click="copyJson">Copy to clipboard</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<style lang="scss">
.text2json {
  &__link {
    cursor: pointer;
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__label {
    margin-bottom: 4px;
    font-weight: bold;
  }

  &__convert {
    margin: 10px 0;
    align-self: flex-start;
  }

  &__copy {
    margin-top: 10px;
    align-self: flex-start;
  }
}
</style>

<script>
import copy from "copy-to-clipboard";

export default {
  data() {
    return {
      isDesktop: false,
      dialogVisible: false,
      text: "",
      json: "",
    };
  },

  methods: {
    convert() {
      this.json = JSON.stringify(this.text.trim());
    },

    copyJson() {
      copy(this.json);
    },
  },

  mounted() {
    // desktop only
    this.isDesktop = window.innerWidth > 768;
  },
};
</script>

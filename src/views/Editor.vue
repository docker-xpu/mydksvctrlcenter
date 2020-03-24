<template>
  <div>
    <Row :gutter="20">
      <Col span="18">
        <Card shadow :padding="0">
          <div style="text-align: center">
            <h2>
              <Icon type="ios-play"></Icon>
              <br>
              i - Code
            </h2>

            <label>文件名：
              <Input v-model="codeName" type="text" style="width: 200px"></Input>
            </label>
            <Button icon="ios-send" type="primary" @click="handleSaveCodeBtnClick">保存此代码</Button>

            <br>

            <Select placeholder="代码高亮显示" style="width: 200px" @on-change="handleModeChange">
              <Option v-for="item in modes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Select placeholder="背景颜色" style="width: 200px" @on-change="handleSelectTheme">
              <Option v-for="item in themes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Select placeholder="快捷键" style="width: 150px" @on-change="handleKeyMapChange">
              <Option v-for="item in keyMaps" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>

          <textarea ref="editor"></textarea>
        </Card>
      </Col>

      <Col span="6">
        <CloudFiles></CloudFiles>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {codemirror} from 'vue-codemirror';
  import {saveCode} from '../api/utils';
  import CloudFiles from "../components/Editor/CloudFiles";

  let CodeMirror = require("codemirror/lib/codemirror");

  require('codemirror/keymap/vim.js');
  require('codemirror/keymap/sublime.js');
  require('codemirror/keymap/emacs.js');

  require('codemirror/addon/selection/active-line');

  require("codemirror/mode/python/python.js");
  require("codemirror/mode/vue/vue.js");
  require("codemirror/mode/go/go.js");
  require("codemirror/mode/lua/lua.js");
  require("codemirror/mode/markdown/markdown.js");
  require("codemirror/mode/nginx/nginx.js");
  require("codemirror/mode/ruby/ruby.js");
  require("codemirror/mode/rust/rust.js");
  require("codemirror/mode/sql/sql.js");
  require("codemirror/mode/vb/vb.js");
  require("codemirror/mode/yaml/yaml.js");
  require("codemirror/mode/xml/xml.js");
  require("codemirror/mode/php/php.js");

  require('codemirror/addon/fold/foldcode.js');
  require('codemirror/addon/fold/foldgutter.js');
  require('codemirror/addon/fold/brace-fold.js');
  require('codemirror/addon/fold/xml-fold.js');
  require('codemirror/addon/fold/indent-fold.js');
  require('codemirror/addon/fold/markdown-fold.js');
  require('codemirror/addon/fold/comment-fold.js');

  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/sql-hint");

  require('codemirror/theme/3024-night.css');
  require('codemirror/theme/3024-day.css');
  require('codemirror/theme/darcula.css');
  require('codemirror/theme/dracula.css');
  require('codemirror/theme/eclipse.css');
  require('codemirror/theme/idea.css');
  require('codemirror/theme/material.css');
  require('codemirror/theme/material-darker.css');

  export default {
    name: "Editor",
    components: {CloudFiles, codemirror},
    data() {
      return {
        content: [],
        codeName: 'a.txt',
        themes: [
          {value: 'material', label: 'material'},
          {value: 'material-darker', label: 'material-darker'},
          {value: '3024-night', label: '3024-night'},
          {value: '3024-day', label: '3024-day'},
          {value: 'darcula', label: 'darcula'},
          {value: 'dracula', label: 'dracula'},
          {value: 'eclipse', label: 'eclipse'},
          {value: 'idea', label: 'idea'},
        ],
        modes: [
          {value: 'php', label: 'php'},
          {value: 'python', label: 'python'},
          {value: 'javascript', label: 'javascript'},
          {value: 'vue', label: 'vue'},
          {value: 'go', label: 'go'},
          {value: 'lua', label: 'lua'},
          {value: 'markdown', label: 'markdown'},
          {value: 'nginx', label: 'nginx'},
          {value: 'ruby', label: 'ruby'},
          {value: 'rust', label: 'rust'},
          {value: 'sql', label: 'sql'},
          {value: 'vb', label: 'vb'},
          {value: 'yaml', label: 'yaml'},
          {value: 'xml', label: 'xml'},
        ],
        keyMaps: [
          {value: 'vim', label: 'vim'},
          {value: 'sublime', label: 'sublime'},
          {value: 'emacs', label: 'emacs'},
        ],
        editor: {},
      }
    },
    mounted() {
      this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
        mode: 'python',//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        tabSize: 4,
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        extraKeys: {'Ctrl': 'autocomplete'},//ctrl可以弹出选择项
        styleActiveLine: true
      });
      this.editor.on('changes', () => {
        this.content = [];
        for (let i = 0; i < this.editor.doc.children[0].lines.length; ++i) {
          this.content.push(this.editor.doc.children[0].lines[i].text)
        }
      });
      this.editor.on('onchange', () => {
        this.editor.showHint()
      });
    },
    methods: {
      handleSelectTheme(val) {
        // this.$refs.editor.setOption("theme", name);
        this.editor.setOption("theme", val);
      },
      handleModeChange(val) {
        this.editor.setOption("mode", val);
      },
      handleKeyMapChange(val) {
        this.editor.setOption("keyMap", val);
      },

      // 保存代码到中心服务器
      handleSaveCodeBtnClick() {
        saveCode({
          filename: this.codeName,
          code: this.content
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            this.$store.dispatch('getAllFiles');
          }
        });
      },
    }
  }
</script>

<style scoped>
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>

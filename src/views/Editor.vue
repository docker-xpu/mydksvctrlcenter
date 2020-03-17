<template>
  <div>
    <label>
      <span style="font-weight: 700; font-size: 20px">主题颜色：</span>
      <Button v-for="(item, index) in themes" :key="index" @click="selectTheme(item)">
        {{item}}
      </Button>
    </label>

    <textarea ref="editor"></textarea>
  </div>
</template>

<script>
  import {codemirror} from 'vue-codemirror';
  let CodeMirror = require("codemirror/lib/codemirror");

  require("codemirror/mode/python/python.js");
  require('codemirror/addon/fold/foldcode.js');
  require('codemirror/addon/fold/foldgutter.js');
  require('codemirror/addon/fold/brace-fold.js');
  require('codemirror/addon/fold/xml-fold.js');
  require('codemirror/addon/fold/indent-fold.js');
  require('codemirror/addon/fold/markdown-fold.js');
  require('codemirror/addon/fold/comment-fold.js');

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
    components: {codemirror},
    data() {
      return {
        content: [],
        themes: [
          'material',
          'material-darker',
          '3024-night',
          '3024-day',
          'darcula',
          'dracula',
          'eclipse',
          'idea',
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
      });
      this.editor.on('changes', () =>{
        this.content = [];
        for (let i = 0; i < this.editor.doc.children[0].lines.length; ++i) {
          this.content.push(this.editor.doc.children[0].lines[i].text)
        }
      });
    },
    methods: {
      selectTheme(name) {
        // this.$refs.editor.setOption("theme", name);
        this.editor.setOption("theme",name);
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

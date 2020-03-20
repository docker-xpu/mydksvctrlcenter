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
          </div>

          <textarea ref="editor"></textarea>

          <Divider>
            主题颜色
          </Divider>
          <div style="text-align: center">
            <Button type="text" v-for="(item, index) in themes" :key="index" @click="selectTheme(item)">
              {{item}}
            </Button>
          </div>
        </Card>
      </Col>

      <Col span="6">
        <Card title="现有代码" :padding="0" style="width: 300px;">
          <CellGroup>
            <Cell v-for="(item, index) in $store.state.files" :title="item.name">
              <div slot="extra">
                <Button type="text" style="color: dodgerblue" @click="handleFileDetailBtnClick(item)">详情</Button>
                <Button type="text" style="color: red" @click="handleFileRemoveBtnClick(item)">删除</Button>
              </div>
              <div slot="label">
                更新：{{item.uploadDateStr}}
              </div>
            </Cell>
          </CellGroup>
          <Upload action="//tim.natapp1.cc/images/upload" :on-success="handleUploadSuccess">
            <Button long icon="ios-cloud-upload" type="primary">上传文件</Button>
          </Upload>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {codemirror} from 'vue-codemirror';
  import {saveCode} from '../api/utils';

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
        codeName: 'a.txt',
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
      this.editor.on('changes', () => {
        this.content = [];
        for (let i = 0; i < this.editor.doc.children[0].lines.length; ++i) {
          this.content.push(this.editor.doc.children[0].lines[i].text)
        }
      });

      // 获取文件列表
      this.$store.dispatch('getAllFiles');
    },
    methods: {
      selectTheme(name) {
        // this.$refs.editor.setOption("theme", name);
        this.editor.setOption("theme", name);
      },

      // 查看文件详情
      handleFileDetailBtnClick(item) {
        this.$Modal.info({
          title: `${item.id}`,
          content: `文件名：${item.name}<br>
            大小：${item.sizeStr}<br>
            校验：${item.md5}<br>
            更新时间：${item.uploadDateStr}`
        });
      },
      // 删除一个文件
      handleFileRemoveBtnClick(item) {
        this.$Modal.confirm({
          title: '确定这么做吗？',
          content: `删除文件：${item.name}`,
          onOk: () => {
            this.$store.dispatch('removeFile', {id: item.id});
          }
        });
      },
      // 上传文件成功
      handleUploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          this.$Message.success(res.msg);
          this.$store.dispatch('getAllFiles');
        }
      },
      // 保存代码到中心服务器
      handleSaveCodeBtnClick() {
        saveCode({
          filename: this.codeName,
          code: this.content
        }).then(res=>{
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

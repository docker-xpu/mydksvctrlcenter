<template>
  <div>
    <Card title="CloudFiles" :padding="0" style="width: 300px;">
      <Spin size="large" fix v-if="$store.state.showSpin"></Spin>
      <CellGroup>
        <Cell v-for="(item, index) in $store.state.files" :title="item.name">
          <div slot="extra">
            <ButtonGroup>
              <Button size="small" type="text" style="color: dodgerblue"
                      @click="handleFileDetailBtnClick(item)">详情
              </Button>
              <Button size="small" type="text" style="color: green"
                      @click="handleDispatchFile(item)">分发
              </Button>
              <Button size="small" type="text" style="color: red"
                      @click="handleFileRemoveBtnClick(item)">删除
              </Button>
            </ButtonGroup>
          </div>
          <div slot="label">
            更新：{{item.uploadDateStr}}
          </div>
        </Cell>
      </CellGroup>
      <Upload type="drag" multiple action="//tim.natapp1.cc/images/upload" :on-success="handleUploadSuccess">
        <Button icon="ios-cloud-upload" size="large" long type="primary">上传文件（支持拖拽上传）</Button>
      </Upload>
    </Card>

    <Modal v-model="showDispatchModal" :title="'将文件 ' + dispatchFile.name + ' 分发至主机'">
      <Form v-model="dispatchForm" :label-width="100">
        <FormItem label="选择主机：">
          <Select v-model="dispatchForm.selectedHosts" multiple>
            <Option v-for="(item, index) in $store.state.hosts"
                    :value="item.hostIp" :key="index">{{ item.hostIp }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="宿主机路径：">
          <Input type="text" v-model="dispatchForm.path" placeholder="例如：/root/bin"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="doDispatchFile">分发</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {dispatchFile2Hosts} from '../../api/host';

  export default {
    name: "CloudFiles",
    data() {
      return {
        showDispatchModal: false,
        dispatchFile: {},

        dispatchForm: {
          selectedHosts: [],
          path: '',
          fileId: '',
        },
      }
    },
    methods: {
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

      // 分发文件到主机
      handleDispatchFile(item) {
        this.dispatchFile = item;
        this.showDispatchModal = true;
        this.dispatchForm.fileId = item.id;
      },
      // 分发文件
      doDispatchFile() {
        console.log(this.dispatchForm);
        dispatchFile2Hosts({
          ips: this.dispatchForm.selectedHosts,
          path: this.dispatchForm.path,
          fileId: this.dispatchForm.fileId
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
    },
    mounted() {
      // 获取文件列表
      this.$store.dispatch('getAllFiles');
      // 获取主机列表
      this.$store.dispatch("getAllHost");
    },
  }
</script>

<style scoped>

</style>

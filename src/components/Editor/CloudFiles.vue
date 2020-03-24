<template>
  <div>
    <Card title="现有" :padding="0" style="width: 300px;">
      <CellGroup>
        <Cell v-for="(item, index) in $store.state.files" :title="item.name">
          <div slot="extra">
            <ButtonGroup>
              <Button size="small" type="text" style="color: dodgerblue" @click="handleFileDetailBtnClick(item)">详情</Button>
              <Button size="small" type="text" style="color: red" @click="handleFileRemoveBtnClick(item)">删除</Button>
            </ButtonGroup>
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
  </div>
</template>

<script>
  export default {
    name: "CloudFiles",
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
    },
    mounted() {
      // 获取文件列表
      this.$store.dispatch('getAllFiles');
    },
  }
</script>

<style scoped>

</style>

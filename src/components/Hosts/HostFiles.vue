<template>
  <div>
    <Button type="primary" long size="large" @click="showHostFiles = true">主机文件</Button>

    <Drawer v-model="showHostFiles" draggable title="主机文件" placement="left">
      <Card :padding="0">
        <Input v-model="hostFiles.name" @on-enter="handleHostFilesChange(hostFiles.name)"></Input>
        <CellGroup>
          <Cell v-for="(item, index) in hostFiles.children" :key="index" :title="item.name">
            <div slot="label">
              {{item.size}}
            </div>
            <div slot="extra">
              <Icon :type="item.is_dir ? 'md-folder':'md-paper'"></Icon>
            </div>
          </Cell>
        </CellGroup>
      </Card>
    </Drawer>
  </div>
</template>

<script>
  import {listHostFiles} from "../../api/host";

  export default {
    name: "HostFiles",
    props: ['hostIp'],
    data() {
      return {
        hostFiles: {},
        showHostFiles: false,
      }
    },
    mounted() {
      this.handleHostFilesChange();
    },
    methods: {
      // 改变浏览的目录
      handleHostFilesChange(path = '/root') {
        listHostFiles({
          ip: this.hostIp,
          path: path
        }).then(res => {
          if (res.status === 0) {
            this.hostFiles = res.data;
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>

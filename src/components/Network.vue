<template>
  <div>
    <Button type="primary" long @click="showNetworkInfo = true">网络信息</Button>

    <Modal v-model="showNetworkInfo" :title="'主机 ' + ip + ' 的网络信息'">
      <CellGroup>
        <Cell v-for="(item, index) in networks" :title="item.Name">
          <div slot="label">创建于{{new Date(item.Created).toLocaleDateString()}}</div>
          <div slot="extra">
            <ButtonGroup>
              <Button size="small" type="primary" @click="handleShowNetWorkDetail(item)">详情</Button>
              <Button size="small" type="error" ghost @click="handleRemoveNetwork(item)">删除</Button>
            </ButtonGroup>
          </div>
        </Cell>
      </CellGroup>

      <div slot="footer">
        <Button type="primary" size="large" ghost @click="showCreateNetworkModal = true">创建一个</Button>
        <Button type="primary" size="large" @click="showNetworkInfo = false">好的</Button>
      </div>
    </Modal>

    <Modal v-model="showCreateNetworkModal" title="创建一个专用网络">
      <span style="color: gray">目前支持 bridge 网络模式</span>
      <Form>
        <FormItem>
          <label>网络名：
            <Input v-model="name" placeholder="例如：xxx专用"></Input>
          </label>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="handleAddNetwork">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {createNetwork, listNetwork, removeNetwork} from '../api/network';

  export default {
    name: "Network",
    props: [
      'ip'
    ],
    data() {
      return {
        networks: [],
        showNetworkInfo: false,
        showCreateNetworkModal: false,
        name: '',
      }
    },
    methods: {
      handleShowNetWorkDetail(item) {
        console.log(item);
        this.$Modal.info({
          title: item.Name,
          content: `创建时间：${new Date(item.Created).toLocaleDateString()}<br>
                作用域：${item.Scope}<br>
                模式：${item.Driver}<br>
                子网：${item.IPAM.Config[0].Subnet === undefined ? '' : item.IPAM.Config[0].Subnet}<br>
                网关：${item.IPAM.Config[0].Gateway === undefined ? '' : item.IPAM.Config[0].Gateway}`
        });
      },

      // 删除一个网络
      handleRemoveNetwork(item) {
        removeNetwork({
          name: item.Name,
          ip: this.ip
        }).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg);
            this.handleListNetwork();
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 获取网络信息
      handleListNetwork() {
        listNetwork({
          ip: this.ip
        }).then(res => {
          this.networks = res.data;
        });
      },

      // 创建一个网络
      handleAddNetwork() {
        createNetwork({
          ip: this.ip,
          name: this.name
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
      this.handleListNetwork();
    },
  }
</script>

<style scoped>

</style>

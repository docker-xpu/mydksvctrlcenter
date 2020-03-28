<template>
  <div>
    <Button @click="showCreate = true" type="primary" long size="large">创建集群</Button>
    <Modal width="50" v-model="showCreate" title="创建集群" :bordered="false">
      <Form :label-width="100">
        <FormItem label="集群名：">
          <Input placeholder="例如：xxx服务" v-model="createPodForm.pod_name"></Input>
        </FormItem>
        <FormItem label="镜像：">
          <Row>
            <Col span="12">
              <label>镜像名
                <Select v-model="createPodForm.image_name" @on-change="onImageSelectChange">
                  <Option v-for="item in $store.state.images"
                          :value="item.name"
                          :key="item.name">
                    {{ item.name }}
                  </Option>
                </Select>
              </label>
            </Col>
            <Col span="12">
              <label>TAG
                <Select v-model="createPodForm.image_tag">
                  <Option v-for="item in createPodForm.selected_image_tags"
                          :value="item.tagName"
                          :key="item.tagName">
                    {{item.tagName}}
                  </Option>
                </Select>
              </label>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="容器数量：">
          <InputNumber :min="1" placeholder="例如：4" v-model="createPodForm.container_num"></InputNumber>
        </FormItem>
        <FormItem
                v-for="(item, index) in createPodForm.volumes"
                :key="index"
                v-if="item.status"
                :label="'容器卷 ' + index + '：'">
          <Row>
            <Col span="10">
              <label>宿主机路径
                <Input v-model="item.host_volume" placeholder="例如：/home/ahojcn"></Input>
              </label>
            </Col>
            <Col span="10">
              <label>容器内路径
                <Input v-model="item.container_volume" placeholder="例如：/volume1"></Input>
              </label>
            </Col>
            <Col span="4">
              <Button icon="md-add" type="primary" ghost @click="handleAddVolume">增加</Button>
              <Button type="error" ghost icon="md-arrow-round-back" @click="handleRemoveVolume(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Command：">
          <Row v-for="(item, index) in createPodForm.run_command"
               :key="index + 'cmd'" v-if="item.status">
            <Col span="20">
              <label>启动时运行的命令{{index}}
                <Input type="text" v-model="item.value"></Input>
              </label>
            </Col>
            <Col span="4">
              <Button icon="md-add" type="primary" ghost @click="handleAddCmd">增加</Button>
              <Button type="error" ghost icon="md-arrow-round-back" @click="handleRemoveCmd(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="网络：">
          <Row>
            <Col span="8">
              <label>网络协议
                <Input type="text" v-model="createPodForm.container_port_proto"
                       placeholder="例如：tcp"></Input>
              </label>
            </Col>
            <Col span="8">
              <label>对外服务端口
                <Input type="text" v-model="createPodForm.host_port" placeholder="例如：8081"></Input>
              </label>
            </Col>
            <Col span="8">
              <label>容器内端口
                <Input type="text" v-model="createPodForm.container_port" placeholder="例如：80"></Input>
              </label>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" long size="large" @click="handleCreatePod">创建</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {createPod, listPod} from '../../api/cluster';

  export default {
    name: "Create",
    data() {
      return {
        createPodForm: {
          "pod_name": '',
          "image_name": '',
          "image_tag": '',
          "selected_image_tags": '',
          "container_num": 1,
          "volumes": [
            {
              host_volume: '',
              container_volume: '',
              index: 1,
              status: 1
            },
          ],
          "run_command": [
            {
              value: '',
              index: 1,
              status: 1,
            },
          ],
          cmdIndex: 1,
          "container_port": '',
          "host_port": '',
          "container_port_proto": ''
        },
        showCreate: false,
      }
    },
    methods: {
      refreshImageInfo() {
        this.$store.dispatch('getAllImages');
      },
      // 创建容器当添加 volume
      handleAddVolume() {
        this.createPodForm.volumesIndex++;
        console.log(this.createPodForm.volumes);
        this.createPodForm.volumes.push({
          host_volume: '',
          container_volume: '',
          index: this.createPodForm.volumesIndex,
          status: 1
        });
      },
      // 删除 volume
      handleRemoveVolume(index) {
        this.createPodForm.volumes[index].status = 0;
      },
      // 增加 cmd
      handleAddCmd() {
        this.createPodForm.cmdIndex++;
        this.createPodForm.run_command.push({
          value: '',
          index: this.createPodForm.cmdIndex,
          status: 1
        });
      },
      // 删除 cmd
      handleRemoveCmd(index) {
        if (this.createPodForm.run_command.length === 1) {
          return;
        }
        this.createPodForm.run_command[index].status = 0;
      },
      // 选择镜像
      onImageSelectChange(image_name) {
        for (let i = 0; i < this.$store.state.images.length; i++) {
          if (this.$store.state.images[i].name === image_name) {
            this.createPodForm.selected_image_tags = this.$store.state.images[i].tags;
          }
        }
      },

      // 创建集群
      handleCreatePod() {
        let f = {
          pod_name: this.createPodForm.pod_name,
          image_name: this.createPodForm.image_name + ':' + this.createPodForm.image_tag,
          container_num: this.createPodForm.container_num,
          container_port: this.createPodForm.container_port,
          host_port: this.createPodForm.host_port,
          container_port_proto: this.createPodForm.container_port_proto,
          volumes: [],
          run_command: [],
        };
        for (let i = 0; i < this.createPodForm.volumes.length; ++i) {
          f.volumes.push({
            host_volume: this.createPodForm.volumes[i].host_volume,
            container_volume: this.createPodForm.volumes[i].container_volume,
          })
        }
        for (let i = 0; i < this.createPodForm.run_command.length; i++) {
          f.run_command.push(this.createPodForm.run_command[i].value)
        }

        createPod(f).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            let d = res.data;
            this.$Modal.info({
              title: `集群名：${d.podName}`,
              content: `name：${d.nginxName}<br>节点个数：${d.nodeNumber}<br>对外服务：${d.gateWayIp}:${d.nodePort}`
            });
          } else {
            this.$Message.error(res.msg);
          }
        })
      },
    },
    mounted() {
      this.refreshImageInfo();
    },
  }
</script>

<style scoped>

</style>

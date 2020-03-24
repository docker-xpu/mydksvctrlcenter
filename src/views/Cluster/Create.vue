<template>
  <div>
    <Card title="创建集群" :bordered="false">
      <Form :label-width="100">
        <FormItem label="集群名：">
          <Input placeholder="例如：xxx服务"></Input>
        </FormItem>
        <FormItem label="镜像：">
          <Input placeholder="例如：mynginx"></Input>
        </FormItem>
        <FormItem label="容器数量：">
          <InputNumber :min="1" placeholder="例如：4"></InputNumber>
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
        <FormItem label="运行命令：">
          <Input type="textarea" placeholder="例如：tar -zxvf && cd /root/"></Input>
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
              <label>主机端口
                <Input type="text" v-model="createPodForm.host_port" placeholder="例如：8081"></Input>
              </label>
            </Col>
            <Col span="8">
              <label>容器端口
                <Input type="text" v-model="createPodForm.container_port" placeholder="例如：80"></Input>
              </label>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large">创建</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "Create",
    data() {
      return {
        createPodForm: {
          "pod_name": '',
          "image_name": '',
          "container_num": 1,
          "volumes": [
            {
              host_volume: '',
              container_volume: '',
              index: 1,
              status: 1
            },
          ],
          "run_command": '',
          "container_port": '',
          "host_port": '',
          "container_port_proto": ''
        },
      }
    },
    methods: {
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
    },
    mounted() {
    },
  }
</script>

<style scoped>

</style>

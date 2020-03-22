<template>
  <div>
    <Button size="large" long type="primary" @click="showContainerInfo = true">容器信息</Button>

    <Drawer width="90" draggable :closable="true" v-model="showContainerInfo">
      <!--      标题-->
      <div>
        <h2>
          {{containerInfo.hostIp}}
          <Tag :color="containerInfo.hostStatus === 0 ? 'success': 'default'">{{containerInfo.hostStatusStr}}</Tag>
        </h2>

        <Tag color="blue">{{containerInfo.hostOs}} {{containerInfo.hostPlatformOs}}
          {{containerInfo.hostKernelVersion}}
        </Tag>
        <Tag color="magenta">物理CPU{{containerInfo.physical_cores}}核</Tag>
        <Tag color="red">逻辑CPU{{containerInfo.logical_cores}}核</Tag>
        <Tag color="orange">磁盘大小{{(containerInfo.disk_total/1024/1024/1024).toFixed(1)}}GB</Tag>
        <Tag color="orange">磁盘可用{{(containerInfo.disk_free/1024/1024/1024).toFixed(1)}}GB</Tag>
        <Tag color="purple">内存{{(containerInfo.memTotal/1024/1024/1024).toFixed(1)}}GB</Tag>
      </div>
      <Divider></Divider>
      <Table stripe :columns="containerInfoColumns" :data="containerInfo.containers">
        <template slot-scope="{ row }" slot="id">
          <span>{{ row.container.names[0] }}</span>
        </template>
        <template slot-scope="{ row }" slot="state">
          <span></span>
          <Tag type="dot" :color="row.container.state==='running'?'success':''">{{ row.container.state }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="command">
          <span>{{ row.container.command }}</span>
        </template>
        <template slot-scope="{ row }" slot="image">
          <span>{{ row.container.image }}</span>
        </template>
        <template slot-scope="{ row }" slot="net">
          <span>IP地址：{{ row.container.networkSettings.networks.bridge.ipaddress}}</span>
          <br>
          <span>网关：{{ row.container.networkSettings.networks.bridge.gateway}}</span>
          <br>
          <span v-for="(item, index) in row.container.ports" :key="index">{{ item.type }}/{{item.ip}}-{{item.privatePort}}:{{item.publicPort}}</span>
        </template>
        <template slot-scope="{ row }" slot="mem_info">
          <span>限制：{{ row.mem_info === null ? '无信息' : row.mem_info.memoryLimitInBbytes }}</span>
          <br>
          <span>已使用：{{ row.mem_info === null ? '无信息' : row.mem_info.memUsageInBytes }}</span>
          <br>
          <span>最大使用：{{ row.mem_info === null ? '无信息' : row.mem_info.memMaxUsageInBytes }}</span>
        </template>
        <template slot-scope="{ row }" slot="cpu_info">
          <span>系统：{{ row.cpu_info === null ? '无信息' : row.cpu_info.system }}</span>
          <br>
          <span>用户：{{ row.cpu_info === null ? '无信息' : row.cpu_info.user }}</span>
          <br>
          <span>优先级(nice值)：{{ row.cpu_info === null ? '无信息' : row.cpu_info.nice }}</span>
        </template>
        <template slot-scope="{ row }" slot="mounts">
          <span v-for="(mnt, index) in row.container.mounts" :key="index">{{ mnt.Destination }}:{{mnt.Source}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button icon="md-arrow-dropright-circle" type="success" size="small" @click="startContainer(row)" long>启动
          </Button>
          <Button icon="md-square" type="primary" size="small" @click="stopContainer(row)" long>停止</Button>
          <Button icon="ios-cloud-upload" type="warning" size="small" @click="pushContainer(row)" long>推送</Button>
          <Button icon="md-remove-circle" type="error" size="small" @click="removeContainer(row)" long>删除</Button>
        </template>
      </Table>

      <div style="text-align: center; padding-top: 30px">
        <Button type="primary" size="large" long @click="handleCreateContainerBtnClick">
          创建容器
        </Button>
      </div>
    </Drawer>

    <Drawer title="创建容器" draggable
            :closable="true"
            width="60"
            v-model="showCreateContainer">
      <Row :gutter="16">
        <Col span="16">
          <Form v-model="createContainerForm">
            <FormItem>
              <label>容器名：
                <Input type="text" v-model="createContainerForm.container_name" placeholder="例如：mynginx1"></Input>
              </label>
              <label>镜像名：
                <Input type="text" v-model="createContainerForm.image_name" placeholder="例如：nginx"></Input>
              </label>
              <label>Command：
                <Input type="textarea" v-model="createContainerForm.cmd"
                       placeholder="例如：nginx -g daemon off;"></Input>
              </label>
            </FormItem>
            <FormItem
                    v-for="(item, index) in createContainerForm.volumes"
                    :key="index"
                    v-if="item.status">
              <Row>
                <Col span="10">
                  <label>宿主机路径：
                    <Input v-model="item.host_volume" placeholder="例如：/home/ahojcn"></Input>
                  </label>
                </Col>
                <Col span="10">
                  <label>容器内路径：
                    <Input v-model="item.container_volume" placeholder="例如：/volume1"></Input>
                  </label>
                </Col>
                <Col span="4">
                  <Button icon="md-add" type="primary" ghost @click="handleAddVolume">增加</Button>
                  <Button type="error" ghost icon="md-arrow-round-back" @click="handleRemoveVolume(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <label>工作目录：
                <Input type="text" v-model="createContainerForm.working_dir" placeholder="例如：/root"></Input>
              </label>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="8">
                  <label>网络协议：
                    <Input type="text" v-model="createContainerForm.container_port_proto"
                           placeholder="例如：tcp"></Input>
                  </label>
                </Col>
                <Col span="8">
                  <label>主机端口：
                    <Input type="text" v-model="createContainerForm.host_port" placeholder="例如：8081"></Input>
                  </label>
                </Col>
                <Col span="8">
                  <label>容器端口：
                    <Input type="text" v-model="createContainerForm.container_port" placeholder="例如：80"></Input>
                  </label>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="12">
                  <label>CPU限制：
                    <Input type="text" v-model="createContainerForm.cpu_shares" placeholder="例如：1024"></Input>
                  </label>
                </Col>
                <Col span="12">
                  <label>内存限制：
                    <Input type="text" v-model="createContainerForm.memory" placeholder="例如：40000000"></Input>
                  </label>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <div style="text-align: center">
                <Alert type="warning" v-show="showCreateMsg">
                  {{createMsg}}
                </Alert>
              </div>
              <Button long type="primary" size="large" @click="createContainer">创建容器</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span="8">
          <Card :padding="0">
            <Input v-model="hostFiles.name" @on-enter="handleHostFilesChange(hostFiles.name)"></Input>
            <!--              @on-click="handleHostFilesChange(hostFiles.name + '/' + item.name)"-->
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
        </Col>
      </Row>
    </Drawer>
  </div>
</template>

<script>
  import {listHostFiles} from "../../api/host";
  import {startContainer, createContainer, stopContainer, removeContainer, pushContainer} from '../../api/container';

  export default {
    name: "ContainerInfo",
    props: {
      containerInfo: {},
    },
    data() {
      return {
        showContainerInfo: false,
        showCreateContainer: false,
        containerInfoColumns: [
          {
            title: '容器ID',
            slot: 'id'
          },
          {
            title: '状态',
            slot: 'state'
          },
          {
            title: '镜像',
            slot: 'image'
          },
          {
            title: '命令',
            slot: 'command'
          },
          {
            title: '网络',
            slot: 'net'
          },
          {
            title: '内存',
            slot: 'mem_info'
          },
          {
            title: 'CPU',
            slot: 'cpu_info'
          },
          {
            title: '挂载',
            slot: 'mounts'
          },
          {
            title: 'Action',
            slot: 'action',
            width: 150,
            align: 'center'
          },
        ],

        pushContainerForm: {},

        showCreateMsg: false,
        createMsg: '',
        createContainerForm: {
          ip: '',
          image_name: '',
          container_name: '',
          cmd: '',  // 提交时候需要处理
          volumes: [
            {
              host_volume: '',
              container_volume: '',
              index: 1,
              status: 1
            },
          ],
          volumesIndex: 1,
          working_dir: '',
          container_port_proto: '',
          container_port: '',
          host_port: '',
          cpu_shares: '',
          memory: '',
        },

        hostFiles: [],  // 宿主机上的文件列表
      }
    },
    methods: {
      // 点击启动容器
      startContainer(row) {
        startContainer({
          ip: this.containerInfo.hostIp,
          container_name: row.container.id
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            row.container.state = "running";
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
      // 点击停止容器
      stopContainer(row) {
        stopContainer({
          ip: this.containerInfo.hostIp,
          container_name: row.container.id
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            row.container.state = "exited";
          } else {
            this.$Message.error(res.msg);
          }
        })
      },
      // 点击删除容器
      removeContainer(row) {
        console.log(row);
        this.$Modal.confirm({
          title: '确认删除吗？',
          content: `容器：${row.container.names[0]}<br>
          状态：${row.container.state}<br>镜像：${row.container.image}<br>Cmd：${row.container.command}
          `,
          onOk: () => {
            removeContainer({
              ip: this.containerInfo.hostIp,
              container_name: row.container.id,
              bol: true
            }).then(res => {
              console.log(res);
              if (res.code === 0) {
                this.$Message.success(res.msg);
              } else {
                this.$Message.error(res.msg);
              }
            })
          }
        });
      },
      // 打包容器为镜像
      pushContainer(row) {
        console.log(row);
        this.pushContainerForm = {
          container_name: row.container.id,
          target_image_name: '',
          ip: this.containerInfo.hostIp,
          target_image_tag: '',
        };

        this.$Modal.confirm({
          title: '输入镜像名',
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: this.pushContainerForm.target_image_name,
                  autofocus: true,
                  placeholder: `例如：mynginx`
                },
                on: {
                  input: (val) => {
                    this.pushContainerForm.target_image_name = val;
                  }
                }
              }),
              h('Input', {
                props: {
                  value: this.pushContainerForm.target_image_tag,
                  autofocus: true,
                  placeholder: `例如：0.1`
                },
                on: {
                  input: (val) => {
                    this.pushContainerForm.target_image_tag = val;
                  }
                }
              })
            ])
          },
          onOk: () => {
            pushContainer(this.pushContainerForm).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg);
              } else {
                this.$Message.error(res.msg);
              }
            })
          },
        })
      },

      // 创建容器当添加 volume
      handleAddVolume() {
        this.createContainerForm.volumesIndex++;
        console.log(this.createContainerForm.volumes);
        this.createContainerForm.volumes.push({
          host_volume: '',
          container_volume: '',
          index: this.createContainerForm.volumesIndex,
          status: 1
        });
      },
      // 删除 volume
      handleRemoveVolume(index) {
        this.createContainerForm.volumes[index].status = 0;
      },
      // 创建容器
      createContainer() {
        let f = {};
        f.image_name = this.createContainerForm.image_name;
        f.container_name = this.createContainerForm.container_name;
        f.cmd = this.createContainerForm.cmd.split(' ');
        f.working_dir = this.createContainerForm.working_dir;
        f.container_port_proto = this.createContainerForm.container_port_proto;
        f.container_port = this.createContainerForm.container_port;
        f.host_port = this.createContainerForm.host_port;
        if (this.createContainerForm.cpu_shares !== '') {
          f.cpu_shares = parseInt(this.createContainerForm.cpu_shares);
        }
        if (this.createContainerForm.memory !== '') {
          f.memory = parseInt(this.createContainerForm.memory);
        }
        f.volumes = [];
        for (let i = 0; i < this.createContainerForm.volumes.length; ++i) {
          f.volumes.push({
            host_volume: this.createContainerForm.volumes[i].host_volume,
            container_volume: this.createContainerForm.volumes[i].container_volume
          })
        }

        createContainer({
          ip: this.containerInfo.hostIp,
          createForm: f
        }).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.showCreateMsg = true;
          this.createMsg = res.msg;
          this.$store.dispatch('getAllHost');
        })
      },

      // 当点击创建容器按钮
      handleCreateContainerBtnClick() {
        listHostFiles({
          ip: this.containerInfo.hostIp,
          path: '/'
        }).then(res => {
          if (res.status === 0) {
            this.hostFiles = res.data;
          }
          this.showCreateContainer = true;
        });
      },
      // 改变浏览的目录
      handleHostFilesChange(path = '/root') {
        listHostFiles({
          ip: this.containerInfo.hostIp,
          path: path
        }).then(res => {
          if (res.status === 0) {
            this.hostFiles = res.data;
          }
        });
      },
    },
    mounted() {
    },
  }
</script>

<style scoped>

</style>

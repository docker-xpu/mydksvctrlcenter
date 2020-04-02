<template>
  <div>
    <Button long type="primary" @click="handleClickContainerInfoBtn">容器信息</Button>

    <Drawer width="90" draggable :closable="true" @on-close="handleDrawerClose"
            v-model="showContainerInfo">
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
          <Button icon="md-arrow-dropright-circle" type="success" size="small" @click="startContainer(row)" long>
            启动
          </Button>
          <Button icon="md-square" type="primary" size="small" @click="stopContainer(row)" long>停止</Button>
          <Button icon="ios-cloud-upload" type="warning" size="small" @click="pushContainer(row)" long>推送</Button>
          <Button icon="md-remove-circle" type="error" size="small" @click="removeContainer(row)" long>删除</Button>
          <Button icon="md-eye" type="primary" size="small" @click="logContainer(row)" long>日志</Button>
        </template>
      </Table>

      <div style="text-align: center; padding-top: 30px">
        <ButtonGroup>
          <Button type="dashed" icon="md-refresh" @click="refreshHostInfo">刷新容器信息</Button>
          <Button type="primary" icon="md-add" @click="showCreateContainer = true">创建容器</Button>
          <Button type="dashed" icon="md-refresh" @click="refreshHostInfo">刷新镜像信息</Button>
        </ButtonGroup>
      </div>

      <Modal v-model="showContainerLogsModal" fullscreen title="Logs">
        <Alert v-for="(item, index) in containerLogs" :key="index">
          <Tag color="magenta">{{index}}</Tag>{{item}}
        </Alert>
        <div slot="footer">
          <Button size="large" type="primary" @click="showContainerLogsModal=false">好的</Button>
        </div>
      </Modal>
    </Drawer>

    <!--    容器日志信息   -->
<!--    <Modal v-modal="showContainerLogsModal"></Modal>-->

    <Drawer title="创建容器" draggable
            :closable="true"
            width="60"
            v-model="showCreateContainer">
      <Row :gutter="16">
        <Col span="16">
          <Form v-model="createContainerForm" :label-width="100">
            <FormItem label="容器名：">
              <Input type="text" v-model="createContainerForm.container_name" placeholder="例如：mynginx1"></Input>
            </FormItem>
            <FormItem label="Command：">
              <Row v-for="(item, index) in createContainerForm.cmd"
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
            <FormItem label="镜像名：">
              <!--              <Input type="text" v-model="createContainerForm.image_name" placeholder="例如：nginx"></Input>-->

              <Row>
                <Col span="12">
                  <label>镜像名
                    <Select v-model="createContainerForm.image_name" @on-change="onImageSelectChange">
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
                    <Select v-model="createContainerForm.image_tag">
                      <Option v-for="item in createContainerForm.selected_image_tags"
                              :value="item.tagName"
                              :key="item.tagName">
                        {{item.tagName}}
                      </Option>
                    </Select>
                  </label>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-for="(item, index) in createContainerForm.volumes"
                      :key="index"
                      v-if="item.status" :label="'容器卷 ' + index + '：'">
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
            <FormItem label="工作目录：">
              <Input type="text" v-model="createContainerForm.working_dir" placeholder="例如：/root"></Input>
            </FormItem>
            <FormItem label="网络：">
              <Row>
                <Col span="8">
                  <label>网络协议
                    <Input type="text" v-model="createContainerForm.container_port_proto"
                           placeholder="例如：tcp"></Input>
                  </label>
                </Col>
                <Col span="8">
                  <label>主机端口
                    <Input type="text" v-model="createContainerForm.host_port" placeholder="例如：8081"></Input>
                  </label>
                </Col>
                <Col span="8">
                  <label>容器端口
                    <Input type="text" v-model="createContainerForm.container_port" placeholder="例如：80"></Input>
                  </label>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="资源限制：">
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
          <HostFiles :host-ip="containerInfo.hostIp"></HostFiles>
        </Col>
      </Row>
    </Drawer>
  </div>
</template>

<script>
  import {
    startContainer,
    createContainer,
    stopContainer,
    removeContainer,
    pushContainer,
    getContainerLogs
  } from '../../api/container';
  import HostFiles from "../Hosts/HostFiles";

  export default {
    name: "ContainerInfo",
    components: {HostFiles},
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
        containerLogs: [],
        showContainerLogsModal: false,

        showCreateMsg: false,
        createMsg: '',
        createContainerForm: {
          ip: '',
          image_name: '',
          selected_image_tags: [],
          image_tag: '',
          container_name: '',
          cmd: [
            {
              value: '',
              index: 1,
              status: 1,
            },
          ],
          cmdIndex: 1,
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
      refreshHostInfo() {
        this.$store.dispatch('getAllHost');
      },
      refreshImageInfo() {
        this.$store.dispatch('getAllImages');
      },
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
      // 查看容器日志
      logContainer(row) {
        console.log(row.container.id, this.containerInfo.hostIp);
        getContainerLogs({ip: this.containerInfo.hostIp, container_name: row.container.id}).then(res => {
          this.containerLogs = res.data;
          this.showContainerLogsModal = true;
        });
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
              if (res.code === 0) {
                this.$Message.success(res.msg);
                this.$store.dispatch('getAllHost');
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
        this.createContainerForm.volumes.push({
          host_volume: '',
          container_volume: '',
          index: this.createContainerForm.volumesIndex,
          status: 1
        });
      },
      // 删除 volume
      handleRemoveVolume(index) {
        if (this.createContainerForm.volumes.length === 1) {
          return;
        }
        this.createContainerForm.volumes[index].status = 0;
      },
      // 增加 cmd
      handleAddCmd() {
        this.createContainerForm.cmdIndex++;
        this.createContainerForm.cmd.push({
          value: '',
          index: this.createContainerForm.cmdIndex,
          status: 1
        });
      },
      // 删除 cmd
      handleRemoveCmd(index) {
        if (this.createContainerForm.cmd.length === 1) {
          return;
        }
        this.createContainerForm.cmd[index].status = 0;
      },

      // 创建容器
      createContainer() {
        let f = {};
        f.image_name = this.createContainerForm.image_name + ':' + this.createContainerForm.image_tag;
        f.container_name = this.createContainerForm.container_name;
        // f.cmd = this.createContainerForm.cmd.split(' ');
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
          if (this.createContainerForm.volumes[i].status !== 0) {
            f.volumes.push({
              host_volume: this.createContainerForm.volumes[i].host_volume,
              container_volume: this.createContainerForm.volumes[i].container_volume
            })
          }
        }
        f.cmd = [];
        for (let i = 0; i < this.createContainerForm.cmd.length; ++i) {
          if (this.createContainerForm.cmd[i].status !== 0) {
            f.cmd.push(this.createContainerForm.cmd[i].value)
          }
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

      // 选择镜像
      onImageSelectChange(image_name) {
        for (let i = 0; i < this.$store.state.images.length; i++) {
          if (this.$store.state.images[i].name === image_name) {
            this.createContainerForm.selected_image_tags = this.$store.state.images[i].tags;
          }
        }
      },

      handleClickContainerInfoBtn() {
        this.showContainerInfo = true;
      },
      handleDrawerClose() {
      },
    },
    mounted() {
      this.refreshImageInfo();
    },
  }
</script>

<style scoped>

</style>

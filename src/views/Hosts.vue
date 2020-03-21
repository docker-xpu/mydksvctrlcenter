<template>
  <div>
    <Row>
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 18, offset: 0 }" style="padding-right: 20px">
        <Card title="主机管理" icon="logo-windows" shadow style="margin-bottom: 20px">
          <Row :gutter="16">
            <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }">
              <Form>
                <FormItem>
                  <label>
                    <Input v-model="newHost.ip" placeholder="主机IP"></Input>
                  </label>
                </FormItem>
                <FormItem>
                  <label>
                    <Select filterable placeholder="主机凭据" v-model="newHost.licenceId">
                      <Option
                              v-for="(item, index) in $store.state.licences"
                              :key="item.licenseId"
                              :value="item.licenseId"
                      >{{item.licenseName}}
                      </Option>
                    </Select>
                  </label>
                </FormItem>
                <FormItem>
                  <label>
                    <Input v-model="newHost.version" placeholder="dksv版本"></Input>
                  </label>
                </FormItem>
                <FormItem>
                  <Button type="success" long @click="testConn">测试连接</Button>
                </FormItem>
                <FormItem>
                  <Button type="primary" long @click="addHost">添加主机</Button>
                </FormItem>
              </Form>
            </Col>
            <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 18, offset: 0 }">
              <Row :gutter="10">
                <Col v-for="(item, index) in $store.state.hosts" :key="index" :md="{ span: 24, offset: 0 }"
                     :lg="{ span: 8, offset: 0 }">
                  <Card>
                    <Badge status="processing"></Badge>
                    <br/>
                    操作系统：{{item.hostOs}}
                    <br/>
                    主机IP：{{item.hostIp}}
                    <br/>
                    <Tag
                            :color="item.hostStatus === 0 ? 'green': 'default'"
                    >{{item.hostStatusStr}}
                    </Tag>

                    <div slot="extra">
                      <Button type="text" style="color: red" @click="deleteHost(item)">移除</Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <div style="text-align: center">
          <Alert>
            <h2>实时监控</h2>
            <br>
            <ButtonGroup size="large">
              <Button @click="onClickWatchBtn" type="success">打开</Button>
              <Button @click="handlePauseWatchBtnClick" type="primary">暂停</Button>
              <Button @click="onClickCloseWatchBtn" type="warning">关闭</Button>
            </ButtonGroup>
          </Alert>
        </div>

        <Row :gutter="16">
          <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 24, offset: 0 }" v-for="(item, index) in $store.state.hosts"
               :key="index">
            <div style="padding-bottom: 20px">
              <Card>
                <div slot="extra">
                  <Tag :color="item.hostStatus === 0 ? 'green': 'default'">{{item.hostStatusStr}}</Tag>
                </div>

                <Badge status="processing"></Badge>
                {{item.hostIp}}
                <Divider></Divider>

                <div style="text-align: center">
                  <ButtonGroup>
                    <Button type="primary" size="large" @click="onClickShowContainerInfoBtn(index)">容器信息</Button>
                  </ButtonGroup>
                </div>

                <Divider></Divider>
                <div style="text-align: center">
                  <Tag color="blue">{{item.hostOs}} {{item.hostPlatformOs}} {{item.hostKernelVersion}}</Tag>
                  <Tag color="magenta">物理CPU{{item.physical_cores}}核</Tag>
                  <Tag color="red">逻辑CPU{{item.logical_cores}}核</Tag>
                  <Tag color="orange">磁盘大小{{(item.disk_total/1024/1024/1024).toFixed(1)}}GB</Tag>
                  <Tag color="orange">磁盘可用{{(item.disk_free/1024/1024/1024).toFixed(1)}}GB</Tag>
                  <Tag color="purple">内存{{(item.memTotal/1024/1024/1024).toFixed(1)}}GB</Tag>
                  <Tag type="border" color="#FFA2D3">
                    平均负载：1分钟{{(item.loadInfo.load.load1)}},
                    5分钟{{(item.loadInfo.load.load5)}},
                    15分钟{{(item.loadInfo.load.load15)}}
                  </Tag>
                </div>

                <div v-if="showWatch" :id="index" style="width: 100%; height: 300px">
                  <!--                  {{item.hostIp}} | {{allData[index]}}-->
                  <!-- {{item}} -->
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>

      <!--      容器信息-->
      <Drawer width="90" :closable="true" v-model="showContainerInfoDrawer">
        <div>
          <h2>
            {{showContainerInfo.hostIp}}
            <Tag :color="showContainerInfo.hostStatus === 0 ? 'success': 'default'">{{showContainerInfo.hostStatusStr}}
            </Tag>
          </h2>
          <Tag color="blue">{{showContainerInfo.hostOs}} {{showContainerInfo.hostPlatformOs}}
            {{showContainerInfo.hostKernelVersion}}
          </Tag>
          <Tag color="magenta">物理CPU{{showContainerInfo.physical_cores}}核</Tag>
          <Tag color="red">逻辑CPU{{showContainerInfo.logical_cores}}核</Tag>
          <Tag color="orange">磁盘大小{{(showContainerInfo.disk_total/1024/1024/1024).toFixed(1)}}GB</Tag>
          <Tag color="orange">磁盘可用{{(showContainerInfo.disk_free/1024/1024/1024).toFixed(1)}}GB</Tag>
          <Tag color="purple">内存{{(showContainerInfo.memTotal/1024/1024/1024).toFixed(1)}}GB</Tag>
        </div>

        <Divider></Divider>

        <Table stripe :columns="containerInfoColumns" :data="showContainerInfo.containers">
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

      <!--      创建容器-->
      <Drawer title="创建容器" width="60" :closable="true" v-model="showCreateContainerDrawer">
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

      <!--      凭据-->
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }">
        <Card title="已有凭据" icon="md-key" shadow style="width: 100%; margin-bottom: 20px">
          <CellGroup>
            <Cell
                    v-for="(item, index) in $store.state.licences"
                    :key="item.licenseId"
                    :title="item.licenseName"
            >
              <Button
                      type="text"
                      style="color: dodgerblue"
                      slot="extra"
                      @click="seeLicence(item)"
              >查看
              </Button>
              <Button type="text" style="color: red" slot="extra" @click="deleteLicence(item)">删除</Button>
            </Cell>
          </CellGroup>
        </Card>
        <Card title="新增凭据" icon="md-key" shadow>
          <Form>
            <FormItem>
              <Input v-model="licence.name" type="text" placeholder="凭据名称"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="licence.pwd" type="password" placeholder="凭据密码"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="newLicence">提交</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import store from "../store/index";
  import {connHost, initHost, removeHost, listHostFiles} from "../api/host";
  import {startContainer, createContainer, stopContainer, removeContainer, pushContainer} from '../api/container'

  // require('echarts/lib/chart/line');

  // var Highcharts = require("highcharts");
  // // 在 Highcharts 加载之后加载功能模块
  // require("highcharts/modules/exporting")(Highcharts);

  export default {
    name: "Hosts",
    data() {
      return {
        // 主机凭据
        licence: {
          name: "",
          pwd: ""
        },

        // 新增主机数据
        newHost: {
          ip: "",
          licenceId: 0,
          version: ""
        },

        showContainerInfoDrawer: false,
        showCreateContainerDrawer: false,
        showContainerInfo: {},
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
        showHostIndex: 0,

        hostFiles: [],  // 宿主机上的文件列表

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

        pushContainerForm: {},

        websocket: undefined,
        showWatch: false,  // 是否查看实时监控
      };
    },
    computed: {
      myCharts() {
        let l = [];
        for (let i = 0; i < this.$store.state.hosts.length; ++i) {
          let echarts = require('echarts');
          let myChart = echarts.init(document.getElementById(`${i}`), 'light');
          l.push(myChart)
        }
        return l
      },
    },
    mounted() {
      store.dispatch("getAllLicence");
      store.dispatch("getAllHost");
    },
    methods: {
      // 查看监控按钮点击
      onClickWatchBtn() {
        this.showWatch = true;
        this.websocket = new WebSocket(`ws://tim.natapp1.cc/getHostInfoWebSocket`);
        this.websocket.onopen = e => {
          console.log("建立ws连接");
        };
        this.websocket.onclose = e => {
          console.log("断开ws连接");
        };
        this.websocket.onmessage = this.onmessage;
        this.websocket.onerror = e => {
          console.log("ws错误");
        };
      },
      // 关闭实时监控
      onClickCloseWatchBtn() {
        this.showWatch = false;
        this.websocket.close();
      },
      handlePauseWatchBtnClick() {
        this.websocket.close();
      },
      // 收到 websocket 数据
      onmessage(e) {
        // console.log(e)
        let res = JSON.parse(e.data);
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < this.$store.state.hosts.length; ++j) {
            if (res[i].host_ip === this.$store.state.hosts[j].hostIp) {
              if (this.$store.state.hosts[j].log.cpu.length >= 20) {
                this.$store.state.hosts[j].log.cpu.pop();
                this.$store.state.hosts[j].log.mem.pop();
                this.$store.state.hosts[j].log.disk.pop();
              }
              this.$store.state.hosts[j].log.cpu.push({value: [res[i].timestamp, res[i].cpu * 100]});
              this.$store.state.hosts[j].log.mem.push({value: [res[i].timestamp, res[i].mem * 100]});
              this.$store.state.hosts[j].log.disk.push({value: [res[i].timestamp, res[i].disk * 100]});
            }
          }
        }
        // console.log(this.$store.state.hosts);
        // console.log(res);
        for (let i = 0; i < res.length; ++i) {
          this.myCharts[i].setOption({
            title: {
              text: '实时监控数据'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            xAxis: {
              type: 'time',
              splitNumber: 10
            },
            yAxis: {
              type: 'value',
              // boundaryGap: [0, '100%'],
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: '{value} %'       //给Y轴上的刻度加上单位
              },
            },
            series: [
              {
                name: 'cpu',
                type: 'line',
                showSymbol: false,
                data: this.$store.state.hosts[i].log.cpu
              },
              {
                name: 'mem',
                type: 'line',
                showSymbol: false,
                data: this.$store.state.hosts[i].log.mem
              },
              {
                name: 'disk',
                type: 'line',
                showSymbol: false,
                data: this.$store.state.hosts[i].log.disk
              }
            ]
          });
        }
      },

      // 点击查看凭据
      seeLicence(licence) {
        this.$Modal.info({
          title: licence.licenseName,
          content: licence.licensePasswd
        });
      },
      // 点击删除凭据
      deleteLicence(licence) {
        this.$Modal.confirm({
          title: "确定要删除吗？",
          content: licence.licenseName,
          onOk: () => {
            store.dispatch("deleteLicence", licence);
          }
        });
      },
      // 新增凭据
      newLicence() {
        this.$Modal.confirm({
          title: "检查一下",
          content: `凭据名称：${this.licence.name}<br/>
        凭据密码：${this.licence.pwd}`,
          onOk: () => {
            store.dispatch("newLicence", this.licence);
            this.licence = "";
            this.pwd = "";
          }
        });
      },
      // 测试连接
      testConn() {
        connHost({
          ip: this.newHost.ip,
          licenseId: this.newHost.licenceId
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success({
              background: true,
              content: res.msg
            });
          } else {
            this.$Message.error({
              background: true,
              content: res.msg
            });
          }
        });
      },
      // 增加一个主机，即初始化一个主机
      addHost() {
        initHost({
          ip: this.newHost.ip,
          licenseId: this.newHost.licenceId,
          version: this.newHost.version
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success({
              background: true,
              content: res.msg
            });
            setTimeout(()=>{
              this.$store.dispatch("getAllHost");
            }, 3000);
          } else {
            this.$Message.error({
              background: true,
              content: res.msg
            });
          }
        });
      },
      // 删除一台主机
      deleteHost(item) {
        this.$Modal.confirm({
          title: "你确定要这样吗？",
          content: `主机IP：${item.hostIp}<br>
        操作系统：${item.hostOs}<br>
        主机状态：${item.hostStatusStr}`,
          onOk: () => {
            // 移除主机
            removeHost({
              ip: item.hostIp
            }).then(res => {
              if (res.code === 0) {
                this.$Message.success({
                  background: true,
                  content: res.msg
                });
                this.$store.dispatch("getAllHost");
              } else {
                this.$Message.error({
                  background: true,
                  content: res.msg
                });
              }
            });
          }
        });
      },
      // 当点击查看容器信息
      onClickShowContainerInfoBtn(index) {
        this.showHostIndex = index;
        this.showContainerInfo = this.$store.state.hosts[this.showHostIndex];
        this.showContainerInfoDrawer = true;
      },

      // 点击启动容器
      startContainer(row) {
        startContainer({
          ip: this.showContainerInfo.hostIp,
          container_name: row.container.id
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            row.container.state = "running";
          } else {
            this.$Message.error(res.msg);
          }

          this.$store.dispatch('getAllHost').then(() => {
            this.onClickShowContainerInfoBtn(this.showHostIndex);
          })
        });

        // createContainer({
        //   "image_name": "nginx",
        //   "container_name": "mynginx4",
        //   "cmd": [
        //     "nginx",
        //     "-g",
        //     "daemon off;"
        //   ],
        //   "volumes": [
        //     {
        //       "host_volume": "/root/bin/",
        //       "container_volume": "/containerVolume4"
        //     }
        //   ],
        //   "working_dir": "",
        //   "container_port_proto": "tcp",
        //   "container_port": "80",
        //   "host_port": "8090",
        //   "cpu_shares": 1024,
        //   "memory": 400000000
        // }).then(res=>{
        //   console.log(res)
        // })
      },
      // 点击停止容器
      stopContainer(row) {
        stopContainer({
          ip: this.showContainerInfo.hostIp,
          container_name: row.container.id
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            row.container.state = "exited";
          } else {
            this.$Message.error(res.msg);
          }
          this.$store.dispatch('getAllHost').then(() => {
            this.onClickShowContainerInfoBtn(this.showHostIndex);
          });
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
              ip: this.showContainerInfo.hostIp,
              container_name: row.container.id,
              bol: true
            }).then(res => {
              console.log(res);
              if (res.code === 0) {
                this.$Message.success(res.msg);
              } else {
                this.$Message.error(res.msg);
              }
              this.$store.dispatch('getAllHost').then(() => {
                this.onClickShowContainerInfoBtn(this.showHostIndex);
              })
            })
          }
        });
      },
      // 打包容器为镜像
      pushContainer(row) {
        this.pushContainerForm = {
          image_name: row.container.names[0],
          target_image_name: `${row.container.names[0]}:版本号`,
          ip: this.showContainerInfo.hostIp
        };

        this.$Modal.confirm({
          title: '输入镜像名',
          render: (h) => {
            return h('Input', {
              props: {
                value: this.pushContainerForm.target_image_name,
                autofocus: true,
                placeholder: `例如：${this.pushContainerForm.image_name}:版本号`
              }
            })
          },
          onOk: () => {
            pushContainer(this.pushContainerForm).then(res => {
              if (res.code === 0) {
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
          ip: this.showContainerInfo.hostIp,
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
          ip: this.showContainerInfo.hostIp,
          path: '/'
        }).then(res => {
          if (res.status === 0) {
            this.hostFiles = res.data;
          }
          this.showCreateContainerDrawer = true;
        });
      },
      // 改变浏览的目录
      handleHostFilesChange(path = '/root') {
        listHostFiles({
          ip: this.showContainerInfo.hostIp,
          path: path
        }).then(res => {
          if (res.status === 0) {
            this.hostFiles = res.data;
          }
        });
      },
    }
  };
</script>

<style scoped>
</style>

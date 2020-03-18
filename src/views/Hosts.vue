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
          <ButtonGroup size="large">
            <Button @click="onClickWatchBtn" type="success">打开实时监控</Button>
            <Button @click="onClickCloseWatchBtn" type="warning">关闭实时监控</Button>
          </ButtonGroup>
        </div>

        <Row :gutter="16">
          <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" v-for="(item, index) in $store.state.hosts"
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
                  <Button type="primary" size="large" @click="onClickShowContainerInfoBtn(index)">详细信息</Button>
                </div>

                <Divider></Divider>
                <Tag color="blue">{{item.hostOs}} {{item.hostPlatformOs}} {{item.hostKernelVersion}}</Tag>
                <Tag color="magenta">物理CPU{{item.physical_cores}}核</Tag>
                <Tag color="red">逻辑CPU{{item.logical_cores}}核</Tag>
                <Tag color="orange">磁盘大小{{(item.disk_total/1024/1024/1024).toFixed(1)}}GB</Tag>
                <Tag color="orange">磁盘可用{{(item.disk_free/1024/1024/1024).toFixed(1)}}GB</Tag>
                <Tag color="purple">内存{{(item.memTotal/1024/1024/1024).toFixed(1)}}GB</Tag>

                <div v-if="showWatch" :id="index" style="width: 100%; height: 300px">
                  <!--                  {{item.hostIp}} | {{allData[index]}}-->
                  <!-- {{item}} -->
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>

      <Drawer width="80" :closable="false" v-model="showContainerInfoDrawer">
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

        <Divider></Divider>

        <Table border :columns="containerInfoColumns" :data="showContainerInfo.containers">
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
            <span>IP地址：{{ row.container.networkSettings.networks.bridge.ipaddress }}</span>
            <br>
            <span>网关：{{ row.container.networkSettings.networks.bridge.gateway }}</span>
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
            <Button type="success" size="small" @click="startContainer(row)" long>启动</Button>
            <Button type="primary" size="small" @click="stopContainer(row)" long>停止</Button>
            <Button type="error" size="small" @click="removeContainer(row)" long>删除</Button>
          </template>
        </Table>

        <div style="text-align: center; padding-top: 30px">
          <Button type="primary" size="large">
            创建容器
          </Button>
        </div>
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
  import {connHost, initHost, removeHost} from "../api/host";
  import {startContainer, createContainer, stopContainer, removeContainer} from '../api/container'

  // require('echarts/lib/chart/line');

  // var Highcharts = require("highcharts");
  // // 在 Highcharts 加载之后加载功能模块
  // require("highcharts/modules/exporting")(Highcharts);

  export default {
    name: "Hosts",
    data() {
      return {
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
        // this.showWatch = false;
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
            this.$store.dispatch("getAllHost");
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
        console.log(index);
        this.showHostIndex = index;
        this.showContainerInfo = this.$store.state.hosts[index];
        this.showContainerInfoDrawer = true;
      },

      // 点击启动容器
      startContainer(row) {
        startContainer({
          ip: this.showContainerInfo.hostIp,
          container_name: row.container.id
        }).then(res=>{
          if (res.code === 0) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }

          this.$store.dispatch('getAllHost');
          this.onClickShowContainerInfoBtn(this.showHostIndex);
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
        }).then(res=>{
          if (res.code === 0) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.$store.dispatch('getAllHost');
          this.onClickShowContainerInfoBtn(this.showHostIndex);
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
            }).then(res=>{
              console.log(res);
              if (res.code === 0) {
                this.$Message.success(res.msg);
              } else {
                this.$Message.error(res.msg);
              }
              this.$store.dispatch('getAllHost');
              this.onClickShowContainerInfoBtn(this.showHostIndex);
            })
          }
        });
      },
    }
  };
</script>

<style scoped>
</style>

<template>
  <div>
    <Row>
      <Col :md="{ span: 24, offset: 0 }"
           :lg="{ span: 18, offset: 0 }"
           style="padding-right: 20px">
        <Card title="主机管理" icon="logo-windows" shadow style="margin-bottom: 20px">
          <Spin size="large" fix v-if="$store.state.showSpin"></Spin>

          <Modal v-model="showAddHostModal" title="添加主机">
            <Form>
              <FormItem>
                <label>
                  <Input v-model="newHost.ip" placeholder="主机IP"></Input>
                </label>
              </FormItem>
              <FormItem>
                <Row>
                  <Col span="19">
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
                  </Col>
                  <Col span="4">
                    <Button type="text" @click="showAddLicenceModal = true">新增凭据</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <label>
                  <Input v-model="newHost.version" placeholder="dksv版本"></Input>
                </label>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="success" @click="testConn">测试连接</Button>
              <Button type="primary" @click="addHost">添加主机</Button>
            </div>
          </Modal>

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
                        :color="item.hostStatus === 0 ? 'success': 'default'"
                >{{item.hostStatusStr}}
                </Tag>

                <div slot="extra">
                  <Button type="text" style="color: red" @click="deleteHost(item)">移除</Button>
                </div>
              </Card>
            </Col>
          </Row>

          <div style="padding-top: 20px; text-align: center">
            <Button type="primary" size="large" @click="showAddHostModal=true">添加主机</Button>
          </div>
        </Card>

        <!--        监控控制按钮-->
        <div style="text-align: center">
          <Alert>
            <h2>实时监控</h2>
            <br>
            <ButtonGroup shape="circle">
              <Button @click="onClickWatchBtn" type="success">
                <Icon type="md-power"></Icon>
              </Button>
              <Button @click="handlePauseWatchBtnClick" type="primary">
                <Icon type="md-pause"></Icon>
              </Button>
              <Button @click="onClickCloseWatchBtn" type="warning">
                <Icon type="md-close"></Icon>
              </Button>
            </ButtonGroup>
          </Alert>
        </div>

        <Row :gutter="16">
          <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 24, offset: 0 }" v-for="(item, index) in $store.state.hosts"
               :key="index">
            <div style="padding-bottom: 20px">
              <Card>
                <Spin size="large" fix v-if="$store.state.showSpin"></Spin>
                <div slot="extra">
                  <Tag :color="item.hostStatus === 0 ? 'success': 'default'">{{item.hostStatusStr}}</Tag>
                </div>

                <Badge status="success"></Badge>
                {{item.hostIp}}
                <div>
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

                <Divider></Divider>

                <div style="text-align: center">
                  <Row :gutter="16">
                    <Col span="8">
                      <Network :ip="item.hostIp"></Network>
                    </Col>
                    <Col span="8">
                      <ContainerInfo :container-info="$store.state.hosts[index]"></ContainerInfo>
                    </Col>
                    <Col span="8">
                      <HostFiles :host-ip="item.hostIp"></HostFiles>
                    </Col>
                  </Row>
                </div>

                <div v-if="showWatch" :id="index" style="width: 100%; height: 300px"></div>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>

      <!--      凭据-->
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }">
        <CloudFiles style="padding-bottom: 20px"></CloudFiles>

        <Card :padding="0" title="已有凭据" icon="md-key" shadow style="width: 100%; margin-bottom: 20px">
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
          <Button long type="primary" size="large" @click="showAddLicenceModal=true">新增凭据</Button>
        </Card>
      </Col>

      <Modal v-model="showAddLicenceModal" title="新增凭据">
        <Form>
          <FormItem>
            <Input v-model="licence.name" type="text" placeholder="凭据名称"></Input>
          </FormItem>
          <FormItem>
            <Input v-model="licence.pwd" type="password" placeholder="凭据密码"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="newLicence">新建凭据</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import store from "../store/index";
  import {connHost, initHost, removeHost} from "../api/host";
  import Network from "../components/Network";
  import ContainerInfo from "../components/Container/ContainerInfo";
  import Logo from "../components/Logo";
  import HostFiles from "../components/Hosts/HostFiles";
  import CloudFiles from "../components/Editor/CloudFiles";

  export default {
    name: "Hosts",
    components: {CloudFiles, HostFiles, Logo, ContainerInfo, Network},
    data() {
      return {
        showAddHostModal: false,
        showAddLicenceModal: false,

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
          l.push(myChart);
        }
        return l
      },
    },
    mounted() {
      store.dispatch("getAllLicence");
      store.dispatch("getAllHost");
    },
    methods: {
      // hostInfo: function (hostInfo) {
      //   return hostInfo
      // },
      // 查看监控按钮点击
      onClickWatchBtn() {
        this.showWatch = true;
        this.$Message.loading('启动中请稍后');
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
            setTimeout(() => {
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
    }
  };
</script>

<style scoped>
</style>

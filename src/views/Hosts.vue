<template>
  <div>
    <Row>
      <Col span="18" style="padding-right: 20px">
        <Card title="主机管理" icon="logo-windows" shadow style="margin-bottom: 20px">
          <Row :gutter="16">
            <Col span="6">
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
                      >{{item.licenseName}}</Option>
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
            <Col span="18">
              <Row :gutter="10">
                <Col v-for="(item, index) in $store.state.hosts" :key="index" span="8">
                  <Card>
                    <Badge status="processing"></Badge>
                    <br />
                    操作系统：{{item.hostOs}}
                    <br />
                    主机IP：{{item.hostIp}}
                    <br />
                    <Tag
                      :color="item.hostStatus === 0 ? 'success': 'default'"
                    >{{item.hostStatusStr}}</Tag>

                    <div slot="extra">
                      <Button type="text" style="color: red" @click="deleteHost(item)">移除</Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Row :gutter="16">
          <Col span="12" v-for="(item, index) in $store.state.hosts" :key="index">
            <div>
              <Card>
                <div slot="extra">
                  <Tag :color="item.hostStatus === 0 ? 'success': 'default'">{{item.hostStatusStr}}</Tag>
                </div>

                <Badge status="processing"></Badge>
                {{item.hostIp}}
                <Divider></Divider>
                <Tag color="blue">{{item.hostOs}} {{item.hostPlatformOs}} {{item.hostKernelVersion}}</Tag>
                <Tag color="magenta">物理CPU{{item.physical_cores}}核</Tag>
                <Tag color="red">逻辑CPU{{item.logical_cores}}核</Tag>
                <Tag color="orange">磁盘{{(item.disk_total/1024/1024/1024).toFixed(1)}}GB</Tag>
                <Tag color="purple">内存{{(item.memTotal/1024/1024/1024).toFixed(1)}}GB</Tag>

                <div :id="item.hostIp" style="width: 100%; height: 300px">
                  <!-- {{item}} -->
                  <!-- {{item}}
                  <Progress
                    :percent="item.log.mem * 100"
                    :stroke-width="20"
                    status="active"
                    text-inside
                  /> -->
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>

      <Col span="6">
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
              >查看</Button>
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
import { connHost, initHost, removeHost } from "../api/host";

var Highcharts = require("highcharts");
// 在 Highcharts 加载之后加载功能模块
require("highcharts/modules/exporting")(Highcharts);

export default {
  name: "Hosts",
  data() {
    return {
      licence: {
        name: "",
        pwd: ""
      },

      charts: {},

      // 新增主机数据
      newHost: {
        ip: "",
        licenceId: 0,
        version: ""
      }
    };
  },
  computed: {
    allData() {
      let d = {};
      for (let i = 0; i < this.$store.state.hosts.length; i++) {
        let k = this.$store.state.hosts[i].hostIp;
        d[k] = {
          cpu: [],
          disk: [],
          mem: [],
          package_recv: [],
          package_sent: [],
          timestamp: []
        };
      }
      return d;
    }
  },
  mounted() {
    store.dispatch("getAllLicence");
    store.dispatch("getAllHost");

    let keys = Object.keys(this.allData);
    for (let i = 0; i < keys.length; i++) {
      let ip = keys[i];
      this.charts[ip] = Highcharts.chart(ip, {
        chart: {
          type: "spline"
        },
        plotOptions: {
          series: {
            animation: {
              duration: 2000,
              easing: "easeOutBounce"
            }
          }
        },
        title: {
          text: "状态监控"
        },
        xAxis: {
          type: "datetime",
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: "%"
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        legend: {
          enabled: false
        },
        series: []
      });
      // console.log(this.charts)
    }

    let ws = new WebSocket(`ws://tim.natapp1.cc/getHostInfoWebSocket`);
    ws.onopen = e => {
      console.log("建立ws连接");
    };
    ws.onclose = e => {
      console.log("断开ws连接");
    };
    ws.onmessage = this.onmessage;
    ws.onerror = e => {
      console.log("ws错误");
    };
  },
  methods: {
    onmessage(e) {
      let res = JSON.parse(e.data);

      // for (let i = 0; i < res.length; i++) {
      //   // this.allData[res.host_ip] = 1
      //   let hosts = this.$store.state.hosts;
      //   for (let j = 0; j < hosts.length; ++j) {
      //     if (res[i].host_ip === hosts[j].hostIp) {
      //       hosts[j].log.cpu = res[i].cpu;
      //       hosts[j].log.disk = res[i].disk;
      //       hosts[j].log.mem = res[i].mem;
      //       hosts[j].log.package_recv = res[i].package_recv;
      //       hosts[j].log.package_sent = res[i].package_sent;
      //       hosts[j].log.timestamp = res[i].timestamp;
      //     }
      //   }
      // }
      // console.log(this.$store.state.hosts[0])

      for (let i = 0; i < res.length; i++) {
        this.allData[res[i].host_ip].cpu.push(res[i].cpu);
        this.allData[res[i].host_ip].disk.push(res[i].disk);
        this.allData[res[i].host_ip].package_recv.push(res[i].io.package_recv);
        this.allData[res[i].host_ip].package_sent.push(res[i].io.package_sent);
        this.allData[res[i].host_ip].mem.push(res[i].mem);
        this.allData[res[i].host_ip].timestamp.push(res[i].timestamp);
      }

      let keys = Object.keys(this.allData);
      for (let i = 0; i < keys.length; i++) {
        let ip = keys[i];
        // console.log(this.charts);
        let c = Highcharts.chart(ip, {
          chart: {
            events: {}
          },
          title: {
            text: "用量"
          },
          tooltip: {
            crosshairs: true,
            shared: true
          },
          xAxis: {
            categories: this.allData[ip].timestamp
          },
          series: [
            {
              name: "cpu",
              data: this.allData[ip].cpu
            },
            {
              name: "disk",
              data: this.allData[ip].disk
            },
            {
              name: "mem",
              data: this.allData[ip].mem
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
    }
  }
};
</script>

<style scoped>
</style>

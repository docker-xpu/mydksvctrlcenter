<template>
  <div>
    <Row>
      <Col span="18"  style="padding-right: 20px">
        <Card title="主机管理" icon="logo-windows" style="margin-bottom: 20px"></Card>

        <Row :gutter="16">
          <Col span="12" v-for="(item, index) in $store.state.hosts" :key="index">
            <div>
              <Card>
                <div slot="extra">
                  <Tag :color="item.hostStatus === 0 ? 'success': 'default'">
                    {{item.hostStatusStr}}
                  </Tag>
                </div>

                <Badge status="processing"></Badge>
                {{item.hostIp}}
                <Divider></Divider>

                <div :id="item.hostIp" style="width: 100%; height: 300px"></div>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>

      <Col span="6">
        <Card title="已有凭据" icon="md-key" shadow style="width: 100%; margin-bottom: 20px">
          <CellGroup>
            <Cell v-for="(item, index) in $store.state.licences" :key="item.licenseId" :title="item.licenseName">
              <Button type="text" style="color: dodgerblue" slot="extra" @click="seeLicence(item)">查看</Button>
              <Button type="text" style="color: red" slot="extra" @click="deleteLicence(item)">删除</Button>
            </Cell>
          </CellGroup>
        </Card>
        <Card title="新增凭据" icon="md-key" shadow>
          <Input style="padding-bottom: 10px" v-model="licence.name" type="text" placeholder="凭据名称">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
          <Input style="padding-bottom: 10px" v-model="licence.pwd" type="password" placeholder="凭据密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
          <Button type="primary" long @click="newLicence">提交</Button>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import store from '../store/index'

  var Highcharts = require('highcharts');
  // 在 Highcharts 加载之后加载功能模块
  require('highcharts/modules/exporting')(Highcharts);

  export default {
    name: "Hosts",
    data() {
      return {
        licence: {
          name: '',
          pwd: '',
        },

        charts: {
        },
      }
    },
    computed: {
      allData() {
        let d = {};
        for (let i = 0; i < this.$store.state.hosts.length; i++) {
          let k = this.$store.state.hosts[i].hostIp;
          d[k] = {
            'cpu': [],
            'disk': [],
            'mem': [],
            'package_recv': [],
            'package_sent': [],
            'timestamp': []
          };
        }
        return d
      }
    },
    mounted() {
      store.dispatch('getAllLicence');
      store.dispatch('getAllHost');

      let keys = Object.keys(this.allData);
      for (let i = 0; i < keys.length; i++) {
        let ip = keys[i];
        this.charts[ip] = Highcharts.chart(ip, {
          chart: {
            type: 'spline'
          },
          plotOptions: {
            series: {
              animation: {
                duration: 2000,
                easing: 'easeOutBounce'
              }
            }
          },
          title: {
            text: '状态监控'
          },
          xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
          },
          yAxis: {
            title: {
              text: '%'
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
      ws.onopen = (e) => {
        console.log("建立ws连接")
      };
      ws.onclose = (e) => {
        console.log("断开ws连接")
      };
      ws.onmessage = this.onmessage;
      ws.onerror = (e) => {
        console.log("ws错误")
      };
    },
    methods: {
      onmessage(e) {
        let res = JSON.parse(e.data);
        for (let i = 0; i < res.length; i++) {
          this.allData[res[i].host_ip].cpu.push(res[i].cpu);
          this.allData[res[i].host_ip].disk.push(res[i].disk);
          this.allData[res[i].host_ip].package_recv.push(res[i].io.package_recv);
          this.allData[res[i].host_ip].package_sent.push(res[i].io.package_sent);
          this.allData[res[i].host_ip].mem.push(res[i].mem);
          this.allData[res[i].host_ip].timestamp.push(res[i].timestamp);
        }
        // console.log(this.allData);

        let keys = Object.keys(this.allData);
        for (let i = 0; i < keys.length; i++) {
          let ip = keys[i];
          // console.log(this.charts);
          let c = Highcharts.chart(ip, {
            chart: {
              events: {
              },
            },
            title: {
              text: '用量'
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
                name: 'cpu',
                data: this.allData[ip].cpu
              },
              {
                name: 'disk',
                data: this.allData[ip].disk
              },
              {
                name: 'mem',
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
          title: '确定要删除吗？',
          content: licence.licenseName,
          onOk: () => {
            store.dispatch('deleteLicence', licence);
          }
        });
      },
      // 新增凭据
      newLicence() {
        this.$Modal.confirm({
          title: '检查一下',
          content: `凭据名称：${this.licence.name}\n凭据密码：${this.licence.pwd}`,
          onOk: () => {
            store.dispatch('newLicence', this.licence);
            this.licence = '';
            this.pwd = ''
          }
        });
      },
    },
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <Card title="集群LIST" :bordered="false">
      <Spin size="large" fix v-if="$store.state.showSpin"></Spin>

      <div v-show="$store.state.pods.length === 0" style="text-align: center">
        暂无数据
      </div>

      <Row :gutter="16">
        <Col span="8" v-for="(item, index) in $store.state.pods" :key="index">
          <Card>
            <p slot="title">
              <Badge status="processing"></Badge>
              {{item.podName}}
            </p>

            <div slot="extra">
              <Tag :color="item.status === 0 ? 'success': 'default'">{{item.statusStr}}</Tag>
            </div>

            <div>
              创建时间：{{new Date(item.createTime).toLocaleDateString()}}<br>
              节点数：{{item.nodeNumber}}<br>
              对外服务：{{item.gateWayIp}}:{{item.nodePort}}<br>
              服务名：{{item.nginxName}}<br>
              <Row>
                <Col span="6">
                  <Button @click="handleStartPod(item)" size="small" long type="success">启动</Button>
                </Col>
                <Col span="6">
                  <Button @click="handleStopPod(item)" size="small" long type="error">停止</Button>
                </Col>
                <Col span="6">
                  <Button @click="handleAdjustPod(item)" size="small" long type="warning">扩容</Button>
                </Col>
                <Col span="6">
                  <Button @click="handleRemovePod(item)" size="small" long type="error" ghost>移除</Button>
                </Col>
              </Row>
              <Button @click="handleShowDetail(item)" size="large" type="primary" long>详细信息</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>

    <Drawer :title="pod_detail.podName + '详情'" width="60" v-model="showDetail">
      <Tabs value="0" style="padding-bottom: 20px">
        <TabPane v-for="(host, index) in pod_detail.hosts"
                 :label="host.ip" :name="`${index}`" :key="index">
          <Row>
            <Col span="8" v-for="(container, index) in host.containers" :key="index">
              <Card>
                {{container}}
                <Button size="small" type="primary"
                        @click="handleShowContainerLoadInfo(container, index, host)">负载信息
                </Button>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <Modal v-model="showContainerLoadModal">
        <div id="container" style="width: 500px; height: 300px"></div>
      </Modal>

      <div id="pod_avg_load" style="width: 800px; height: 300px"></div>
      <div id="pod_tree" style="width: 800px; height: 100%"></div>
    </Drawer>
  </div>
</template>

<script>
  import {
    listPod,
    getContainerLoadInfo,
    removePod,
    startPod, stopPod,
    adjustPod
  } from '../../api/cluster';

  let echarts = require('echarts');

  export default {
    name: "List",
    data() {
      return {
        // pods: {},
        showDetail: false,
        pod_detail: {},
        loading: false,
        showContainerLoadModal: false,
      }
    },
    methods: {
      // 查看集群详情
      handleShowDetail(item) {
        this.showDetail = true;
        this.pod_detail = item;
        let pod_avg_load_chart = echarts.init(document.getElementById('pod_avg_load'), 'light');
        pod_avg_load_chart.setOption({
          title: {
            text: '集群平均负载'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: true
            }
          },
          xAxis: {
            type: 'category',
            data: item.avgLoad.mem.xaxis
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: 'mem',
            data: item.avgLoad.mem.data,
            type: 'line',
            smooth: true
          }, {
            name: 'cpu',
            data: item.avgLoad.cpu.data,
            type: 'line',
            smooth: true
          },]
        });

        let pod_tree_chart = echarts.init(document.getElementById('pod_tree'), 'light');
        pod_tree_chart.setOption({
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series: [
            {
              type: 'tree',
              data: [item.hostTree],
              top: '1%',
              left: '7%',
              bottom: '1%',
              right: '20%',
              symbolSize: 7,
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
              },
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        });
      },

      // 查看单个容器的负载信息
      handleShowContainerLoadInfo(container, index, host) {
        this.showContainerLoadModal = true;
        let container_load_chart = echarts.init(document.getElementById('container'), 'light');
        container_load_chart.showLoading();
        getContainerLoadInfo({
          ip: host.ip,
          containerId: container
        }).then(res => {
          container_load_chart.hideLoading();
          container_load_chart.setOption({
            title: {
              text: '容器负载'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: true
              }
            },
            xAxis: {
              type: 'category',
              data: res.data.mem.xaxis
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name: 'mem',
              data: res.data.mem.data,
              type: 'line',
              smooth: true
            }, {
              name: 'cpu',
              data: res.data.cpu.data,
              type: 'line',
              smooth: true
            },]
          });
        });
      },

      // 移除集群
      handleRemovePod(item) {
        this.$Modal.confirm({
          title: `<p style="color: red">此操作会移除集群的所有节点!</p>`,
          content: `是否移除集群服务：${item.podName}`,
          onOk: () => {
            removePod({cluster: item.id}).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.msg);
                this.listPodInfo();
              } else {
                this.$Message.error(res.msg);
              }
            });
          }
        });
      },

      // 启动集群
      handleStartPod(item) {
        startPod({cluster: item.id}).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            this.listPodInfo();
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 停止集群
      handleStopPod(item) {
        stopPod({cluster: item.id}).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg);
            this.listPodInfo();
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      handleAdjustPod(item) {
        let newSize = 0;
        this.$Modal.confirm({
          title: '扩容后节点数',
          render: (h) => {
            return h('InputNumber', {
              props: {
                value: newSize,
                autofocus: true,
                placeholder: '节点个数',
                min: 0
              },
              on: {
                input: (val) => {
                  newSize = val;
                }
              }
            })
          },
          onOk: () => {
            adjustPod({newSize: newSize, clusterId: item.id,}).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.msg);
                this.$store.dispatch('listPodInfo');
              } else {
                this.$Message.success(res.msg);
              }
            });
          },
        });
      },

      // 获取集群信息
      listPodInfo() {
        listPod().then(res => {
          this.pods = res.data;
          this.loading = false;
        });
      },
    },
    mounted() {
      this.$store.dispatch('listPodInfo');
    },
  }
</script>

<style scoped>

</style>

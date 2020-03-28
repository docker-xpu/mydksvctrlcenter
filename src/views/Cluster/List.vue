<template>
  <div>
    <Card title="集群LIST" :bordered="false">
      <Spin size="large" fix v-if="loading"></Spin>

      <Row :gutter="16">
        <Col span="8" v-for="(item, index) in pods" :key="index">
          <Card>
            <p slot="title">
              <Badge status="processing"></Badge>
              {{item.podName}}
            </p>
            <div>
              创建时间：{{new Date(item.createTime).toLocaleDateString()}}<br>
              节点数：{{item.nodeNumber}}<br>
              对外服务：{{item.gateWayIp}}:{{item.nodePort}}<br>
              服务名：{{item.nginxName}}<br>
              <Button @click="handleShowDetail(item)" type="primary" long>详细信息</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>

    <Drawer :title="pod_detail.podName + '详情'" width="60" :closable="false" v-model="showDetail">
      {{pod_detail.hostTree}}
      <Tabs value="0" style="padding-bottom: 20px">
        <TabPane v-for="(host, index) in pod_detail.hosts"
                 :label="host.ip" :name="`${index}`" :key="index">
          <Row>
            <Col span="8" v-for="(container, index) in host.containers" :key="index">
              <Card>
                {{container}}
                <Button size="small" type="primary" @click="handleShowContainerLoadInfo(container, index, host)">负载信息</Button>
                <div :id="'container' + index"></div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <div id="pod_avg_load" style="width: 800px; height: 300px"></div>
      <div id="pod_tree" style="width: 800px; height: 100%"></div>
    </Drawer>
  </div>
</template>

<script>
  import {listPod, getContainerLoadInfo} from '../../api/cluster';

  export default {
    name: "List",
    data() {
      return {
        pods: {},
        showDetail: false,
        pod_detail: {},
        loading: true,
      }
    },
    methods: {
      // 查看集群详情
      handleShowDetail(item) {
        this.showDetail = true;
        this.pod_detail = item;
        console.log(item);
        let echarts = require('echarts');
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

      handleShowContainerLoadInfo(container, index, host) {
        console.log(container, index, host);
        let echarts = require('echarts');
        let container_load_chart = echarts.init(document.getElementById('container' + index), 'light');
        console.log(container_load_chart);
        getContainerLoadInfo({
          ip: host.ip,
          containerId: container
        }).then(res=>{
          console.log(res);
        });
      },
    },
    mounted() {
      listPod().then(res => {
        this.pods = res.data;
        this.loading = false;
      });
    },
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <Row :gutter="16">
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }">
        <Card title="已有镜像" icon="ios-appstore" :padding="0" shadow>
          <Spin size="large" fix v-if="$store.state.showSpin"></Spin>
          <CellGroup @on-click="onCellSelected">
            <Cell v-for="(item, index) in $store.state.images" :key="index" :title="item.name" :name="index"
                  :selected="selectedImage === index">
              <Badge :count="item.tags.length" slot="extra"></Badge>
            </Cell>
          </CellGroup>
        </Card>
      </Col>
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 18, offset: 0 }">
        <Card shadow>
          <Spin size="large" fix v-if="$store.state.showSpin"></Spin>
          <div slot="title">
            {{$store.state.images[selectedImage].name}}
            <Divider type="vertical"></Divider>
            <Tag v-for="(tag, index) in $store.state.images[selectedImage].tags" :key="index" type="border"
                 color="primary">
              {{tag.tagName}}
            </Tag>
          </div>

          <Table border :columns="tagsColumn" :data="$store.state.images[selectedImage].tags">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px">查看</Button>
              <Button type="error" size="small" @click="handleRemoveImageBtnClick(row, index)">删除</Button>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {removeImages} from '../api/images';

  export default {
    name: "Images",
    data() {
      return {
        tagsColumn: [
          {
            title: 'tagName',
            key: 'tagName'
          },
          {
            title: 'sha256',
            key: 'sha256'
          },
          {
            title: 'Action',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        selectedImage: 0
      }
    },
    methods: {
      // 当选中 cell
      onCellSelected(name) {
        this.selectedImage = name;
      },

      // 删除镜像
      handleRemoveImageBtnClick(row, index) {
        this.$Modal.confirm({
          title: '你确定这么做吗？',
          content: `删除Tag：${this.$store.state.images[this.selectedImage].name}:${row.tagName}`,
          onOk: () => {
            removeImages({
              name: this.$store.state.images[this.selectedImage].name,
              sha256: row.sha256
            }).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.msg);
                this.$store.dispatch('getAllImages');
              } else {
                this.$Message.error(res.msg);
              }
            });
          }
        });
      },
    },
    mounted() {
      this.$store.dispatch('getAllImages');
    },
  }
</script>

<style scoped>

</style>

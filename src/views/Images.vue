<template>
  <div>
    <Row :gutter="16">
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }">
        <Card title="已有镜像" icon="ios-appstore" :padding="0" shadow>
          <CellGroup>
            <Cell><Input search enter-button placeholder="Enter something..."></Input></Cell>
            <Cell title="Only show titles"></Cell>
            <Cell title="Display label content" label="label content"></Cell>
            <Cell title="Display right content" extra="details"></Cell>
            <Cell title="Link" extra="details" to="/components/button"></Cell>
            <Cell title="Open link in new window" to="/components/button" target="_blank"></Cell>
            <Cell title="Disabled" disabled></Cell>
            <Cell title="Selected" selected></Cell>
            <Cell title="With Badge" to="/components/badge">
              <Badge :count="10" slot="extra"></Badge>
            </Cell>
            <Cell title="With Switch">
              <Switch slot="extra"></Switch>
            </Cell>
          </CellGroup>
        </Card>
      </Col>
      <Col :md="{ span: 24, offset: 0 }" :lg="{ span: 18, offset: 0 }">
        <Card shadow>
          <Tag type="border" color="primary">标签一</Tag>
          <Tag type="border" color="success">标签二</Tag>
          <Tag type="border" color="error">标签三</Tag>
          <Tag type="border" color="warning">标签四</Tag>

          <Table border :columns="columns12" :data="data6">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
              <Button type="error" size="small" @click="remove(index)">Delete</Button>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "Images",
    data () {
      return {
        columns12: [
          {
            title: 'Name',
            slot: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Action',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        data6: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park'
          }
        ]
      }
    },
    methods: {
      show (index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>

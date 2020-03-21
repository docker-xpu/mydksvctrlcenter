<template>
  <div>
    <Row :gutter="16">
      <Col span="16">
        <Card>
          <p slot="title">
            网络列表
          </p>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <p slot="title">
            创建网络
            <span style="color: gray">目前支持 bridge 网络模式</span>
          </p>
          <div>
            <Form>
              <FormItem>
                <label>网络名：
                  <Input></Input>
                </label>
              </FormItem>
              <FormItem>
                <Button type="primary" long @click="handleAddNetwork">创建</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "Network",
    data() {
      return {
        name: '',
      }
    },
    methods: {
      handleAddNetwork() {
      },
    },
  }
</script>

<style scoped>

</style>

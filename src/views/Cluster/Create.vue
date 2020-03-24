<template>
  <div>
    <Card title="创建集群" :bordered="false">
      <Form :label-width="100">
        <FormItem label="集群名：">
          <Input placeholder="例如：xxx服务"></Input>
        </FormItem>
        <FormItem label="镜像：">
          <Input placeholder="例如：mynginx"></Input>
        </FormItem>
        <FormItem label="容器数量：">
          <InputNumber :min="1" placeholder="例如：4"></InputNumber>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "Create"
  }
</script>

<style scoped>

</style>

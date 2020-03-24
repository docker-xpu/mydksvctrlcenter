<template>
  <div>
    <Row :gutter="16">
      <Col span="12">
        <Create></Create>
      </Col>
      <Col span="12">
        <List></List>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Create from "./Cluster/Create";
  import List from "./Cluster/List";
  export default {
    name: "Cluster",
    components: {List, Create},
  }
</script>

<style scoped>

</style>

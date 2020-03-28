<template>
  <div>
    <List></List>
    <Create style="padding-top: 20px"></Create>
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

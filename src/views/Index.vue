<template>
  <div>
    <div style="text-align: center">
      <img style="width: 100px" src="../assets/中国国旗.png" alt="love">
      <span style="color: red; font-size: 100px">战 疫</span>
      <br>
      <p style="color: red;">感谢逆行的白衣战士、志愿者、人民警察、人民军队！</p>
      <p style="color: red;">感谢捐款捐物的各国华侨、华人、国际友人！</p>
      <p style="color: red;">感谢宅在家为祖国做贡献的人们！</p>
      <p style="color: red;">……</p>
      <p style="color: red;">祖国加油！</p>
    </div>

    <Row>
      <Col span="6">-</Col>
      <Col span="12">
        <Card :bordered="false">
          <p slot="title">NEWS</p>
          <List item-layout="vertical">
            <ListItem v-for="(item, index) in news" :key="index">
              <ListItemMeta :title="item.title">
                <div slot="description">
                  {{item.summary}}

                </div>
              </ListItemMeta>
              <template slot="action">
                <li>
                  {{item.pubDateStr}}
                </li>
                <li>
                  <a :href="item.sourceUrl" target="view_window">{{item.infoSource}}</a>
                </li>
              </template>
            </ListItem>
          </List>

          <p style="text-align: center">第 {{page_num}} 页</p>
          <Row>
            <Col span="12">
              <Button long :disabled="page_num === 1" @click="getNews(page_num-1, page_size)">上一页</Button>
            </Col>
            <Col span="12">
              <Button long @click="getNews(page_num+1, page_size)">下一页</Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span="6">-</Col>
    </Row>

    <Logo width="150px"></Logo>
    <div style="text-align: center">@ 西安工程大学 - 筋斗云团队</div>
  </div>
</template>

<script>
  import Logo from "../components/Logo";

  export default {
    name: "Index",
    components: {Logo},
    data() {
      return {
        total_data: {},
        news: [],
        page_num: 1,
        page_size: 5
      }
    },
    methods: {
      getTotalData() {
        this.$axios.get('http://www.dzyong.top:3005/yiqing/total').then(res => {
          this.total_data = res.data.data[0];
        });
      },
      getNews(pageNum = 1, pageSize = 5) {
        this.page_num = pageNum;
        this.page_size = pageSize;
        this.$Loading.start();
        let url = `http://www.dzyong.top:3005/yiqing/news?pageNum=${pageNum}&pageSize=${pageSize}`;
        this.$axios.get(url).then(res => {
          this.$Loading.finish();
          this.news = res.data.data;
        }).catch(err=>{
          this.$Loading.error();
        })
      },
    },
    mounted() {
      this.getTotalData();
      this.getNews(1, 5);
    },
  }
</script>

<style scoped>

</style>

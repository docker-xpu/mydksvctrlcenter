<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div style="text-align: center">
          <a href="/">
            <img ref="logo" src="@/assets/logo-without-text.png" style="width: 100px; text-align: center" alt="logo">
          </a>
        </div>
        <!--        active-name="hosts" -->
        <Menu theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="hosts" to="hosts">
            <Icon type="logo-windows"></Icon>
            <span>主机管理</span>
          </MenuItem>
          <!-- todo -->
          <MenuItem name="images">
            <Icon type="ios-appstore"></Icon>
            <span>镜像管理</span>
          </MenuItem>
          <MenuItem name="networks">
            <Icon type="ios-globe"></Icon>
            <span>网络管理</span>
          </MenuItem>
          <MenuItem name="di">
            <Icon type="ios-apps"></Icon>
            <span>集群管理</span>
          </MenuItem>

          <MenuItem name="about" to="about">
            <Icon type="md-infinite"></Icon>
            <span>关于我们</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu"
                size="24"></Icon>
        </Header>
        <Content class="layout-content" :style="{margin: '20px', minHeight: '260px'}">
          <RouterView></RouterView>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  // @ is an alias to /src
  // import HelloWorld from '@/components/HelloWorld.vue'
  import {newLicence} from '@/api/host'

  export default {
    name: 'Home',
    components: {
      // HelloWorld
    },
    data() {
      return {
        isCollapsed: false,
      }
    },
    computed: {
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
    },
    mounted() {
      // newLicence().then(res => {
      //   console.log(res);
      // }).catch(err => {
      //   console.log(err);
      // });
    },
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
  }

  .layout {
    border-top: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: scroll;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-content {
    /*{margin: '88px 20px 0', flex: '1', opacity: '0.93'}*/
    margin: 88px 20px 0;
    flex: 1;
    opacity: 0.85;
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    /*background: #5b6270;*/
    border-radius: 3px;
    margin: 15px auto;
  }

  .menu-icon {
    transition: all .3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .sider {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>

<template>
  <div class="layout">
    <Layout>
      <!--  返回顶部按钮  -->
      <BackTop :height="100" :bottom="100" :style="{zIndex: '99999'}" @on-click="handleBack2Top">
        <div ref="rocket" class="rocket-con" @mouseout="rocketStop" @mouseover="rocketFly"></div>
      </BackTop>

      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div style="text-align: center">
          <a href="/">
            <img class="advert_avatar" ref="logo" src="../assets/logo-without-text.png" style="width: 100px; text-align: center" alt="logo">
          </a>
        </div>
        <!--        active-name="hosts" -->
        <Menu theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="hosts" to="hosts">
            <Icon type="logo-windows"></Icon>
            <span>主机</span>
          </MenuItem>
          <MenuItem name="images" to="images">
            <Icon type="ios-appstore"></Icon>
            <span>镜像</span>
          </MenuItem>
          <MenuItem name="di" to="cluster">
            <Icon type="ios-apps"></Icon>
            <span>集群</span>
          </MenuItem>
          <MenuItem name="iCode" to="Editor">
            <Icon type="ios-play"></Icon>
            <span>iCode</span>
          </MenuItem>

          <MenuItem name="about" to="about">
            <Icon type="md-infinite"></Icon>
            <span>关于</span>
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

      // 鼠标移动到火箭上时
      rocketFly() {
        this.$refs.rocket.classList.add('fly');
      },
      // 鼠标从火箭上移开时
      rocketStop() {
        this.$refs.rocket.classList.remove('fly');
      },
      // 点击返回顶部按钮
      handleBack2Top() {
        this.$Message.success({background: true, content: '欢迎回来~'});
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

  .advert_avatar {
    width: 20%;
    animation: advert_nav-m 20s linear infinite;
    -moz-animation: advert_nav-m 20s linear infinite;
    /* Firefox */
    -webkit-animation: advert_nav-m 20s linear infinite;
    /* Safari Chrome */
    -o-animation: advert_nav-m 20s linear infinite;
    animation-direction: alternate;
  }
  .advert_avatar:hover {
    animation: advert_nav-x 0.3s linear infinite;
    -moz-animation: advert_nav-x 0.3s linear infinite;
    /* Firefox */
    -webkit-animation: advert_nav-x 0.3s ease-in-out infinite;
    /* Safari Chrome */
    -o-animation: advert_nav-x 0.3s linear infinite;
  }
  .advert_avatar p a img:hover {
    animation: advert_nav-a 1s linear infinite;
    -moz-animation: advert_nav-a 1s linear infinite;
    /* Firefox */
    -webkit-animation: advert_nav-a 1s linear infinite;
    /* Safari Chrome */
    -o-animation: advert_nav-a 1s linear infinite;
  }
  .advert_avatar p a img {
    padding: 5px 15px;
    color: #9a9da0;
    text-decoration: none;
  }
  @keyframes advert_nav-m {
    10% {
      border-color: #ff9292;
    }
    20% {
      border-color: #f09eff;
    }
    30% {
      border-color: #9397ff;
    }
    40% {
      border-color: #9fb8ff;
    }
    50% {
      border-color: #9fd7ff;
    }
    60% {
      border-color: #9fffd2;
    }
    70% {
      border-color: #dfff9f;
    }
    80% {
      border-color: #ffd49f;
    }
    90% {
      border-color: #ffc29f;
    }
    100% {
      border-color: #ffa198;
    }
  }
  @keyframes advert_nav-x {
    10% {
      -webkit-transform: translate(-0.5px, 1.5px) rotate(0.5deg);
      border-color: #ffbebe;
    }
    20% {
      -webkit-transform: translate(-0.5px, 1.5px) rotate(-0.5deg);
      border-color: #ffdebe;
    }
    30% {
      -webkit-transform: translate(-2.5px, -1.5px) rotate(0.5deg);
      border-color: #fff3be;
    }
    40% {
      -webkit-transform: translate(-2.5px, -2.5px) rotate(-1.5deg);
      border-color: #eeffbe;
    }
    50% {
      -webkit-transform: translate(1.5px, 1.5px) rotate(-1.5deg);
      border-color: #f3ffbe;
    }
    60% {
      -webkit-transform: translate(-2.5px, -0.5px) rotate(-0.5deg);
      border-color: #e9ffbe;
    }
    70% {
      -webkit-transform: translate(1.5px, -2.5px) rotate(-0.5deg);
      border-color: #d0ffbe;
    }
    80% {
      -webkit-transform: translate(0.5px, 1.5px) rotate(0.5deg);
      border-color: #beffde;
    }
    90% {
      -webkit-transform: translate(-2.5px, -0.5px) rotate(0.5deg);
      border-color: #beefff;
    }
    100% {
      -webkit-transform: translate(-0.5px, -0.5px) rotate(-1.5deg);
      border-color: #bed8ff;
    }
  }
  @keyframes advert_nav-a {
    10% {
      color: #ff9292;
    }
    20% {
      color: #f09eff;
    }
    30% {
      color: #9397ff;
    }
    40% {
      color: #9fb8ff;
    }
    50% {
      color: #9fd7ff;
    }
    60% {
      color: #9fffd2;
    }
    70% {
      color: #dfff9f;
    }
    80% {
      color: #ffd49f;
    }
    90% {
      color: #ffc29f;
    }
    100% {
      color: #ffa198;
    }
  }

  .rocket-con {
    background: url(../assets/rocket_top.png);
    width: 150px;
    height: 175px;
    cursor: pointer;
    z-index: 99;
  }
  .fly {
    animation: fly .4s steps(1) infinite;
    background-image: url(../assets/rocket_frame.png)
  }
  @keyframes fly {
    0% {
      background-position-x: 0
    }
    25% {
      background-position-x: -150px
    }
    50% {
      background-position-x: -300px
    }
    75% {
      background-position-x: -450px
    }
    to {
      background-position-x: -600px
    }
  }
</style>

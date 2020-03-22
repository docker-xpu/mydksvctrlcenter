<template>
  <div class="about">
    <Logo></Logo>

    <transition>
      <div class="animated fadeInUp advert_avatar" style="margin: 0 auto; width: 40%;">
        <Card :bordered="false" shadow>
          <p slot="title" style="text-align: center">筋斗云</p>
          <div style="text-align: center">
            <a href="http://47.103.14.73:2076/">
              <h2>Index</h2>
            </a>
            <br />
            <a href="https://github.com/docker-xpu">
              <h2>Project</h2>
            </a>
            <br />
            <a href="https://ahojcn.gitee.io/">
              <h2>Packages</h2>
            </a>
            <Divider></Divider>
            @authors<br/>
            <a href="https://github.com/zouchanglin">Tim</a> |
            <a href="https://github.com/ahojcn">ahojcn</a> |
            <a href="https://github.com/MrDalili">MrDalili</a> |
            <a href="https://github.com/Jokseia">yolo</a> |
            <a href="https://github.com/MrsBieber614">MrsBieber614</a>
          </div>
        </Card>
      </div>
    </transition>
  </div>
</template>

<script>
  import Logo from "../components/Logo";
  export default {
    components: {Logo}
  }
</script>

<style scoped>
  /* advert_avatar */
  .advert_avatar {
    border: 3px solid #eee;
    padding: 0;
    width: 20%;
    animation: advert_nav-m 20s linear infinite;
    -moz-animation: advert_nav-m 20s linear infinite;
    /* Firefox */
    -webkit-animation: advert_nav-m 20s linear infinite;
    /* Safari Chrome */
    -o-animation: advert_nav-m 20s linear infinite;
    animation-direction: alternate;
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
</style>

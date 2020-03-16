<template>
  <div>
    <transition>
      <div class="animated rubberBand" style="text-align: center">
        <img class="advert_avatar_no_border" src="../assets/logo-JDCloud.png" alt="logo" />
      </div>
    </transition>

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
export default {
  name: "Logo",
  components: {},
  data() {
    return {};
  }
};
</script>

<style scoped>
  .advert_avatar_no_border {
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
  .advert_avatar_no_border:hover {
    animation: advert_nav-x 0.3s linear infinite;
    -moz-animation: advert_nav-x 0.3s linear infinite;
    /* Firefox */
    -webkit-animation: advert_nav-x 0.3s ease-in-out infinite;
    /* Safari Chrome */
    -o-animation: advert_nav-x 0.3s linear infinite;
  }

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
  @keyframes advert_nav-x {
    10% {
      -webkit-transform: translate(-10.5px, 10.5px) rotate(0.5deg);
      border-color: #ffbebe;
    }
    20% {
      -webkit-transform: translate(-10.5px, 10.5px) rotate(-0.5deg);
      border-color: #ffdebe;
    }
    30% {
      -webkit-transform: translate(-20.5px, -10.5px) rotate(0.5deg);
      border-color: #fff3be;
    }
    40% {
      -webkit-transform: translate(-20.5px, -20.5px) rotate(-1.5deg);
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
</style>

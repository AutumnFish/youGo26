<template>
  <div class="index-container">
    <div class="search-box">
      <input type="text" placeholder="搜索">
      <icon type="search" size="12"></icon>
    </div>
    <!-- 轮播图 -->
    <div class="swiper-container">
      <swiper indicator-dots autoplay circular indicator-active-color="#0094ff">
        <swiper-item v-for="item in swiperList" :key="item.image_src">
          <img mode="aspectFill" :src="item.image_src">
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script>
// 导入hxios模块
import hxios from "../../utils/index.js";
export default {
  data() {
    return {
      // 轮播图数组
      swiperList: []
    };
  },
  // 初始化的时候 获取数据
  async created() {
    let swiperRes = await hxios.get({
      url: "api/public/v1/home/swiperdata"
    });
    // console.log(swiperRes);
    this.swiperList = swiperRes.data.message;
  }
};
</script>

<style lang="scss">
$uRed: #ff2d4a;
.index-container {
  padding-top: 100rpx;
}
.search-box {
  background: $uRed;
  padding: 20rpx 16rpx;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding-left: 376rpx;
    background-color: white;
    font-size: 24rpx;
    height: 60rpx;
    border-radius: 10rpx;
  }
  icon {
    position: absolute;
    // 父盒子
    left: 50%;
    top: 50%;
    // 自己
    transform: translate(-50%, -50%);
  }
}
.swiper-container {
  swiper{
    height: 340rpx;
    swiper-item{
      height: 100%;
    }
  }
  img {
    display: block;
    width: 100%;
    height:100%;
  }
}
</style>

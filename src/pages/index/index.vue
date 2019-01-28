<template>
  <div class="index-container">
    <!-- 使用组件 -->
    <searchbox></searchbox>
    <!-- 轮播图 -->
    <div class="swiper-container">
      <swiper indicator-dots autoplay circular indicator-active-color="#0094ff">
        <swiper-item v-for="item in swiperList" :key="item.image_src">
          <img mode="aspectFill" :src="item.image_src">
        </swiper-item>
      </swiper>
    </div>
    <!-- 分类按钮区域 -->
    <div class="category-container">
      <div class="item" v-for="item in categoryList">
        <img :src="item.image_src" alt>
        <p>{{item.name}}</p>
      </div>
    </div>
    <!-- 楼层区域 -->
    <div class="floor-container">
      <div class="floor" v-for="item in floorList">
        <!-- 顶部 -->
        <div class="top">
          <img :src="item.floor_title.image_src" alt>
          <h3>{{item.floor_title.name}}</h3>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <img v-for="(it,i)  in item.product_list" :src="it.image_src" alt>
        </div>
      </div>
    </div>
    <!-- 我是底线 -->
    <div class="bottom-line">
      <i class="iconfont icon-xiao"></i>
      我是有底线的
    </div>
    <!-- 返回顶部 -->
    <div class="back-top" @click="tTop" v-show="isShow">
      <i class="iconfont icon-jiantoushang"></i>
      顶部
    </div>
  </div>
</template>

<script>
// 导入hxios模块
import hxios from "../../utils/index.js";
// 导入组件
import searchbox from "../../components/searchBox.vue";
export default {
  data() {
    return {
      // 轮播图数组
      swiperList: [],
      // 分类按钮数组
      categoryList: [],
      // 楼层数据
      floorList: [],
      // 是否显示回到顶部
      isShow: false
    };
  },
  // 注册组件
  components: {
    searchbox
  },
  // 初始化的时候 获取数据
  // async onLoad() {
  async onShow() {
    // 轮播图数据
    // let swiperRes = await hxios.get({
    //   url: "api/public/v1/home/swiperdata"
    // });
    // // console.log(swiperRes);
    // this.swiperList = swiperRes.data.message;

    // // 分类按钮的数据
    // let categoryRes = await hxios.get({
    //   url: "api/public/v1/home/catitems"
    // });
    // // console.log(categoryRes);
    // this.categoryList = categoryRes.data.message;

    // // 获取楼层数据
    // let floorRes = await hxios.get({
    //   url: "api/public/v1/home/floordata"
    // });
    // // console.log(floorRes);
    // this.floorList = floorRes.data.message;

    // 一次获取3个
    let p1 = hxios.get({
      url: "api/public/v1/home/swiperdata"
    });
    let p2 = hxios.get({
      url: "api/public/v1/home/catitems"
    });
    let p3 = hxios.get({
      url: "api/public/v1/home/floordata"
    });

    // 一次性发送所有的请求
    let totalRes = await Promise.all([p1, p2, p3]);
    // console.log(totalRes);
    this.swiperList = totalRes[0].data.message;
    this.categoryList = totalRes[1].data.message;
    this.floorList = totalRes[2].data.message;
  },
  // 滚动事件
  onPageScroll(event) {
    // console.log(event);
    if (event.scrollTop > 170) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  },
  methods: {
    // 返回顶部
    tTop() {
      wx.pageScrollTo({
        scrollTop: 0, //滚动到页面的目标位置（单位px）,
        duration: 300 //滚动动画的时长，默认300ms，单位 ms,
      });
    }
  }
};
</script>

<style lang="scss">
$uRed: #ff2d4a;
.index-container {
  padding-top: 100rpx;
}

.swiper-container {
  swiper {
    height: 340rpx;
    swiper-item {
      height: 100%;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
// 分类按钮区域
.category-container {
  display: flex;
  padding-top: 24rpx;
  padding: 29rpx;
  background-color: white;
  .item {
    flex: 1;
    img {
      display: block;
      width: 128rpx;
      height: 128rpx;
      margin: 0 auto;
    }
    p {
      text-align: center;
      margin-top: 10rpx;
      font-size: 24rpx;
    }
  }
}

// 楼层数据
.floor-container {
  .floor {
    .top {
      padding-top: 30rpx;
      padding-bottom: 30rpx;
      padding-left: 15rpx;
      position: relative;
      height: 90rpx;
      box-sizing: border-box;
      h3 {
        color: #ff7b94;
        position: absolute;
        left: 30rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      img {
        position: absolute;
        height: 90rpx;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
      }
    }
    .bottom {
      padding: 20rpx 0 0 16rpx;
      overflow: hidden;
      img {
        display: block;
        width: 33.333%;
        float: left;
        width: 230rpx;
        height: 190rpx;
        margin-right: 10rpx;
        &:first-child {
          width: 230rpx;
          height: 390rpx;
        }
        &:nth-child(2) {
          margin-bottom: 10rpx;
        }
        &:nth-child(3) {
          margin-bottom: 10rpx;
        }
      }
    }
  }
}
// 底线
.bottom-line {
  display: flex;
  justify-content: center;
  color: #999999;
  font-size: 24rpx;
  margin-top: 20rpx;
}
// 返回顶部
.back-top {
  position: fixed;
  bottom: 15rpx;
  right: 15rpx;
  text-align: center;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: #0094ff;
  font-size: 26rpx;
}
</style>

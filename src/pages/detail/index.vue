<template>
  <div class="detail-container">
    <!-- 轮播图 -->
    <swiper indicator-dots autoplay circular>
      <swiper-item v-for="(item, index) in goodsDetail.pics" :key="item.pics_id">
        <img @click="showPreviewImg(item.pics_big_url)" mode="aspectFill" :src="item.pics_mid_url">
      </swiper-item>
    </swiper>
    <!-- 商品信息 -->
    <div class="goodsInfo-box">
      <div class="top">¥:{{goodsDetail.goods_price}}</div>
      <div class="mid">
        <div class="left">{{goodsDetail.goods_name}}</div>
        <div class="right">
          <span class="iconfont icon-shoucang"></span>
          收藏
        </div>
      </div>
      <div class="bottom">快递:&nbsp;&nbsp;&nbsp;&nbsp;免运费</div>
    </div>
    <!-- 选项 -->
    <div class="options">
      <div class="option">
        促销
        <span class="red">满300减30</span>
      </div>
      <div class="option">
        已选
        <span>黑色/S/1件</span>
      </div>
    </div>
    <div class="options">
      <div class="option" @click="chooseAddress">
        送至
        <span>
          {{address}}
          <span class="iconfont icon-jiantouyou"></span>
        </span>
      </div>
    </div>
    <!-- tab -->
    <div class="tab-bar">
      <div class="item" :class="{active:index==0}" @click="index=0">图文介绍</div>
      <div class="item" :class="{active:index==1}" @click="index=1">规格参数</div>
    </div>
    <div class="tab-content">
      <div class="item" v-show="index==0" v-html="goodsDetail.goods_introduce"></div>
      <div class="item" v-show="index==1">
        <!-- 参数 -->
        <div class="attrs" v-for="(item, index) in goodsDetail.attrs" :key="item.attr_id">
          <div class="attr-name">{{item.attr_name}}</div>
          <div class="attr-value">{{item.attr_value}}</div>
        </div>
      </div>
    </div>
    <!-- 底部操纵区域 -->
    <div class="bottom-box">
      <div class="service">
        <span class="iconfont icon-kefu"></span>
        联系客服
      </div>
      <div class="cart" @click="toCart">
        <span class="iconfont icon-gouwuche"></span>
        购物车
      </div>
      <button @click="add2Cart">加入购物车</button>
      <button>立即购买</button>
    </div>
  </div>
</template>

<script>
// 导入ajax
import hxios from "../../utils/index.js";
export default {
  data() {
    return {
      // 详情数据
      goodsDetail: {},
      // 用户地址
      address: "",
      // tab的索引
      index: 0
    };
  },
  // 获取数据
  async onLoad(options) {
    // console.log(options);
    let goods_id = options.goods_id;
    // ajax获取数据
    let res = await hxios.get({
      url: `api/public/v1/goods/detail?goods_id=${goods_id}`
    });
    // console.log(res);
    // 保存起来
    this.goodsDetail = res.data.message;

    // 读取缓存
    wx.getStorage({
      key: "address",
      success: res => {
        // console.log(res.data)
        this.address =
          res.data.provinceName +
          " " +
          res.data.cityName +
          " " +
          res.data.countyName;
      },
      fail: () => {},
      complete: () => {}
    });
  },
  // 方法
  methods: {
    // 显示大图预览
    showPreviewImg(pics_big_url) {
      // 新建一个数组 根据返回的内容
      let urls = this.goodsDetail.pics.map(v => v.pics_big_url);
      // 微信自带的api
      wx.previewImage({
        urls,
        current: pics_big_url
      });
    },
    // 地址选择
    chooseAddress() {
      // 使用微信的api
      wx.chooseAddress({
        success: res => {
          // console.log(res.userName);
          // console.log(res.postalCode);
          console.log(res.provinceName);
          console.log(res.cityName);
          console.log(res.countyName);
          // console.log(res.detailInfo);
          // console.log(res.nationalCode);
          // console.log(res.telNumber);
          this.address =
            res.provinceName + " " + res.cityName + " " + res.countyName;

          // 缓存起来
          wx.setStorage({
            key: "address",
            data: res
          });
        }
      });
    },
    // 去购物车
    toCart() {
      // 对于tabbar管理的页面不能够使用 navigateTo跳转
      // wx.navigateTo({ url: "/pages/cart/main" });
      wx.switchTab({ url: "/pages/cart/main" });
    },
    // 加入购物车
    add2Cart() {
      // 读取缓存
      wx.getStorage({
        key: "cart",
        success: res => {
          console.log(res.data);
          // 判断是否存在
          // 存在 累加
          if (res.data[this.goodsDetail.goods_id]) {
            // 已经存在这个商品
            res.data[this.goodsDetail.goods_id]++;
          } else {
            // 没有添加这个商品
            res.data[this.goodsDetail.goods_id] = 1;
          }
          // 缓存起来
          wx.setStorage({
            key: "cart",
            data: res.data
          });
        },
        fail: () => {
          // 没有东西
          // 不存在 新增
          let cartData = {};
          cartData[this.goodsDetail.goods_id] = 1;
          // 重新保存到缓存中
          wx.setStorage({
            key: "cart",
            data: cartData
          });
        },
        complete: () => {
          // 统一提示用户
          wx.showToast({
            title: "添加成功", //提示的内容,
            icon: "success", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
$uRed: #eb4450;
// 整体设置背景色
.detail-container {
  background-color: #ccc;
  padding-bottom: 90rpx;
}
// 轮播图
swiper {
  height: 720rpx;
  swiper-item {
    height: 100%;
    img {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
// 商品信息
.goodsInfo-box {
  padding-left: 16rpx;
  background-color: white;
  .top {
    font-size: 46rpx;
    color: $uRed;
    padding: 40rpx 0;
  }
  .mid {
    display: flex;
    .left {
      flex: 1;
      font-size: 30rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      padding-right: 80rpx;
    }
    .right {
      width: 140rpx;
      border-left: 1rpx solid#dddddd;
      text-align: center;
      font-size: 24rpx;
      color: #999;
      span {
        display: block;
      }
    }
  }
  .bottom {
    font-size: 28rpx;
    color: #999999;
    padding: 30rpx 0;
  }
}
// 选项信息
.options {
  margin-top: 20rpx;
  background-color: white;
  .option {
    height: 100rpx;
    line-height: 100rpx;
    padding-left: 15rpx;
    font-size: 30rpx;
    span {
      color: #998d92;
    }
    span.red {
      color: $uRed;
    }
  }
  // 第一个options
  // 小程序不兼容这个选择器
  // &:first-of-type {
  //   .option:first-child {
  //     span {
  //       color: $uRed;
  //     }
  //   }
  // }
}
// tab区域
.tab-bar {
  display: flex;
  height: 100rpx;
  background-color: white;
  .item {
    flex: 1;
    line-height: 100rpx;
    font-size: 26rpx;
    text-align: center;
    &.active {
      color: $uRed;
      border-bottom: 10rpx solid $uRed;
    }
  }
}
// tab 内容部分
.tab-content {
  background-color: white;
  .item {
    padding: 10rpx;
    .attrs {
      display: flex;
      text-align: center;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 22rpx;
      margin-top: -1rpx;
      .attr-name {
        flex: 1;
        border: 1rpx solid #ccc;
      }
      .attr-value {
        flex: 1;
        border: 1rpx solid #ccc;
        margin-left: -1rpx;
      }
    }
  }
}
// 底部控制区域
.bottom-box {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90rpx;
  text-align: center;
  background-color: white;
  .iconfont {
    display: block;
  }
  .service {
    flex: 2;
    font-size: 18rpx;
    padding-top: 15rpx;
  }
  .cart {
    flex: 2;
    font-size: 18rpx;
    padding-top: 15rpx;
  }
  button {
    flex: 3;
    background-color: #ffb400;
    color: white;
    border-radius: 0;
    border: none;
    &:last-child {
      background-color: $uRed;
    }
  }
}
</style>

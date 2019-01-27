<template>
  <div class="mime-container">
    <!-- 头部 -->
    <div class="header">
      <div class="icon-box">
        <i class="iconfont icon-shezhi"></i>
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">
          <img :src="icon" alt>
        </button>
        <i class="iconfont icon-xiaoxi"></i>
      </div>
      <p>{{info}}</p>
    </div>
    <div class="body-box">
      <!-- 历史 -->
      <div class="history-box">
        <div class="item">
          <p>0</p>
          <p>收藏的店铺</p>
        </div>
        <div class="item">
          <p>0</p>
          <p>收藏的商品</p>
        </div>
        <div class="item">
          <p>0</p>
          <p>关注的商品</p>
        </div>
        <div class="item">
          <p>0</p>
          <p>我的足迹</p>
        </div>
      </div>
      <!-- 订单 -->
      <div class="order-box">
        <div class="title">我的订单</div>
        <div class="bottom">
          <div class="item">
            <i class="iconfont icon-daifukuan"></i>
            待付款
          </div>
          <div class="item">
            <i class="iconfont icon-daishouhuo"></i>
            待收货
          </div>
          <div class="item">
            <i class="iconfont icon-tuikuan"></i>
            退款/退货
          </div>
          <div class="item">
            <i class="iconfont icon-dingdan"></i>
            全部订单
          </div>
        </div>
      </div>
      <!-- 选项区域 -->
      <div class="option-box">
        <div class="option" @click="getAddress">
          <div class="left">收货地址管理</div>
          <div class="right">
            <i class="iconfont icon-jiantouyou"></i>
          </div>
        </div>
      </div>
      <div class="option-box">
        <div class="option">
          <div class="left" @click="callKF">联系客服</div>
          <div class="right">400-618-4000</div>
        </div>
        <div class="option">
          <div class="left">意见反馈</div>
          <div class="right">
            <i class="iconfont icon-jiantouyou"></i>
          </div>
        </div>
        <div class="option">
          <div class="left">关于我们</div>
          <div class="right">
            <i class="iconfont icon-jiantouyou"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icon: "/static/icon.png",
      info: "登录/注册"
    };
  },
  // 方法
  methods: {
    getUserInfo(event) {
      // console.log(event);
      this.icon = event.mp.detail.userInfo.avatarUrl;
      this.info = event.mp.detail.userInfo.nickName;
    },
    // 地址获取
    getAddress() {
      wx.chooseAddress({
        success(res) {
          console.log(res.userName);
          console.log(res.postalCode);
          console.log(res.provinceName);
          console.log(res.cityName);
          console.log(res.countyName);
          console.log(res.detailInfo);
          console.log(res.nationalCode);
          console.log(res.telNumber);
        }
      });
    },
    // 打电话给客服
    callKF() {
      wx.makePhoneCall({
        phoneNumber: "15311110721" // 仅为示例，并非真实的电话号码
      });
    }
  }
};
</script>

<style lang="scss">
$uRed: #ff2d4a;
page {
  background-color: #0094ff;
}
.header {
  height: 430rpx;
  background-color: $uRed;
  padding-top: 120rpx;
  box-sizing: border-box;
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      color: white;
    }
    button {
      margin: 0 65rpx;
      width: 130rpx;
      border-radius: 50%;
      height: 130rpx;
      overflow: hidden;
      border: 5rpx solid white;
      padding: 0;
      img {
        width: 130rpx;
        height: 130rpx;
      }
    }
  }
  p {
    text-align: center;
    margin-top: 20rpx;
    color: white;
    font-size: 28rpx;
  }
}
.body-box {
  transform: translateY(-26rpx);
  padding: 0 20rpx;
  > div {
    background-color: white;
  }
  .history-box {
    height: 120rpx;
    display: flex;
    align-items: center;
    text-align: center;
    color: #aaa;
    font-size: 22rpx;
    .item {
      flex: 1;
    }
  }
  .order-box {
    margin-top: 20rpx;
    .title {
      height: 90rpx;
      border-bottom: 1rpx solid #aaa;
      line-height: 90rpx;
      padding-left: 30rpx;
      font-size: 30rpx;
    }
    .bottom {
      display: flex;
      align-items: center;
      text-align: center;
      height: 130rpx;
      .item {
        flex: 1;
        font-size: 24rpx;
        i {
          color: $uRed;
          font-size: 60rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
  // 选项区域
  .option-box {
    margin-top: 20rpx;
    padding-left: 30rpx;
    .option {
      height: 84rpx;
      font-size: 28rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 30rpx;
      border-bottom: 1rpx solid #aaa;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>

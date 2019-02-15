<template>
  <div class="order-container">
    <div class="tabbar">
      <div class="item" :class="{active:index==0}" @click="index=0">全部</div>
      <div class="item" :class="{active:index==1}" @click="index=1">待付款</div>
      <div class="item" :class="{active:index==2}" @click="index=2">已付款</div>
      <div class="item" :class="{active:index==3}" @click="index=3">退款/退货</div>
    </div>
    <div class="tab-content">
      <div class="item" v-show="index==0">
        <div class="order-item" v-for="(item, index) in orderList" :key="item.order_id">
          <div class="top">
            <div class="goods-box" v-for="(it, i) in item.goods" :key="it.goods_id">
              <div class="left">
                <img :src="it.goods_small_logo" alt>
              </div>
              <div class="right">
                <div class="title">{{it.goods_name}}</div>
                <div class="goods-bottom">
                  <div class="price">
                    ¥
                    <span>{{it.goods_price}}</span>
                    .00
                  </div>
                  <div class="num">x{{it.goods_number}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mid">共{{item.total_count}}件商品 总计： ¥{{item.total_price}} (商家包邮)</div>
          <div class="bottom">
            <div class="order-num">订单号:{{item.order_number}}</div>
            <button @click="payOrder(item.order_number)">支付</button>
          </div>
        </div>
      </div>
      <div class="item" v-show="index==1">待付款</div>
      <div class="item" v-show="index==2">已付款</div>
      <div class="item" v-show="index==3">退款/退货</div>
    </div>
  </div>
</template>

<script>
// 导入hxios
import hxios from "../../utils/index.js";
export default {
  data() {
    return {
      index: 0,
      // 订单列表
      orderList: []
    };
  },
  async onLoad() {
    // 缓存中获取token
    let token = wx.getStorageSync("token");
    if (token) {
      // 获取数据
      let res = await hxios.get({
        url: "api/public/v1/my/orders/all?type=1",
        header: {
          Authorization: token
        }
      });
      // console.log(res);
      this.orderList = res.data.message.orders;
    } else {
    }
  },
  // 方法
  methods: {
    async payOrder(order_number) {
      let token = wx.getStorageSync("token");
      let res = await hxios.post({
        url: "api/public/v1/my/orders/req_unifiedorder",
        data: {
          order_number
        },
        header: {
          Authorization: token
        }
      });
      // console.log(res);
      // 发起微信api进行支付即可
      wx.requestPayment({
        timeStamp:res.data.message.wxorder.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
        nonceStr:res.data.message.wxorder.nonceStr, //随机字符串，长度为32个字符以下,
        package:res.data.message.wxorder.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
        signType:res.data.message.wxorder.signType, //签名算法，暂支持 MD5,
        paySign:res.data.message.wxorder.paySign, //签名,具体签名方案参见小程序支付接口文档,
        success: res => {},
        fail: () => {},
        complete: () => {}
      });
    }
  }
};
</script>
<style lang="scss" >
.tabbar {
  height: 100rpx;
  display: flex;
  align-items: center;
  text-align: center;
  box-shadow: 0 0 10rpx gray;
  .item {
    font-size: 28rpx;
    flex: 1;
    height: 100%;
    line-height: 100rpx;
    box-sizing: border-box;
    &.active {
      color: #eb4450;
      border-bottom: 10rpx solid #eb4450;
    }
  }
}
.tab-content {
  .item {
  }
  background-color: gray;
}
.order-item {
  padding-left: 20rpx;
  margin-bottom: 20rpx;
  background-color: white;
  .top {
    .goods-box {
      height: 260rpx;
      display: flex;
      border-bottom: 1rpx solid #000;
      .left {
        padding-top: 30rpx;
        margin-right: 30rpx;
        width: 200rpx;
        img {
          display: block;
          width: 200rpx;
          height: 200rpx;
        }
      }
      .right {
        flex: 1;
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 30rpx;
        }
        .goods-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .price {
            color: #eb4450;
            font-size: 24rpx;
            span {
              font-size: 40rpx;
            }
          }
          .num {
            font-size: 22rpx;
          }
        }
      }
    }
  }
  .mid {
    height: 90rpx;
    text-align: right;
    line-height: 90rpx;
    color: gray;
    font-size: 24rpx;
  }
  .bottom {
    height: 90rpx;
    display: flex;
    justify-content: space-between;
    border-top: 1rpx solid gray;
    align-items: center;
    .order-num {
      color: gray;
      font-size: 24rpx;
    }
    button {
      width: 160rpx;
      height: 60rpx;
      text-align: center;
      line-height: 60rpx;
      color: #eb4450;
    }
  }
}
</style>

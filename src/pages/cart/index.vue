<template>
  <div class="cart-container">
    <!-- 空车 -->
    <div v-show="!isFull" class="empty">
      <i class="iconfont icon-gouwuche"></i>
      <p>你还没有添加任何商品</p>
    </div>
    <!-- 非空车 -->
    <div v-show="isFull" class="full">
      <!-- 收货人信息 -->
      <div class="buyer-box" @click="chooseAddress">
        <div class="item">
          <div class="left">收货人:{{buyer}}</div>
          <div class="right">
            {{mobile}}
            <span class="iconfont icon-jiantouyou"></span>
          </div>
        </div>
        <div class="item">收货地址:{{address}}</div>
        <!-- 线段 用div替代 目的是用渐变设置样式 -->
        <div class="line"></div>
      </div>
      <!-- 商品列表 -->
      <div class="goods-box">
        <div class="title">
          <span class="iconfont icon-dianpu"></span> 优购生活馆
        </div>
        <div class="items">
          <div class="item" v-for="(item, index) in goodsList" :key="item.goods_id">
            <div class="item-left">
              <input
                type="radio"
                :checked="item.isSelected"
                @click="item.isSelected=!item.isSelected"
              >
            </div>
            <div class="item-right">
              <div class="goods-left">
                <img :src="item.goods_small_logo" alt>
              </div>
              <div class="goods-right">
                <div class="name">{{item.goods_name}}</div>
                <div class="bottom">
                  <div class="left">
                    ¥
                    <span>{{item.goods_price}}</span>.00
                  </div>
                  <div class="right">
                    <span @click="item.goods_num>1?item.goods_num--:item.goods_num">-</span>
                    <span>{{item.goods_num}}</span>
                    <span @click="item.goods_num++">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部操纵区域 -->
      <div class="bottom-box">
        <div class="left">
          <input type="radio" :checked="isCheckAll" @click="checkAll">
          全选
        </div>
        <div class="right">
          <div class="total-price">
            <div class="top">
              ¥
              <span>{{totalPrice}}</span>.00
            </div>
            <div class="bottom">商家包邮</div>
          </div>
          <button :class="{disabled:totalNum==0}" @click="createOrder">结算({{totalNum}})</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入hxios
import hxios from "../../utils/index.js";
export default {
  data() {
    return {
      // 是否有商品
      isFull: false,
      // 商品列表
      goodsList: [],
      // 买家数据
      buyer: "",
      // 手机
      mobile: "",
      // 收货地址
      address: ""
    };
  },
  // 方法
  methods: {
    chooseAddress() {
      // 选择地址
      wx.chooseAddress({
        success: res => {
          this.buyer = res.userName;
          this.address =
            res.provinceName +
            " " +
            res.cityName +
            " " +
            res.countyName +
            " " +
            res.detailInfo;
          this.mobile = res.telNumber;
          // 缓存地址
          wx.setStorage({
            key: "address",
            data: res
          });
        }
      });
    },
    // 点击全选
    checkAll() {
      // 把所有商品的选中状态 变得跟 自己一样
      console.log(this.isCheckAll);
      // 人为触发 isCheckAll的set方法
      this.isCheckAll = !this.isCheckAll;
    },
    // 创建订单
    async createOrder() {
      if (this.totalNum != 0) {
        // 判断登录
        let token = wx.getStorageSync("token");
        console.log(token);
        if (token) {
          // 准备数据 商品信息
          let goods = this.goodsList.map(v => {
            return {
              goods_id: v.goods_id,
              goods_number: v.goods_num,
              goods_price: v.goods_price
            };
          });
          // 有token
          // 创建订单
          let res = await hxios.post({
            url: "api/public/v1/my/orders/create",
            header: {
              Authorization: token
            },
            data: {
              order_price: this.totalPrice,
              consignee_addr: this.address,
              goods
            }
          });
          // console.log(res);
          // 获取支付信息
          let payRes = await hxios.post({
            url: "api/public/v1/my/orders/req_unifiedorder",
            header: {
              Authorization: token
            },
            data: {
              order_number: res.data.message.order_number
            }
          });
          // console.log(payRes);
          // 调用微信小程序子代的api 发起支付
          wx.requestPayment({
            timeStamp: payRes.data.message.wxorder.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
            nonceStr: payRes.data.message.wxorder.nonceStr, //随机字符串，长度为32个字符以下,
            package: payRes.data.message.wxorder.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
            signType: payRes.data.message.wxorder.signType, //签名算法，暂支持 MD5,
            paySign: payRes.data.message.wxorder.paySign, //签名,具体签名方案参见小程序支付接口文档,
            success: res => {
              // 付完了
              console.log(res);
            },
            fail: () => {},
            complete: () => {}
          });
        } else {
          // 没有登录
          // 去登录页
          wx.showToast({
            title: "哥们,先登录", //提示的内容,
            icon: "warning", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {
              // 去登录页
              wx.switchTab({ url: "/pages/mine/main" });
            }
          });
        }
      } else {
        // 什么都不敢 提示用户
      }
    }
  },
  // 侦听器
  watch: {
    goodsList: {
      handler: function(val, oldVal) {
        // console.log("改变啦");
        // 同步更新到缓存中即可
        // goods_id:个数
        let data = {};
        // 提取出数据
        this.goodsList.forEach(v => {
          data[v.goods_id] = v.goods_num;
        });
        // 覆盖缓存即可
        wx.setStorage({
          key: "cart",
          data
        });
      },
      deep: true
    }
  },
  // 计算属性
  computed: {
    // 全选
    isCheckAll: {
      // 赋值
      set(value) {
        this.goodsList.forEach(v => {
          v.isSelected = value;
        });
      },
      // 取值
      get() {
        // 返回布尔值 是否全部被选中了
        return this.goodsList.every(v => {
          return v.isSelected == true;
        });
      }
    },
    // 总金额
    totalPrice() {
      let price = 0;
      this.goodsList.forEach(v => {
        if (v.isSelected) {
          price += v.goods_num * v.goods_price;
        }
      });
      // 返回
      return price;
    },
    // 总数
    totalNum() {
      let num = 0;
      this.goodsList.forEach(v => {
        if (v.isSelected) {
          num += v.goods_num;
        }
      });
      // 返回
      return num;
    }
  },
  // 每次显示都会触发
  onShow() {
    // 读取缓存
    wx.getStorage({
      key: "cart",
      success: async res => {
        // 修改标记变量
        this.isFull = true;
        // 保存商品数据 缓存中只有id 跟个数
        // 需要通过接口获取详细信息 api/public/v1/goods/goodslist?goods_ids=140,395
        let ids = "";
        for (const key in res.data) {
          ids += key;
          ids += ",";
        }
        // 去掉最后一个 截取字符串 从0开始 到倒数第二个为止
        ids = ids.slice(0, -1);
        // console.log(ids);
        let goods = await hxios.get({
          url: `api/public/v1/goods/goodslist?goods_ids=${ids}`
        });
        // console.log(goods);
        // 添加字段 个数 以及是否选中
        goods.data.message.forEach(v => {
          // 个数
          v["goods_num"] = res.data[v.goods_id];
          // 是否选中
          v["isSelected"] = false;
        });
        // 保存起来
        this.goodsList = goods.data.message;
      },
      fail: () => {},
      complete: () => {}
    });
    // 读取地址缓存 同步
    let address = wx.getStorageSync("address");
    if (address) {
      console.log("有地址");
      console.log(address);
      this.buyer = address.userName;
      this.address =
        address.provinceName +
        " " +
        address.cityName +
        " " +
        address.countyName +
        " " +
        address.detailInfo;
      this.mobile = address.telNumber;
    } else {
      // 没有地址
      console.log("木有");
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
}
.cart-container {
  height: 100%;
  background-color: #eee;
  .empty {
    height: 100%;
    padding-top: 100rpx;
    box-sizing: border-box;
    text-align: center;
    i {
      font-size: 100rpx;
      color: #f9e24d;
      width: 180rpx;
      height: 180rpx;
      margin: 0 auto;
      border-radius: 50%;
      background: linear-gradient(
        to bottom,
        #e89eab,
        #e59b96,
        #d54e55,
        #32462f
      );
      line-height: 180rpx;
    }
    p {
      font-size: 26rpx;
      margin-top: 50rpx;
    }
  }
  .full {
    padding-bottom: 100rpx;
  }
}
// 收货人信息布局
.buyer-box {
  // height: 212rpx;
  background-color: white;
  .item {
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 0 20rpx;
    font-size: 30rpx;
    .left {
    }
    .right {
    }
  }
  .line {
    /*
      蓝 0-20
      白 20-30
      红 30-70
      白 70-80
      蓝 80-100
    */
    background-image: linear-gradient(
      -45deg,
      blue 20%,
      white 20%,
      white 30%,
      red 30%,
      red 70%,
      white 70%,
      white 80%,
      blue 80%
    );
    background-size: 160rpx 12rpx;
    height: 12rpx;
  }
}
// 商品列表区域布局
.goods-box {
  background-color: white;
  margin-top: 20rpx;
  .title {
    height: 90rpx;
    border-bottom: 1rpx solid #ccc;
    line-height: 90rpx;
    padding-left: 30rpx;
    font-size: 30rpx;
  }
  .items {
    .item {
      height: 210rpx;
      display: flex;
      .item-left {
        width: 85rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .item-right {
        flex: 1;
        display: flex;
        border-bottom: 1rpx solid #eee;
        .goods-left {
          display: flex;
          align-items: center;
          margin-right: 20rpx;
          img {
            width: 160rpx;
            height: 160rpx;
            display: block;
          }
        }
        .goods-right {
          padding-right: 18rpx;
          padding-top: 20rpx;
          padding-bottom: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 30rpx;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            .left {
              color: #eb4450;
              font-size: 20rpx;
              display: flex;
              align-items: flex-end;
              span {
                font-size: 30rpx;
              }
            }
            .right {
              span {
                display: inline-block;
                width: 60rpx;
                height: 50rpx;
                border: 4rpx solid #666666;
                text-align: center;
                line-height: 50rpx;
                font-size: 20rpx;
              }
              span:nth-child(2) {
                border-color: transparent;
              }
            }
          }
        }
      }
    }
  }
}
// 底部操纵区域布局
.bottom-box {
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  padding-left: 30rpx;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  .left {
    font-size: 30rpx input {
      margin-right: 30rpx;
    }
  }
  .right {
    display: flex;
    .total-price {
      .top {
        color: #eb4450;
        font-size: 28rpx;
        // 伪元素
        &::before {
          content: "合计:";
          color: black;
        }
        span {
          font-size: 30rpx;
        }
      }
      .bottom {
        font-size: 28rpx;
        color: #ccc;
      }
    }
    button {
      margin-left: 20rpx;
      width: 230rpx;
      background-color: #eb4450;
      color: white;
      text-align: center;
      line-height: 100rpx;
      border-radius: 0;
      &.disabled {
        background-color: #ccc;
        color: black;
      }
    }
  }
}
</style>

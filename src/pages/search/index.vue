<template>
  <div class="search-container">
    <!-- 顶部的搜索盒子 -->
    <div class="search-box">
      <icon type="search" size="14"></icon>
      <input type="text" v-model.trim="inputValue" @change="searchData" placeholder="请输入你想要的商品">
      <button>取消</button>
    </div>
    <!-- 底部的容器 -->
    <div class="bottom">
      <div class="history-box" v-if="results.length==0">
        <div class="title-box">
          <span>历史搜索</span>
          <i @click="clear" class="iconfont icon-shanchu"></i>
        </div>
        <div class="items">
          <div @click="fillAndSearch(item)" class="item" v-for="(item, index) in searchList">
            {{item}}
            <i @click="delOne(index)" class="iconfont icon-shanchu"></i>
          </div>
        </div>
      </div>
      <div class="result-box" v-if="results.length!=0">
        <div class="filter-box">
          <div class="filter active">综合</div>
          <div class="filter">销量</div>
          <div class="filter">价格
            <div class="arrow-box">
              <span>▲</span>
              <span>▼</span>
            </div>
          </div>
        </div>
        <!-- 商品盒子 -->
        <div class="goods-box">
          <div class="item" v-for="(item, index) in results" :key="item.goods_id">
            <div class="left">
              <img :src="item.goods_small_logo" alt>
            </div>
            <div class="right">
              <div class="top">{{item.goods_name}}</div>
              <div class="bottom">
                ¥
                <span>{{item.goods_price}}</span>.00
              </div>
            </div>
          </div>
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
      // 输入的内容
      inputValue: "",
      // 搜索数组
      searchList: [],
      // 搜索结果数组
      results: []
    };
  },
  methods: {
    // 查询数据
    async searchData() {
      if (this.inputValue === "") {
        return;
      }
      // 判断是否重复
      let index = this.searchList.indexOf(this.inputValue);
      // 重复判断
      if (index != -1) {
        this.searchList.splice(index, 1);
      }
      // 长度限制
      if (this.searchList.length >= 10) {
        // this.searchList.splice(0,1);
        this.searchList.shift();
      }
      // 把输入的内容添加到最后
      this.searchList.push(this.inputValue);
      // 调用接口
      let res = await hxios.get({
        url: `api/public/v1/goods/search?query=${this.inputValue}`
      });
      // console.log(res);
      this.results = res.data.message.goods;
    },
    // 删除某一个
    delOne(index) {
      this.searchList.splice(index, 1);
    },
    // 清空所有历史
    clear() {
      wx.showModal({
        title: "提示",
        content: "你确定要清空历史?O(∩_∩)O",
        // 默认是 success(){} this已经改变 使用箭头函数 固定this
        success: res => {
          if (res.confirm) {
            // console.log("用户点击确定");
            this.searchList = [];
          } else if (res.cancel) {
            // console.log("用户点击取消");
          }
        }
      });
    },
    // 填充并且搜索
    fillAndSearch(value) {
      this.inputValue = value;
      // 查询数据
      this.searchData();
    }
  },
  // created 只要保证data有了即可
  created() {
    let res = wx.getStorageSync("history");
    // console.log(res);
    if (res) {
      this.searchList = res;
    }
  },
  // 侦听器
  watch: {
    searchList() {
      // console.log("我变了");
      wx.setStorage({
        key: "history",
        data: this.searchList
      });
    }
  }
};
</script>

<style lang="scss">
$uRed: #ff2d4a;
.search-box {
  display: flex;
  position: relative;
  padding: 30rpx 15rpx;
  background-color: #eeeeee;
  icon {
    position: absolute;
    left: 35rpx;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    flex: 1;
    height: 60rpx;
    padding-left: 70rpx;
    margin-right: 20rpx;
    font-size: 25rpx;
    color: #aaa;
    background: white;
  }
  button {
    font-size: 28rpx;
    text-align: center;
    line-height: 60rpx;
    width: 160rpx;
    height: 60rpx;
    background-color: #eee;
    border-color: black;
    box-shadow: 0 0 10rpx yellow;
  }
}
// 历史记录
.bottom {
  .history-box {
    padding: 30rpx 30rpx 0 15rpx;
    .title-box {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 30rpx;
      }
      i {
        color: #ddd;
      }
    }
    .items {
      margin-top: 30rpx;
      display: flex;
      flex-wrap: wrap;
      .item {
        height: 65rpx;
        padding: 0 20rpx;
        line-height: 65rpx;
        background-color: #dddddd;
        font-size: 25rpx;
        margin-right: 30rpx;
        margin-bottom: 15rpx;
        position: relative;
        border-radius: 10rpx;
        i {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
    }
  }
}
// 搜索结果
.result-box {
  .filter-box {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid gray;
    .filter {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      &.active {
        color: $uRed;
      }
      &:last-child {
        display: flex;
        align-items: center;
        justify-content: center;
        .arrow-box {
          span {
            display: block;
            transform: scaleY(0.6);
          }
        }
      }
    }
  }
  // 商品盒子
  .goods-box {
    padding-left: 20rpx;
    .item {
      display: flex;
      height: 260rpx;
      border-bottom: 1rpx solid #eee;
      padding: 30rpx 0;
      box-sizing: border-box;
      .left {
        margin-right: 20rpx;
        img {
          width: 200rpx;
          height: 200rpx;
          display: block;
        }
      }
      .right {
        padding-right: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 30rpx;
        }
        .bottom {
          color: $uRed;
          font-size: 22rpx;
          span {
            font-size: 32rpx;
          }
        }
      }
    }
  }
}
// 使用弹性布局约束 高度
.search-container {
  position: relative;
  padding-top: 120rpx;
  .search-box {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    height: 120rpx;
  }
  .result-box {
    position: relative;
    padding-top: 100rpx;
    .filter-box {
      position: fixed;
      background: white;
      width: 100%;
      left: 0;
      top: 120rpx;
    }
  }
}
</style>

<template>
  <div class="category-container">
    <!-- 使用组件 -->
    <searchbox></searchbox>
    <!-- 滚动的区域 -->
    <div class="scroll-box">
      <scroll-view class="left" scroll-y scroll-with-animation>
        <ul>
          <li
            v-for="(item, i) in categoryList"
            :class="{actived:index===i}"
            :key="item.cat_id"
            @click="index=i"
          >{{item.cat_name}}</li>
        </ul>
      </scroll-view>
      <scroll-view class="right" scroll-y scroll-with-animation>
        <img class="title-img" src="/static/titleImage.png" alt>
        <block v-if="categoryList.length!=0">
          <div class="section" v-for="level1 in categoryList[index].children" :key="level1.cat_id">
            <div class="title">
              <span>/</span>
              &nbsp;&nbsp;&nbsp;&nbsp;{{level1.cat_name}}&nbsp;&nbsp;&nbsp;&nbsp;
              <span>/</span>
            </div>
            <div class="items">
              <div class="item" v-for="(level2,i) in level1.children" :key="level2.cat_id">
                <img :src="'https://autumnfish.cn/wx/'+level2.cat_icon" alt>
                <p>{{level2.cat_name}}</p>
              </div>
            </div>
          </div>
        </block>
      </scroll-view>
    </div>
  </div>
</template>

<script>
// 导入组件
import searchbox from "../../components/searchBox.vue";
// 导入hxios
import hxios from "../../utils/index.js";
export default {
  data() {
    return {
      // 分类数据
      categoryList: [],
      // 索引值
      index: 0
    };
  },
  // 注册组件
  components: {
    searchbox
  },
  // async created() {
  async onLoad() {
    let res = await hxios.get({
      url: "api/public/v1/categories"
    });
    // console.log(res);
    this.categoryList = res.data.message;
  }
};
</script>

<style lang="scss">
$uRed: #ff2d4a;
page {
  height: 100%;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.category-container {
  padding-top: 100rpx;
  box-sizing: border-box;
  height: 100%;
  .scroll-box {
    display: flex;
    height: 100%;
    scroll-view {
      // 竖直方向滚动 需要设置固定的高度
      height: 100%;
    }
    .left {
      width: 200rpx;
      ul {
        li {
          font-size: 26rpx;
          text-align: center;
          height: 100rpx;
          line-height: 100rpx;
          background-color: #aaa;
          &.actived {
            font-weight: 900;
            color: $uRed;
            position: relative;
            background-color: white;
            &::before {
              content: "";
              position: absolute;
              width: 10rpx;
              height: 60rpx;
              background-color: $uRed;
              left: 0;
              top: 20rpx;
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      // background-color: skyblue;
      padding: 15rpx;
      box-sizing: border-box;
      .title-img {
        display: block;
        width: 100%;
        height: 200rpx;
      }
      .section {
        margin-top: 40rpx;
        .title {
          text-align: center;
          font-size: 28rpx;
          span {
            color: #ccc;
          }
        }
        .items {
          display: flex;
          flex-wrap: wrap;
          margin-top: 20rpx;
          .item {
            width: 33.3333%;
            img {
              display: block;
              width: 100rpx;
              height: 70rpx;
              margin: 0 auto;
            }
            p {
              text-align: center;
              margin-top: 20rpx;
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="cart-container">
    <!-- 空车 -->
    <div class="empty">
      <i class="iconfont icon-gouwuche"></i>
      <p>你还没有添加任何商品</p>
    </div>
    <!-- 非空车 -->
    <div class="full"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
page {
  height: 100%;
}
.cart-container {
  height: 100%;
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
  }
}
</style>

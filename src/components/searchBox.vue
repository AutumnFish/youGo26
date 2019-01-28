<template>
  <div class="search-box">
    <input type="text" placeholder="搜索">
    <icon type="search" size="12"></icon>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
$uRed: #ff2d4a;
.search-box {
  background: $uRed;
  padding: 20rpx 16rpx;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 998;
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
</style>
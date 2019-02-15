<script>
export default {
  created() {
    // 注册网络状态改变事件
    wx.onNetworkStatusChange(function(res) {
      console.log(res.isConnected);
      console.log(res.networkType);
    });
  }
};
</script>

<style lang='scss'>
/* 导入样式 */
@import "../static/iconfont.wxss";

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
  /* 全部设置 怪异盒模型 */
  box-sizing: border-box;
}
</style>

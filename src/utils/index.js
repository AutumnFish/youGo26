// function hexios() {  }
let defaultBaseUrl = 'https://autumnfish.cn/wx/'

export default {
  get(options) {
    // 处理url地址
    if (options.url) {
      options.url = defaultBaseUrl + options.url
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url || 'url', //开发者服务器接口地址",
        data: options.data || 'data', //请求的参数",
        method: 'GET',
        dataType: options.dataType || 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: resolve,
        fail: reject
      });
    })

  },
  post() {}
}

import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import { Message } from 'element-ui'
// import store from '&&/store'
// import { getToken } from '&&/utils/auth'

// 创建axios实例
const service = axios.create({
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: false,
  // baseURL: process.env.API, // api 的 base_url
  timeout: 20000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => config,
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res && res.code === 'success') {
      return res.data
    }
    Message({
      message: res.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(res.data || res.message)
  },
  error => {
    const status = error.response && error.response.status
    if (error.message.includes('timeout of')) {
      Message({
        message: '系统繁忙,请稍后再试~~',
        type: 'error',
        duration: 3000
      })
    } else if (status === 404) {
      Message({
        message: '请求地址不存在，请稍后重试~~',
        type: 'warning',
        duration: 3000
      })
    } else if (status === 500 || status === 502 || status === 503) {
      Message({
        message: '系统繁忙,请稍后再试~~',
        type: 'warning',
        duration: 3000
      })
    } else {
      Message({
        message: error.message || (error.response && error.response.data.message) || '网络繁忙,请稍后再试~~',
        type: 'error',
        duration: 3000
      })
    }
    return Promise.reject(error)
  }
)

export default service

import request from '@/utils/request'

const api = process.env.NODE_ENV === 'development' ? '/api' : process.env.VUE_APP_LOW_CODE


// 注册模块
export function regModule(data) {
  return request({
    url: `${api}/lowcode/reg_module`,
    method: 'post',
    data
  })
}

// 查询模块列表
export function fetchModules() {
  return request({
    url: `${api}/lowcode/fetch_modules`,
    method: 'get'
  })
}

// 根据模块获取模块项列表
export function fetchModuleitems(data) {
  return request({
    url: `${api}/lowcode/fetch_moduleitems?moduleId=${data}`,
    method: 'get'
  })
}

// 获取相应模块的数据结构
export function fetchModulestructure(data) {
  return request({
    url: `${api}/lowcode/fetch_modulestructure?moduleItemId=${data}`,
    method: 'get'
  })
}

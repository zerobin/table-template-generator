/*
 * @Date: 2020-06-03 15:21:58
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2023-08-14 16:11:19
 */
import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import Tinymce from '@/components/tinymce'

Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

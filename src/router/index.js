import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'
// import Index from '@/views/index/Index.vue'
import Model from '@/views/index/Model.vue'
import Test from '@/views/index/Test.vue'
import Parser from '@/components/parser/example/Index.vue'
import asyncRouter from './asyncRouter'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
    // name: 'index',
    // component: Index
  },
  {
    path: '/model',
    name: 'model',
    component: Model
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/parser',
    name: 'parser',
    component: Parser
  },
  ...asyncRouter
]

console.log(routes)
const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/form-generator/',
  linkActiveClass: 'active-link', // 点击进行路由跳转时那个路由会添加active-link
  linkExactActiveClass: 'exact-active-link', // 路由路径完全匹配是点击的时候会有exact-active-link
  scrollBehavior(to, from, savedPosition) { // 记录路由页面滚动的位置
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  fallback: true // 如果浏览器不支持history模式，那么自动帮我们改为hash模式
})

export default router

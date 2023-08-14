const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const router = require('koa-router')()
const router = require('./api')

const app = new Koa()

// 解决跨域
const cors = require('koa-cors')

app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
app.use(cors())
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  await next()
})
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})


app.use(router.routes())

app.listen(3000)
console.log('监听3000端口')

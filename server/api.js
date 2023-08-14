const Router = require('koa-router')
const {
  filePath, routesPath, serveFilePath
} = require('./config')


const router = new Router()
const fs = require('fs').promises
const path = require('path')
const defFs = require('fs')

router.post('/save', async (ctx, next) => {
  const { codeStr, name } = ctx.request.body
  try {
    console.log(`${serveFilePath}`, '888888888')
    await fs.writeFile(`.${serveFilePath}/${name}.vue`, codeStr).then(res => {
      generateRoutes(filePath)
      console.log('111111111111111111111111111111111111')
      ctx.body = {
        code: 0,
        msg: '生成文件成功！'
      }
    }).catch(err => {
      console.log(err)
      ctx.body = {
        code: -1,
        msg: '生成文件失败！'
      }
    })
  } catch (e) {
    console.log('2222222222222222')
    ctx.body = {
      code: -1,
      msg: '生成文件失败！'
    }
  }
})


function resolve(dir) {
  return path.join(__dirname, dir)
}

// 读取文件目录
function getDirFileName(dir) {
  const dirPath = resolve(dir)
  const readDir = defFs.readdirSync(dirPath)
  const fileList = []
  if (readDir && readDir.length) {
    const vueFiles = readDir.filter(item => item.includes('.vue'))
    vueFiles.forEach(item => {
      fileList.push(item.split('.vue')[0])
    })
  }
  console.log(fileList, '5555')
  return fileList
}

// 生成路由文件
function generateRoutes(fileDir, routes) {
  // 1.获取文件目录下的所有生成的文件
  console.log(fileDir, 'dddddddd')
  console.log(routes, 'cccccccccccddddddddd')
  const filesName = getDirFileName(fileDir)

  // 2.根据文件名生成对应的配置文件字符串
  const importList = filesName.map(item => `import ${item} from '../..${serveFilePath}/${item}'\n`)
  const strTemplate = `
  ${importList.join('')}
  `
  const tempStrStart = 'const asyncRouter = ['
  const tempStrEnd = `]
  export default asyncRouter`
  const routesTemplate = filesName.map(item => `{
    path: "/${item}",
    name: "${item}",
    component: ${item}
  }`)
  console.log(strTemplate, 'ccccccccc')
  console.log(routesTemplate.join(''), 'ddddddd')
  const completeTemp = `/* eslint-disable */
  ${strTemplate}
  ${tempStrStart}
  ${routesTemplate}
  ${tempStrEnd}
  `
  // 3.写入路由文件
  writeFile(resolve(routesPath), completeTemp)
}

// 写入文件
function writeFile(filePaths, fileContent) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePaths, fileContent, err => {
      if (err) {
        reject(err)
      }
      console.log('写入成功')
    })
  })
}


module.exports = router

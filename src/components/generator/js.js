import { isArray } from 'util'
import { importUtils, exportDefault, titleCase } from '@/utils/index'
import ruleTrigger from './ruleTrigger'
import dataReaport from '@/template/dataReport.js'

const DATA_REPORT_API = `import {
  selfDefineReport, fetchModules, regModule, fetchModuleitems, fetchModulestructure, submitAndShowData
} from '@/api/module'`
const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
let firstFormConfig
const inheritAttrs = {
  page: '',
  dialog: 'inheritAttrs: false,'
}

// 把一个数组转化成一个对象格式
function arrToObj(dataList) {
  const obj = {}
  dataList.forEach(item => {
    const key = Object.keys(item)[0]
    const val = item[key] || null
    obj[key] = val
  })
  return obj
}

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
  // 取第一个form表单的配置信息
  const filterFormConf = formConfig.fields.filter(item => item.__config__ && item.__config__.containerType === 'form')
  if (filterFormConf && filterFormConf.length) {
    firstFormConfig = JSON.parse(JSON.stringify(filterFormConf[0]))
  } else {
    firstFormConfig = { __config__: { form: {} } }
  }
  confGlobal = formConfig = JSON.parse(JSON.stringify(formConfig))

  const dataList = []
  const tbData = []
  const ruleList = []
  const tableColumn = []
  const optionsList = []
  const propsList = []
  const methodList = mixinMethod(formConfig.fields, type)
  const uploadVarList = []
  let mixin = ''
  if (formConfig.model.form.importUtils && formConfig.model.form.mixinName && formConfig.model.form.mixinName.length) {
    mixin = `${formConfig.model.form.utilsName}.${formConfig.model.form.mixinName}`
  }
  debugger
  formConfig.fields.forEach(el => {
    debugger
    buildAttributes(el, dataList, tbData, ruleList, tableColumn, optionsList, methodList, propsList, uploadVarList, el)
  })

  // dataList 格式转换 数组转对象，最后转字符串
  let dataString = JSON.stringify(arrToObj(dataList))
  dataString = dataString.replace(/{(.*)?}/, '$1')
  if (dataString && dataString.length) {
    dataString = `${dataString},`
  }
  const script = buildexport(
    formConfig,
    type,
    dataString,
    tbData.join('\n'),
    ruleList.join('\n'),
    tableColumn.join('\n'),
    optionsList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    methodList.join('\n'),
    mixin
  )
  confGlobal = null
  firstFormConfig = null
  return script
}

// 构建组件属性
function buildAttributes(scheme, dataList, tbData, ruleList, tableColumns, optionsList, methodList, propsList, uploadVarList, parentConfig) {
  const config = scheme.__config__
  const slot = scheme.__slot__
  debugger
  buildData(scheme, dataList, parentConfig)
  debugger
  buildRules(scheme, ruleList, parentConfig)

  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList)
    if (config.dataType === 'dynamic') {
      const model = `${scheme.__vModel__}Options`
      const options = titleCase(model)
      buildOptionMethod(`get${options}`, model, methodList)
    }
  }
  // 特殊处理的elTableColumn
  if (slot && slot.elTableColumn && slot.elTableColumn.length) {
    buildElTableColumn(scheme, tbData)
  }
  // 特殊处理的carouselItems
  if (slot && slot.carouselItems && slot.carouselItems.length) {
    buildElCarousel(scheme, tbData)
    // if (config.dataType === 'dynamic') {
    //   const model = `${scheme.__vModel__}Options`
    //   const options = titleCase(model)
    //   buildOptionMethod(`get${options}`, model, tableColumns)
    // }
  }

  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList)
  }

  // 处理普通事件
  if (scheme.__config__ && scheme.__config__.method) {
    buildMethod(scheme, methodList)
  }

  // 处理el-upload的action
  if (scheme.action && config.tag === 'el-upload') {
    uploadVarList.push(
      `${scheme.__vModel__}Action: '${scheme.action}',
      ${scheme.__vModel__}fileList: [],`
    )
    methodList.push(buildBeforeUpload(scheme))
    // 非自动上传时，生成手动上传的函数
    if (!scheme['auto-upload']) {
      methodList.push(buildSubmitUpload(scheme))
    }
  }

  debugger
  // 构建子级组件属性
  if (config.children) {
    // 容器类型
    if (config.containerType === 'form') {
      // dataList.push(`"${config.form.formModel}": {},`)
      dataList.push({
        [config.form.formModel]: {}
      })
    }
    config.children.forEach(item => {
      buildAttributes(item, dataList, tbData, ruleList, tableColumns, optionsList, methodList, propsList, uploadVarList, config)
    })
  }
}

// 混入处理函数
function mixinMethod(fields, type) {
  const list = []
  let eventStr = ''
  fields.forEach(item => {
    if (Object.keys(item).includes('clickName')) {
      eventStr += `${item.clickName}() {},`
    }
  })
  const minxins = {
    page: firstFormConfig.__config__.form.formBtns ? {
      event: eventStr,
      submitForm: `submitForm() {
        this.$refs['${firstFormConfig.__config__.form.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
        })
      },`,
      resetForm: `resetForm() {
        this.$refs['${firstFormConfig.__config__.form.formRef}'].resetFields()
      },`
    } : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: `onClose() {
        this.$refs['${firstFormConfig.__config__.form.formRef}'].resetFields()
      },`,
      close: `close() {
        this.$emit('update:visible', false)
      },`,
      handelConfirm: `handelConfirm() {
        this.$refs['${firstFormConfig.__config__.form.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
    }
  }
  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

// 构建data, 返回格式是：[0: "field102: 0,", 1: "field103: 0,"]
function buildData(scheme, dataList, parentConfig) {
  const config = scheme.__config__
  const { defaultValue } = config
  // 表单data的情况
  if (parentConfig.containerType === 'form') {
    if (dataList && !dataList.length) return
    const tempString = dataList[dataList.length - 1]
    tempString[parentConfig.form.formModel][scheme.__vModel__] = `${defaultValue}`
    return
  }
  // 非表格data的情况
  if (scheme.__vModel__ && scheme.__config__.tag !== 'el-table') {
    dataList.push({ [scheme.__vModel__]: defaultValue })
  }
}

// 构建校验规则
function buildRules(scheme, ruleList, parentConfig) {
  console.log(parentConfig, 'cccccccccccccccccc')
  console.log(scheme, 'eeeeeeeeeeeeee')
  const config = scheme.__config__
  debugger
  // if (parentConfig.containerType === 'form') {
  const rules = []
  if (ruleTrigger[config.tag]) {
    debugger
    if (config.required) {
      const type = Array.isArray(config.defaultValue) ? 'type: \'array\',' : ''
      let message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}不能为空`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
    }
    if (config.regList && Array.isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern) {
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${ruleTrigger[config.tag]}' }`
          )
        }
      })
    }
    ruleList.push(`"${scheme.__vModel__}": [${rules.join(',')}],`)
  }
  // }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  let { options } = scheme
  if (!options) options = scheme.__slot__.options
  if (scheme.__config__.dataType === 'dynamic') { options = [] }
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`
  optionsList.push(str)
}


// 构建elTableColumn
function buildElTableColumn(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  let { data } = scheme
  if (!data) data = scheme.data
  const str = `"${scheme.__vModel__}": ${JSON.stringify(data)},`
  // 如果是独立表格才在data里面添加独立的field
  // if (scheme.__config__.ownTable) {
  //   optionsList.push(str)
  // }
  optionsList.push(str)
}

// 构建跑马灯
function buildElCarousel(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  let { carouselItem } = scheme
  if (!carouselItem) carouselItem = scheme.__slot__.carouselItems
  const str = `${scheme.__vModel__}ElCarouselItem: ${JSON.stringify(carouselItem)},`
  optionsList.push(str)
}


function buildProps(scheme, propsList) {
  const str = `${scheme.__vModel__}Props: ${JSON.stringify(scheme.props.props)},`
  propsList.push(str)
}

// el-upload的BeforeUpload
function buildBeforeUpload(scheme) {
  const config = scheme.__config__
  const unitNum = units[config.sizeUnit]; let rightSizeCode = ''; let acceptCode = ''; const
    returnList = []
  if (config.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${config.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${config.fileSize}${config.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (scheme.accept) {
    acceptCode = `let isAccept = new RegExp('${scheme.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${scheme.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  const str = `${scheme.__vModel__}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}
function buildMethod(scheme, methodList) {
  const str = `${scheme.__config__.methodName}() {
    // TODO 事件处理
  },`
  methodList.push(str)
}
// el-upload的submit
function buildSubmitUpload(scheme) {
  const str = `submitUpload() {
    this.$refs['${scheme.__vModel__}'].submit()
  },`
  return str
}

function buildOptionMethod(methodName, model, methodList) {
  const str = `${methodName}() {
    // TODO 发起请求获取数据
    this.${model}
  },`
  methodList.push(str)
}


// js整体拼接
function buildexport(conf, type, data, tbData, rules, tableColumnList, selectOptions, uploadVar, props, methods, mixin) {
  console.log(conf, 'cccc')
  let tempMain
  let tempHead
  let tempFooder
  if (rules) {
    tempMain = `
        data () {
          return {
            ${data}
            rules: {
              ${rules}
            },
            ${tbData}
            ${tableColumnList}
            ${uploadVar}
            ${selectOptions}
            ${props}
          }
        },
      `
  } else {
    tempMain = `
        data () {
          return {
            ${data}
            ${tbData}
            ${tableColumnList}
            ${uploadVar}
            ${selectOptions}
            ${props}
          }
        },
      `
  }
  if (conf.model.file.tempSelection === 'dataReport') {
    tempHead = `/* eslint-disable */
      ${importUtils(conf)}
      ${DATA_REPORT_API}
      ${exportDefault}{
      ${inheritAttrs[type]}
      components: {},
      props: [],
    `
    tempFooder = `
      computed: {},
      watch: {},
      created () {
        ${dataReaport.created}
      },
      mounted () {},
      mixins: [${mixin}],
      methods: {
        ${dataReaport.methods}
      }
    }`
  } else {
    tempHead = `/* eslint-disable */
      ${importUtils(conf)}
      ${exportDefault}{
      ${inheritAttrs[type]}
      components: {},
      props: [],
    `
    tempFooder = `
      computed: {},
      watch: {},
      created () {},
      mounted () {},
      mixins: [${mixin}],
      methods: {
        ${methods}
      }
    }`
  }
  const str = `${tempHead}${tempMain}${tempFooder}`
  return str
}

/* eslint-disable max-len */
import ruleTrigger from './ruleTrigger'

let confGlobal
let someSpanIsNot24
let pageType

export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

// 页面容器
function buildPageContainer(scheme, child, type, isOwn = false) {
  let str = `<div >
    ${child}
  </div>`
  if (someSpanIsNot24) {
    str = `<el-row :gutter="${scheme.model.form.gutter}">
      ${str}
    </el-row>`
  }
  return str
}

// 表单容器
function buildFormContainer(scheme, child, type) {
  let labelPosition = ''
  const formConf = scheme.__config__.form
  if (scheme.__config__.form.labelPosition !== 'right') {
    labelPosition = `label-position="${formConf.labelPosition}"`
  }
  const disabled = formConf.disabled ? `:disabled="${formConf.disabled}"` : ''
  // 抽离独立表格，其他组件代码放进form标签
  let str

  str = `<el-form ref="${formConf.formRef}" :model="${formConf.formModel}" :rules="${formConf.formRules}" size="${formConf.size}" ${disabled} label-width="${formConf.labelWidth}px" ${labelPosition}>
    ${child.join('\n')}
    ${buildFromBtns(scheme, type)}
  </el-form>`

  if (someSpanIsNot24) {
    str = `<el-row :gutter="${formConf.gutter}">
        ${str}
      </el-row>`
  }
  return str
}

function buildFromBtns(scheme) {
  let str = ''
  let formConf = null
  if (scheme.__config__.containerType !== 'form') return str
  formConf = scheme.__config__.form
  if (formConf.formBtns && pageType === 'page') {
    str = `<el-col :span="24">
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item></el-col>
      `
    if (someSpanIsNot24 || pageType === 'form') {
      str = `<el-col :span="24">
          ${str}
        </el-col>`
    }
  }
  return str
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  const form = scheme.__config__.form || { span: 24 }
  if (someSpanIsNot24 || scheme.__config__.span !== 24 || form.span === 24) {
    return `<el-col :span="${scheme.__config__.span}">
      ${str}
    </el-col>`
  }
  return str
}

const layouts = {
  // scheme：组件配置, parentElement父级元素，表单类来获取父级的对应的form字段
  colFormItem(scheme, parentElement) {
    let formConf
    if (parentElement && parentElement.__config__.containerType === 'form') {
      formConf = parentElement.__config__.form
    }
    const config = scheme.__config__
    let labelWidth = ''
    let label = `label="${config.label}"`
    if (config.labelWidth && config.labelWidth !== confGlobal.model.form.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"'
      label = ''
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const tagDom = tags[config.tag] ? tags[config.tag](scheme, formConf) : null
    let str
    // 判断是否独立表格
    // if (config.ownTable) {
    //   str = `${tagDom}`
    // } else {
    //   str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
    //     ${tagDom}
    //   </el-form-item>`
    // }
    if (formConf) {
      str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
        ${tagDom}
      </el-form-item>`
    } else {
      str = `
        <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:${config.labelWidth ? config.labelWidth - 12 : '88'}px; display:${config.showLabel ? 'inline-block' : 'none'};" >${config.label}</span>
            <div style="flex:1; overflow: hidden;">
              ${tagDom}
            </div>
        </div>
      `
      // str = `${tagDom}`
    }
    str = colWrapper(scheme, str)
    return str
  },
  rowFormItem(scheme) {
    const config = scheme.__config__
    const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`
    const justify = scheme.type === 'default' ? '' : `justify="${scheme.justify}"`
    const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : ''
    let children
    let str
    if (config.containerType === 'form') {
      children = config.children.map(el => layouts[el.__config__.layout](el, scheme))
      str = buildFormContainer(scheme, children, config.form.type)
    } else {
      children = config.children.map(el => layouts[el.__config__.layout](el))
      str = `<el-row ${type} ${justify} ${align} ${gutter}>
        ${children.join('\n')}
      </el-row>`
    }
    str = colWrapper(scheme, str)
    return str
  }
}

const tags = {
  'el-table': (el, formConf) => {
    const {
      tag, disabled, data
    } = attrBuilder(el, formConf)
    const type = el.type ? `type="${el.type}"` : ''
    const size = el.size ? `size="${el.size}"` : ''
    const stripe = el.stripe ? 'stripe' : ''
    let child = buildElTableChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${data} ${stripe} ${type} ${size}  ${disabled} >${child}</${tag}>`
  },
  'el-divider': (el, formConf) => {
    const { tag } = attrBuilder(el, formConf)
    const direction = el.direction ? `direction="${el.direction}"` : ''
    const contentPosition = el['content-position'] ? `content-position="${el['content-position']}"` : ''
    return `<${tag} ${direction} ${contentPosition}></${tag}>`
  },
  'el-carousel': (el, formConf) => {
    const { tag } = attrBuilder(el, formConf)
    let child = buildElCarouselChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag}>${child}</${tag}>`
  },
  'el-button': (el, formConf) => {
    const {
      tag, disabled
    } = attrBuilder(el, formConf)
    const type = el.type ? `type="${el.type}"` : ''
    const icon = el.icon ? `icon="${el.icon}"` : ''
    const round = el.round ? 'round' : ''
    const size = el.size ? `size="${el.size}"` : ''
    const plain = el.plain ? 'plain' : ''
    const circle = el.circle ? 'circle' : ''
    const clickName = el.clickName ? `@click="${el.clickName}"` : ''
    let child = buildElButtonChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle} ${clickName}>${child}</${tag}>`
  },
  'el-input': (el, formConf) => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el, formConf)
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
    const readonly = el.readonly ? 'readonly' : ''
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
    const showPassword = el['show-password'] ? 'show-password' : ''
    const type = el.type ? `type="${el.type}"` : ''
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : ''
    let child = buildElInputChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`
  },
  'el-input-number': (el, formConf) => {
    const {
      tag, disabled, vModel, placeholder
    } = attrBuilder(el, formConf)
    const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : ''
    const precision = el.precision ? `:precision='${el.precision}'` : ''

    return `<${tag} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${tag}>`
  },
  'el-select': (el, formConf) => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el, formConf)
    const filterable = el.filterable ? 'filterable' : ''
    const multiple = el.multiple ? 'multiple' : ''
    const allowCreate = el.allowCreate ? 'allow-create' : ''
    const defaultFirstOption = el.defaultFirstOption ? 'default-first-option' : ''
    const methods = el.__config__ && el.__config__.method ? `@${el.__config__.method}="${el.__config__.methodName}"` : ''
    let child = buildElSelectChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${methods} ${allowCreate} ${defaultFirstOption} ${filterable} ${clearable} ${width}>${child}</${tag}>`
  },
  'el-radio-group': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const size = `size="${el.size}"`
    let child = buildElRadioGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`
  },
  'el-checkbox-group': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const size = `size="${el.size}"`
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    let child = buildElCheckboxGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${tag}>`
  },
  'el-switch': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : ''
    const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : ''
    const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : ''
    const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : ''
    const activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify(el['active-value'])}'` : ''
    const inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'` : ''

    return `<${tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${tag}>`
  },
  'el-cascader': (el, formConf) => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el, formConf)
    const options = el.options ? `:options="${el.__vModel__}Options"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"'
    const filterable = el.filterable ? 'filterable' : ''
    const separator = el.separator === '/' ? '' : `separator="${el.separator}"`

    return `<${tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${tag}>`
  },
  'el-slider': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const range = el.range ? 'range' : ''
    const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''

    return `<${tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${tag}>`
  },
  'el-time-picker': (el, formConf) => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el, formConf)
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const isRange = el['is-range'] ? 'is-range' : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : ''

    return `<${tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${tag}>`
  },
  'el-date-picker': (el, formConf) => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el, formConf)
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const type = el.type === 'date' ? '' : `type="${el.type}"`
    const readonly = el.readonly ? 'readonly' : ''

    return `<${tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`
  },
  'el-rate': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const max = el.max ? `:max='${el.max}'` : ''
    const allowHalf = el['allow-half'] ? 'allow-half' : ''
    const showText = el['show-text'] ? 'show-text' : ''
    const showScore = el['show-score'] ? 'show-score' : ''

    return `<${tag} ${vModel} ${max} ${allowHalf} ${showText} ${showScore} ${disabled}></${tag}>`
  },
  'el-color-picker': (el, formConf) => {
    const { tag, disabled, vModel } = attrBuilder(el, formConf)
    const size = `size="${el.size}"`
    const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
    const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

    return `<${tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${tag}>`
  },
  'el-upload': (el, formConf) => {
    const { tag } = el.__config__
    const disabled = el.disabled ? ':disabled=\'true\'' : ''
    const action = el.action ? `:action="${el.__vModel__}Action"` : ''
    const multiple = el.multiple ? 'multiple' : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const name = el.name !== 'file' ? `name="${el.name}"` : ''
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
    const beforeUpload = `:before-upload="${el.__vModel__}BeforeUpload"`
    const fileList = `:file-list="${el.__vModel__}fileList"`
    const ref = `ref="${el.__vModel__}"`
    let child = buildElUploadChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${tag}>`
  },
  tinymce: (el, formConf) => {
    const { tag, vModel } = attrBuilder(el, formConf)
    const height = el.height ? `:height="${el.height}"` : ''
    const branding = el.branding ? `:branding="${el.branding}"` : ''
    return `<${tag} ${vModel} ${height} ${branding}></${tag}>`
  }
}
// 属性构造器
function attrBuilder(el, formConf) {
  console.log(el, '+++++++++++++++++++++++++++++++++++++')
  let vModel
  if (formConf) {
    vModel = `v-model="${formConf.formModel}.${el.__vModel__}"`
  } else {
    vModel = `v-model="${el.__vModel__}"`
  }
  return {
    tag: el.__config__.tag,
    vModel,
    data: setTableData(el),
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    disabled: el.disabled ? ':disabled=\'true\'' : ''
  }
}
// 设置表格:data 属性
function setTableData(el) {
  if (el.data) {
    // if (el.__config__.ownTable) {
    //   return `:data="${el.__vModel__}"`
    // }
    // return `:data="${confGlobal.model.form.formModel}.${el.__vModel__}"`
    return `:data="${el.__vModel__}"`
  }
  return ''
}
// el-table  子级el-table-column, 读取__slot__.default
function buildElTableChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.elTableColumn && slot.elTableColumn.length) {
    // children.push(`<el-table-column v-for="(item, index) in ${scheme.__vModel__}" :key="index" :label="item.label" :prop="item.prop" ></el-table-column>`)
    slot.elTableColumn.forEach(item => {
      children.push(
        `
          <el-table-column prop="${item.prop}"  label="${item.label}" ></el-table-column>
        `
      )
    })
  }
  return children.join('\n')
}

// 跑马灯
function buildElCarouselChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.carouselItems && slot.carouselItems.length) {
    children.push(`<el-carousel-item v-for="(item, index) in ${scheme.__vModel__}ElCarouselItem" :key="index" >{{item.label}}</el-carousel-item>`)
    // children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`)
  }
  return children.join('\n')
}

// el-button 子级,读取__slot__.default
function buildElButtonChild(scheme) {
  const children = []
  const slot = scheme.__slot__ || {}
  if (slot.default) {
    children.push(slot.default)
  }
  return children.join('\n')
}

// el-input 子级
function buildElInputChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.prepend) {
    children.push(`<template slot="prepend">${slot.prepend}</template>`)
  }
  if (slot && slot.append) {
    children.push(`<template slot="append">${slot.append}</template>`)
  }
  return children.join('\n')
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    if (slot && slot.html) {
      children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled">${slot.html}</el-option>`)
    } else {
      children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`)
    }
  }
  return children.join('\n')
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio'
    const border = config.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
    const border = config.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

// el-upload 子级
function buildElUploadChild(scheme) {
  const list = []
  const config = scheme.__config__
  if (scheme['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>')
  else list.push(`<el-button size="small" type="primary" icon="el-icon-upload">${config.buttonText}</el-button>`)
  if (config.showTip) list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`)
  return list.join('\n')
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig, type) {
  const htmlList = []
  pageType = type
  confGlobal = formConfig
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(item => item.__config__.span !== 24)
  // 遍历渲染每个组件成html
  formConfig.fields.forEach(el => {
    htmlList.push(layouts[el.__config__.layout](el))
  })
  const htmlFormStr = htmlList.join('\n')
  let tempForm = buildPageContainer(formConfig, htmlFormStr, type)
  // dialog标签包裹代码
  if (type === 'dialog') {
    tempForm = dialogWrapper(tempForm)
  }
  confGlobal = null
  return tempForm
}

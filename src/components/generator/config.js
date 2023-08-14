// 表单属性【右面板】
export const formConf = {
  fileName: 'filename', // 文件名
  searchUrl: '', // 查询链接
  type: 'page', // 文件生成方式,page, dialog
  uiType: 'element', // ui类型 element
  importUtils: false, // 是否引入工具库
  utilsName: 'kmCommonUtils', // 引入工具名
  mixinName: 'dataReportMixin' // 工具混淆名
};
// 模板配置
export const fileConf = {
  tempSelection: 'default'
  // syncSourceData: true, // 数据源是否同步 同步：true ，空白：false
};
// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '单行文本',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '多行文本',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '密码',
      showLabel: true,
      labelWidth: null,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'password',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入',
    'show-password': true,
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '计数器',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'el-input-number',
      tagIcon: 'number',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
    },
    placeholder: '',
    min: undefined,
    max: undefined,
    step: 1,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false
  },
  {
    __config__: {
      label: '编辑器',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'tinymce',
      tagIcon: 'rich-text',
      defaultValue: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'http://tinymce.ax-z.cn'
    },
    height: 300, // 编辑器高度
    branding: false // 隐藏右下角品牌烙印
  },
  {
    __config__: {
      label: '按钮',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'el-button',
      tagIcon: 'button',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    __slot__: {
      default: '主要按钮'
    },
    type: 'primary',
    clickName: 'search',
    icon: 'el-icon-search',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false
  }
];

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      method: null,
      methodsList: [{ label: 'click', value: 'click' }, { label: 'change', value: 'change' }],
      methodName: 'defMethods',
      label: '下拉选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      html: ''
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false,
    allowCreate: false,
    defaultFirstOption: false
  },
  {
    __config__: {
      label: '级联选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'cascader',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'dynamic',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '单选框组',
      labelWidth: null,
      showLabel: true,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      label: '多选框组',
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      regList: [],
      changeTag: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false
  },
  {
    __config__: {
      label: '开关',
      tag: 'el-switch',
      tagIcon: 'switch',
      defaultValue: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/switch'
    },
    style: {},
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false
  },
  {
    __config__: {
      label: '滑块',
      tag: 'el-slider',
      tagIcon: 'slider',
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/slider'
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false
  },
  {
    __config__: {
      label: '时间选择',
      tag: 'el-time-picker',
      tagIcon: 'time',
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    placeholder: '请选择',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    'picker-options': {
      selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      label: '时间范围',
      tag: 'el-time-picker',
      tagIcon: 'time-range',
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      label: '日期选择',
      tag: 'el-date-picker',
      tagIcon: 'date',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    placeholder: '请选择',
    type: 'date',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '日期范围',
      tag: 'el-date-picker',
      tagIcon: 'date-range',
      defaultValue: null,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: 'colFormItem',
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '评分',
      tag: 'el-rate',
      tagIcon: 'rate',
      defaultValue: 0,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/rate'
    },
    style: {},
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false
  },
  {
    __config__: {
      label: '颜色选择',
      tag: 'el-color-picker',
      tagIcon: 'color',
      span: 24,
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
    },
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    size: 'medium'
  },
  {
    __config__: {
      label: '上传',
      tag: 'el-upload',
      tagIcon: 'upload',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: '点击上传',
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      document: 'https://element.eleme.cn/#/zh-CN/component/upload'
    },
    __slot__: {
      'list-type': true
    },
    action: 'https://jsonplaceholder.typicode.com/posts/',
    disabled: false,
    accept: '',
    name: 'file',
    'auto-upload': true,
    'list-type': 'text',
    multiple: false
  },
  {
    __config__: {
      label: '下划线',
      tag: 'el-divider',
      tagIcon: 'minus',
      defaultValue: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: false,
      regList: [],
      changeTag: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/switch'
    },
    style: {},
    disabled: false,
    direction: 'horizontal',
    'content-position': 'center'
  },
  {
    __config__: {
      label: '走马灯',
      showLabel: true,
      labelWidth: null,
      tag: 'el-carousel',
      tagIcon: 'carousel',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
      carouselItems: [{
        label: '选项一'
      }, {
        label: '选项二'
      }]
    },
    style: { width: '100%' }
  }
];

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      containerType: 'default', // 容器类型，默认是未指定格式的容器，form,表示带有表单属性的容器
      layout: 'rowFormItem',
      tagIcon: 'row',
      label: '行容器',
      layoutTree: true,
      children: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/layout',
      form: {
        formRef: 'elForm',
        formModel: 'formData',
        size: 'medium',
        labelPosition: 'right',
        labelWidth: 100,
        formRules: 'rules',
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: true
      }
    },
    type: 'default',
    justify: 'start',
    align: 'top'
  }
];

// 表格组件 【左面板】
export const tableComponents = [
  {
    __config__: {
      ownTable: false, // 表格是否在表单里面
      label: '表格',
      showLabel: false,
      changeTag: true,
      labelWidth: null,
      tag: 'el-table',
      tagIcon: 'table',
      tbDataType: 'dynamic',
      defaultValue: [],
      span: 24,
      layout: 'colFormItem',
      document: 'https://element.eleme.cn/#/zh-CN/component/table'
    },
    __slot__: {
      elTableColumn: [{
        prop: 'date',
        label: '日期'
      }]
    },
    type: 'primary',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    data: [{
      date: '2016-05-02'
    }],
    stripe: true, // 斑马线
    border: false, // 带边框表格
    height: null // 固定表头(区别编辑器高度),number类型
  }
];

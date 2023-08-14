<template>
  <!-- currentTab === 'form' -->
  <el-form v-if="isShow" ref="baseConfigForm" :model="pageTemplateConf" size="small" label-width="90px" :rules="rules">
    <el-form-item label="生成类型" prop="type">
      <el-radio-group v-model="pageTemplateConf.type">
        <el-radio-button
          v-for="(item, index) in typeOptions"
          :key="index"
          :label="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="工具库导入">
      <el-select
        v-model="pageTemplateConf.importUtils"
        placeholder="请选是否导入公共库"
        :style="{width: '100%'}"
      >
        <el-option v-for="(item, index) in importUtilsList" :key="index" :label="item.label" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工具库名称">
      <el-input v-model="pageTemplateConf.utilsName" placeholder="请输入工具名" clearable />
    </el-form-item>
    <el-form-item label="混合函数名">
      <el-input v-model="pageTemplateConf.mixinName" placeholder="请输入混合函数名" clearable />
    </el-form-item>
    <el-form-item label="ui选择">
      <el-select v-model="pageTemplateConf.uiType" placeholder="请选择" :style="{width: '100%'}">
        <el-option
          v-for="item in uiTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文件名" prop="fileName">
      <el-input v-model="pageTemplateConf.fileName" placeholder="请输入文件名" clearable />
    </el-form-item>
    <div class="btn-group">
      <el-button type="primary" size="small" class="application" @click="application">
        应用
      </el-button>
    </div>
    <!-- <el-form-item label="查询链接">
      <el-input v-model="formConf.searchUrl" placeholder="请输入查询链接" clearable />
    </el-form-item> -->
    <!-- <el-form-item label="表单名">
      <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
    </el-form-item>
    <el-form-item label="表单模型">
      <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
    </el-form-item>
    <el-form-item label="表单尺寸">
      <el-radio-group v-model="formConf.size">
        <el-radio-button label="medium">
          中等
        </el-radio-button>
        <el-radio-button label="small">
          较小
        </el-radio-button>
        <el-radio-button label="mini">
          迷你
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标签对齐">
      <el-radio-group v-model="formConf.labelPosition">
        <el-radio-button label="left">
          左对齐
        </el-radio-button>
        <el-radio-button label="right">
          右对齐
        </el-radio-button>
        <el-radio-button label="top">
          顶部对齐
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item label="栅格间隔">
      <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
    </el-form-item>
    <el-form-item label="禁用表单">
      <el-switch v-model="formConf.disabled" />
    </el-form-item>
    <el-form-item label="表单按钮">
      <el-switch v-model="formConf.formBtns" />
    </el-form-item>
    <el-form-item label="显示未选中组件边框">
      <el-switch v-model="formConf.unFocusedComponentBorder" />
    </el-form-item> -->
  </el-form>
</template>
<script>
// 可拖拽项目
export default {
  components: {
  },
  props: {
    // 组件显示隐藏
    isShow: {
      type: Boolean,
      default: false
    },
    // 表单组件配置
    formConf: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageTemplateConf: {
        type: 'page',
        importUtils: false,
        utilsName: null,
        mixinName: null,
        uiType: 'element',
        fileName: null
      },
      rules: {
        fileName: { required: true, message: '请输入文件名称', trigger: 'blur' }
      },
      typeOptions: [{
        label: '页面',
        value: 'page'
      }, {
        label: '弹窗',
        value: 'dialog'
      }],
      importUtilsList: [
        {
          label: '是',
          id: true
        },
        {
          label: '否',
          id: false
        }
      ],
      uiTypeOption: [{
        label: 'element',
        value: 'element'
      }, {
        label: 'KM-UI',
        value: 'KM-UI'
      }]
    }
  },
  watch: {
    formConf: {
      handler(val) {
        this.pageTemplateConf = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 应用
    application() {
      this.$refs.baseConfigForm.validate(valid => {
        if (!valid) return
        this.$emit('updateFormConf', this.pageTemplateConf)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group{
  text-align: right;
  .confirm{
    margin: 20px 0 0 0px;
  }
}
</style>

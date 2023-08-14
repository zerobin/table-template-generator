<template>
  <el-form v-if="isShow" size="small" label-width="90px">
    <!-- 模板选择组件 -->
    <el-form-item label="模板选择">
      <el-select
        v-model="pageTemplateConf.tempSelection"
        placeholder="请选择模板"
        :style="{width: '100%'}"
      >
        <el-option v-for="(item, index) in tempList" :key="index" :label="item.label" :value="item.id" />
      </el-select>
    </el-form-item>
    <div class="btn-group">
      <el-button type="primary" size="small" class="application" @click="application">
        应用
      </el-button>
    </div>
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
    formConf: {
      type: Object,
      default: () => ({
      })
    },
    drawingList: {
      type: Array,
      default: () => []
    },
    fileConf: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageTemplateConf: {
        tempSelection: 'default'
      },
      currentTempId: 'default',
      tempList: [
        {
          label: '自定义',
          id: 'default',
          // eslint-disable-next-line global-require
          content: require('@/template/default.json')
        },
        {
          label: '报表模板1',
          id: 'report1',
          // eslint-disable-next-line global-require
          content: require('@/template/reportDefault.json')
        },
        {
          label: '表单模板1',
          id: 'form1',
          // eslint-disable-next-line global-require
          content: require('@/template/formDefalut.json')
        },
        {
          label: '大数据模板',
          id: 'dataReport',
          // eslint-disable-next-line global-require
          content: require('@/template/dataReport.json')
        }
      ],
      currentTempData: {} // 当前模板数据
    }
  },
  watch: {
    fileConf: {
      handler(val) {
        this.pageTemplateConf = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    'pageTemplateConf.tempSelection': {
      handler(val) {
        this.currentTempId = val
      },
      immediate: true
    }
  },
  methods: {
    // 应用
    application(val) {
      this.currentTempData = JSON.parse(JSON.stringify(this.getCurrentTemp(this.currentTempId)))
      this.$emit('loadSourceData', 5)
      this.$emit('changeFormConf', this.currentTempData.content.model.form)
      this.$emit('changeDrawingList', this.currentTempData.content.fields, 5, this.pageTemplateConf.tempSelection)
      this.$emit('changeFileConf', JSON.parse(JSON.stringify(this.pageTemplateConf)))
      if (this.pageTemplateConf.tempSelection === 'report1') {
        // 参数表示保留的数据源字段数量
      }
    },
    // 模板选择
    change(val) {
      this.currentTempId = val
    },
    getCurrentTemp(val) {
      const tempArr = this.tempList.filter(item => item.id === val)
      return tempArr.length ? tempArr[0] : null
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

<template>
  <div class="right-board">
    <div>
      <el-tabs v-model="currentTab" class="center-tabs-three">
        <el-tab-pane label="组件属性" name="field" />
        <el-tab-pane label="基础属性" name="base" />
        <el-tab-pane label="模板属性" name="fileConf" />
      </el-tabs>
      <div class="field-box">
        <a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">
          <i class="el-icon-link" />
        </a>
        <el-scrollbar class="right-scrollbar">
          <!-- 组件属性 -->
          <component-attribute
            :is-show="currentTab==='field' && showField"
            :active-data="activeData"
            :form-conf="formConf"
            @tagChange="tagChange"
          />
          <!-- 基础属性 -->
          <form-conf-panel :is-show="currentTab==='base'" :form-conf="formConf" v-on="$listeners" />
          <!-- 模板配置 -->
          <file-conf-panel
            :is-show="currentTab==='fileConf'"
            :drawing-list.sync="drawingList"
            :form-conf.sync="formConf"
            :file-conf.sync="fileConf"
            v-on="$listeners"
          />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import FormConfPanel from './components/FormConfPanel'
import FileConfPanel from './components/FileConfPanel'
import ComponentAttribute from './components/ComponentAttribute'

import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config'
import { saveFormConf, saveFileConf } from '@/utils/db'


export default {
  components: {
    FormConfPanel,
    FileConfPanel,
    ComponentAttribute
    // TableColumnDialog
  },
  props: {
    // 文件配置
    fileConf: {
      type: Object,
      default: () => ({})
    },
    // 数据来源列表
    dataSourceList: {
      type: Array,
      default: () => []
    },
    showField: {
      type: Boolean,
      default: false
    },
    activeData: {
      type: Object,
      default: () => ({
        __config__: {}
      })
    },
    formConf: {
      type: Object,
      default: () => ({
      })
    },
    drawingList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTab: 'field'
    }
  },
  computed: {
    documentLink() {
      return (
        (this.activeData && this.activeData.__config__.document)
        || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    },
    fileConf: {
      handler(val) {
        saveFileConf(val)
      },
      deep: true
    },
    // 是否独立表格
    activeData: {
      handler(val) {
        // if (val && val.__config__ && val.__config__.ownTable) {
        //   this.activeData.__config__.showLabel = !val
        // }
      },
      immediate: true
    }
  },
  methods: {
    tagChange(target) {
      this.$emit('tag-change', target)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 6px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

</style>

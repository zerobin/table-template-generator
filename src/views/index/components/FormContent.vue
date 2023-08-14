<template>
  <el-row class="center-board-row" :gutter="formConf.gutter">
    <!-- <el-form
      :size="formConf.size"
      :label-position="formConf.labelPosition"
      :disabled="formConf.disabled"
      :label-width="formConf.labelWidth + 'px'"
    > -->
    <div class="center-board-row-wrap">
      <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
        <draggable-item
          v-for="(element, index) in drawingList"
          :key="element.renderKey"
          :drawing-list="drawingList"
          :element="element"
          :index="index"
          :active-id="activeId"
          :form-conf="formConf"
          @activeItem="activeFormItem"
          @copyItem="drawingItemCopy"
          @deleteItem="drawingItemDelete"
        />
      </draggable>
      <div v-show="!drawingList.length" class="empty-info">
        从左侧拖入或点选组件进行表单设计
      </div>
    </div>

    <!-- </el-form> -->
  </el-row>
</template>
<script>
import draggable from 'vuedraggable' // 拖拽
import DraggableItem from './DraggableItem'
// 可拖拽项目
export default {
  components: {
    draggable,
    DraggableItem
  },
  props: {
    drawingList: {
      type: Array,
      default: () => []
    },
    formConf: {
      type: Object,
      default: () => {}
    },
    activeId: {
      // eslint-disable-next-line
      type: Number | String,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    // 选中组件
    activeFormItem(element) {
      this.$emit('activeFormItem', element)
      // this.activeData = element
      // this.activeId = element.__config__.formId
    },
    drawingItemCopy(item, parent) {
      this.$emit('drawingItemCopy', item, parent)
    },
    drawingItemDelete(index, parent) {
      this.$emit('drawingItemDelete', index, parent)
    }
  }
}
</script>

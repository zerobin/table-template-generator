<template>
  <div class="data-tree">
    <el-input
      v-model="filterText"
      placeholder="输入源数据字段进行过滤"
    />

    <el-tree
      ref="tree"
      class="filter-tree"
      show-checkbox
      :data="treeData"
      :node-key="nodeKey"
      :props="defaultProps"
      default-expand-all
      check-on-click-node
      :filter-node-method="filterNode"
      @check="check"
    />
    <div class="btn-group">
      <el-button type="primary" size="small" class="confirm" :disabled="!allCheckedNodes.length" @click="getAllCheckedNodes">
        确定添加
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 节点是否可以可选
    treeDisabled: {
      type: Boolean,
      default: false
    },
    // 树形数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 节点唯一标识符
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 默认关键字段
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    }
  },
  data() {
    return {
      filterText: '',
      checkedNode: {}, // 当前选中的节点
      allCheckedNodes: [] // 所有选中的节点
    }
  },
  watch: {
    // 设置可选和不可选
    // treeDisabled: {
    //   handler(val) {
    //     this.setDisabled(this.treeData, val)
    //   },
    //   immediate: true
    // },
    // 报表类型table过滤字段
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 递归设置disabled
    // setDisabled(arr, setVal) {
    //   arr.forEach(item => {
    //     this.$set(item, 'disabled', setVal)
    //     if (item.children) {
    //       this.setDisabled(item.children, setVal)
    //     }
    //   })
    // },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取选中的列表
    check(data, node) {
      this.allCheckedNodes = node.checkedNodes
      this.$emit('realTimeGetAllCheckedNodes', this.allCheckedNodes)
    },
    // len表示数量长度
    getAllCheckedNodes(e, len) {
      // eslint-disable-next-line valid-typeof
      if (typeof e === 'number') {
        len = e
      }
      this.$emit('getAllCheckedNodes', this.allCheckedNodes, len)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-tree{
  margin: 10px 0 0;
}
.btn-group{
  text-align: right;
  .confirm{
    margin: 20px 0 0 0px;
  }
}

</style>

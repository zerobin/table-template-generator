export default {
  elTableColumn(h, conf, key) {
    const list = []
    conf.__slot__.elTableColumn.forEach(item => {
      list.push(<el-table-column label={item.label} prop={item.prop} ></el-table-column>)
    })
    return list
  }
}

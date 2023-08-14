export default {
  carouselItems(h, conf, key) {
    const list = []
    conf.__slot__.carouselItems.forEach(item => {
      list.push(<el-carousel-item>{item.label}</el-carousel-item>)
    })
    return list
  }
}

<script>
import draggable from 'vuedraggable'
import render from '@/components/render/render'

const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(element, parent); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}

const layouts = {
  colFormItem(h, element, index, parent, elementparent) {
    const { activeItem } = this.$listeners
    const config = element.__config__
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    if (elementparent && elementparent.__config__.containerType === 'form') {
      const parentconfig = elementparent.__config__
      return (
        <el-form
          ref={parentconfig.form.formRef}
          size={parentconfig.form.size}
          label-position={parentconfig.form.labelPosition}
          disabled={parentconfig.form.disabled}
          label-width={`${parentconfig.form.labelWidth}px`}>
          <el-col span={config.span} class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <el-form-item label-width={labelWidth} label={config.showLabel ? config.label : ''} required={config.required}>
              <render key={config.renderKey} conf={element} onInput={ event => {
                this.$set(config, 'defaultValue', event)
              }} />
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
        </el-form>
      )
    }
    return (
      <el-col span={config.span} class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        <div class="no-form" style="display:flex; justify-content: center;align-items: center; margin-bottom: 10px;">
          <span style={`color:#606266; font-size:14px; text-align:right;padding:0 12px 0 0; width:${config.labelWidth ? config.labelWidth : '100'}px; display:${config.showLabel ? 'inline-block' : 'none'}`} >{config.label}</span>
          <div style="flex: 1; overflow: hidden;">
            <render key={config.renderKey} conf={element} onInput={ event => {
              this.$set(config, 'defaultValue', event)
            }}/>
          </div>
        </div>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const className = this.activeId === element.__config__.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    const config = element.__config__
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children} animation={340} group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  }
}

function renderChildren(h, element, index, parent) {
  const config = element.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children, element)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.__config__.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.element.__config__.layout]
    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>

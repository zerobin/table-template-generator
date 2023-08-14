import { setSession, getSession } from './index'

const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.1'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'
const FILE_CONF = 'fileConf'
const HISTORY_LIST = 'historyList'
const HISTORY_LIST_INDEX = 'historyListIndex'

export function getDrawingList() {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  // const version = getSession(DRAWING_ITEMS_VERSION_KEY, 'String')
  // if (version !== DRAWING_ITEMS_VERSION) {
  //   setSession(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
  //   saveDrawingList([])
  //   return null
  // }

  const str = getSession(DRAWING_ITEMS, 'Array')
  if (str) return JSON.parse(str)
  return null
}

// 保存中间面板的数据列表
export function saveDrawingList(list) {
  setSession(DRAWING_ITEMS, JSON.stringify(list))
}

export function getIdGlobal() {
  const str = getSession(DRAWING_ID, 'String')
  if (str) return parseInt(str, 10)
  return 100
}

export function saveIdGlobal(id) {
  setSession(DRAWING_ID, `${id}`)
}

export function getTreeNodeId() {
  const str = getSession(TREE_NODE_ID, 'String')
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId(id) {
  setSession(TREE_NODE_ID, `${id}`)
}

export function getFormConf() {
  const str = getSession(FORM_CONF)
  if (JSON.stringify(str) !== JSON.stringify({})) {
    return JSON.parse(str)
  }
  return null
}

export function saveFormConf(obj) {
  setSession(FORM_CONF, JSON.stringify(obj))
}


export function getFileConf() {
  const str = getSession(FILE_CONF)
  if (JSON.stringify(str) !== JSON.stringify({})) {
    return JSON.parse(str)
  }
  return null
}

export function saveFileConf(obj) {
  setSession(FILE_CONF, JSON.stringify(obj))
}

export function getHistoryList() {
  const str = getSession(HISTORY_LIST, 'Array')
  if (str) return JSON.parse(str)
  return null
}

export function saveHistoryList(list) {
  setSession(HISTORY_LIST, JSON.stringify(list))
}

export function getHistoryListIndex() {
  const str = getSession(HISTORY_LIST_INDEX, 'Number')
  if (str) return JSON.parse(str)
  return null
}

export function saveHistoryListIndex(data) {
  setSession(HISTORY_LIST_INDEX, JSON.stringify(data))
}

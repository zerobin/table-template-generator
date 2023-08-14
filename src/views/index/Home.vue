<!--
 * @Date: 2020-06-03 15:21:58
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2023-08-14 15:39:12
-->
<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          Table-Template-Generator
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <!-- 左侧组件面板 -->
        <div class="components-list">
          <el-tabs v-model="modelTab" class="center-tabs">
            <el-tab-pane label="基础组件" name="base">
              <div class="components-list-inner">
                <div
                  v-for="(item, listIndex) in leftComponents"
                  :key="listIndex"
                >
                  <div class="components-title">
                    <!-- <svg-icon icon-class="component" /> -->
                    {{ item.title }}
                  </div>
                  <!-- :list="item.list" -->
                  <draggable
                    v-model="item.list"
                    class="components-draggable"
                    :group="{
                      name: 'componentsGroup',
                      pull: 'clone',
                      put: false
                    }"
                    :clone="cloneComponent"
                    draggable=".components-item"
                    :sort="false"
                    @end="onEnd"
                  >
                    <div
                      v-for="(element, index) in item.list"
                      :key="index"
                      class="components-item"
                      @click="addComponent(element)"
                    >
                      <div class="components-body">
                        <svg-icon :icon-class="element.__config__.tagIcon" />
                        {{ element.__config__.label }}
                      </div>
                    </div>
                  </draggable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="模型数据" name="model">
              <div class="components-list-inner">
                <el-form
                  ref="newFileFrom"
                  :model="moduleData"
                  label-width="70px"
                  :rules="moduleRules"
                >
                  <el-form-item label="数据源" prop="sourceData">
                    <el-select
                      v-model="moduleData.sourceData"
                      placeholder="请选择数据源"
                      :style="{ width: '100%' }"
                    >
                      <el-option
                        v-for="(item, index) in sourceDataList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-button
                  type="primary"
                  :style="{ width: '100%', marginBottom: '10px' }"
                  @click="showModuleDataPanel"
                >
                  数据源高级配置
                </el-button>
                <module-data-tree
                  ref="reportModelTree"
                  style="margin: 10px 0 0;"
                  :tree-data="treeData"
                  node-key="prop"
                  @getAllCheckedNodes="getAllCheckedNodes"
                  @realTimeGetAllCheckedNodes="realTimeGetAllCheckedNodes"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <!-- 工具面板 -->
      <div class="action-bar">
        <el-button
          icon="el-icon-back"
          :disabled="!historyList.length || historyListIndex <= -1"
          type="text"
          @click="back"
        >
          后退
        </el-button>
        <el-button
          icon="el-icon-right"
          :disabled="
            !historyList.length || historyListIndex === historyList.length - 1
          "
          type="text"
          @click="forward"
        >
          前进
        </el-button>
        <el-button icon="el-icon-video-play" type="text" @click="run">
          查看源码
        </el-button>
        <!-- <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button> -->
        <el-button icon="el-icon-download" type="text" @click="download">
          文件保存
        </el-button>
        <!-- <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button> -->
        <el-button
          class="delete-btn"
          icon="el-icon-delete"
          type="text"
          @click="empty"
        >
          清空
        </el-button>
        <!-- <el-button class="delete-btn" type="text" @click="save">
          <svg-icon icon-class="save" style="font-size:20px; padding-right:8px; " />保存
        </el-button> -->
      </div>
      <div class="main-panel clearfix">
        <div class="main-code">
          <!-- 运行操作后的表单页面显示 -->
          <div v-show="editVisible">
            <form-drawer
              v-if="drawerVisible"
              :edit-visible.sync="editVisible"
              :visible.sync="drawerVisible"
              :form-data="formData"
              size="100%"
              :file-name="fileName"
              :generate-conf="generateConf"
            />
          </div>
        </div>
        <div
          class="main-component"
          :class="{ 'main-component-width': !editVisible || !drawerVisible }"
        >
          <el-scrollbar class="center-scrollbar">
            <!-- 中间显示组件 -->
            <form-content
              :active-id="activeId"
              :drawing-list="drawingList"
              :form-conf="formConf"
              @activeFormItem="activeFormItem"
              @drawingItemCopy="drawingItemCopy"
              @drawingItemDelete="drawingItemDelete"
            />
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- 右侧属性面板 -->
    <right-panel
      :active-data="activeData"
      :form-conf.sync="formConf"
      :file-conf.sync="fileConf"
      :drawing-list.sync="drawingList"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
      @changeFileConf="changeFileConf"
      @changeFormConf="changeFormConf"
      @changeDrawingList="changeDrawingList"
      @updateFormConf="updateFormConf"
    />
    <source-data-panel
      v-if="moduleDataDialogVisible"
      :is-show.sync="moduleDataDialogVisible"
      :module-data.sync="moduleData"
      :source-data-list="sourceDataList"
      :source-type-list="sourceTypeList"
      @setModuleData="setModuleData"
    />

    <!-- json查看面板 -->
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      :file-name="fileName"
      @refresh="refreshJson"
    />
    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
import FormContent from './components/FormContent'; // 中间组件
import ModuleDataTree from './components/ModuleDataTree'; // 树形模型数据组件
import SourceDataPanel from './components/SourceDataPanel'; // 数据源高级配置面板

import { parse } from '@/parse/index';
import axios from 'axios';
import draggable from 'vuedraggable'; // 拖拽
import { debounce } from 'throttle-debounce'; // 节流防抖
import { saveAs } from 'file-saver'; // 文件保存
import ClipboardJS from 'clipboard'; // 鼠标复制
import render from '@/components/render/render';
import FormDrawer from './FormDrawer'; // 表单绘制
import JsonDrawer from './JsonDrawer'; // json绘制
import RightPanel from './RightPanel'; // 右侧组件面板
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  tableComponents,
  formConf,
  fileConf
} from '@/components/generator/config'; // 配置表
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase
} from '@/utils/index'; // 工具函数
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from '@/components/generator/html';
import { makeUpJs } from '@/components/generator/js';
import { makeUpCss } from '@/components/generator/css';
import logo from '@/assets/logo.jpg';
import CodeTypeDialog from './CodeTypeDialog'; // 复制类型对话框
import DraggableItem from './components/DraggableItem'; // 可拖拽项目
import {
  getDrawingList,
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf,
  getFileConf,
  saveHistoryList,
  getHistoryList,
  getHistoryListIndex,
  saveHistoryListIndex
} from '@/utils/db'; // 本地存储工具函数
import loadBeautifier from '@/utils/loadBeautifier';

import {
  fetchModules,
  regModule,
  fetchModuleitems,
  fetchModulestructure
} from '@/api/module';
// 代码格式化
let beautifier;
const emptyActiveData = { style: {}, autosize: {} };
let oldActiveId;
let tempActiveData;
const HISTORY_MAX_NUM = 5;

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem,
    FormContent,
    ModuleDataTree,
    SourceDataPanel
  },
  data() {
    return {
      modelTab: 'base', // 模型tab：基础组件：base, 模型：model
      fileName: null,
      logo,
      idGlobal: null,
      formConfInDB: null,
      fileConfInDB: null,
      formConf, // config表里面的formConf（表单属性）
      fileConf, // config表里面的file（文件属性）
      inputComponents, // config表里面的inputComponents（输入项型组件）
      selectComponents, // config表里面的selectComponents（选择型组件）
      layoutComponents, // config表里面的layoutComponents（布局组件）
      tableComponents, // config表里面的layoutComponents（表格组件）
      checkedNodes: [], // 所有选中的节点
      checkedNodesSearch: [], // 所有选中的节点
      treeDisabledSearch: false,
      checkedNodeList: [], // 选中的树形节点
      labelWidth: 100,
      drawingList: [], // 中间面板的数据列表
      drawingData: {},
      activeId: null,
      drawerVisible: false,
      editVisible: false,
      formData: {}, // 中间面板的所有组件数据和整体的表单数据，结合后生成一份config，然后由各自的generate函数渲染
      jsonDrawerVisible: false,
      generateConf: null,
      activeData: { __config__: {} },
      saveDrawingListDebounce: debounce(200, saveDrawingList),
      saveIdGlobalDebounce: debounce(200, saveIdGlobal),
      saveGetFormConfDebounce: debounce(200, getFormConf),
      saveGetFileConfDebounce: debounce(200, getFileConf),
      saveHistoryListDebounce: debounce(200, saveHistoryList),
      saveGetHistoryIndexDebounce: debounce(200, saveHistoryListIndex),
      addHistory: debounce(200, that => {
        // 非主动操作历史记录
        if (!that.activeStatus) {
          if (that.historyListIndex < that.historyList.length - 1) {
            // 索引是0时,保留最后一个历史记录，其他时候按需截取
            if (that.historyListIndex === 0) {
              // that.historyList.splice(1)
            } else if (that.historyListIndex === -1) {
              that.historyList.splice(0);
            } else {
              that.historyList.splice(that.historyListIndex + 1);
            }
          }
          // 只保留最大历史列表
          if (that.historyList.length > HISTORY_MAX_NUM - 1) {
            this.oldHistoryList = JSON.parse(
              JSON.stringify(that.historyList.shift())
            );
            // that.historyList.shift()
          }
          that.historyList.push({
            drawingList: JSON.parse(JSON.stringify(that.drawingList)),
            formConf: JSON.parse(JSON.stringify(that.formConf)),
            fileConf: JSON.parse(JSON.stringify(that.fileConf))
          });
          if (that.historyListIndex < that.historyList.length - 1) {
            that.historyListIndex++;
          }
          // 历史索引定位到历史列表的最后一项
        }
        that.activeStatus = false;
      }),
      historyList: [], // 历史记录列表
      oldHistoryList: {},
      historyListIndex: -1, // 历史记录索引(游标)
      activeStatus: true, // 是否主动操作历史记录，例如后退，前进，清除
      historyMaxNum: HISTORY_MAX_NUM, // 历史记录保存最大值
      leftComponents: [
        {
          title: '输入型组件',
          list: inputComponents
        },
        {
          title: '选择型组件',
          list: selectComponents
        },
        {
          title: '布局型组件',
          list: layoutComponents
        },
        {
          title: '表格组件',
          list: tableComponents
        }
      ],
      treeData: [
        {
          prop: '1',
          label: '一级 1',
          children: [
            {
              prop: '4',
              label: '二级 1-1',
              children: [
                {
                  prop: '9',
                  label: '三级 1-1-1'
                },
                {
                  prop: '10',
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          prop: '2',
          label: '一级 2',
          children: [
            {
              prop: '5',
              label: '二级 2-1'
            },
            {
              prop: '6',
              label: '二级 2-2'
            }
          ]
        },
        {
          prop: '3',
          label: '一级 3',
          children: [
            {
              prop: '7',
              label: '二级 3-1'
            },
            {
              prop: '8',
              label: '二级 3-2'
            }
          ]
        }
      ],
      treeDataSearch: [
        {
          prop: '1',
          label: '一级 1',
          children: [
            {
              prop: '4',
              label: '二级 1-1',
              children: [
                {
                  prop: '9',
                  label: '三级 1-1-1',
                  filed: 'firstFirst'
                },
                {
                  prop: '10',
                  label: '三级 1-1-2',
                  filed: 'firstSecond'
                }
              ]
            },
            {
              prop: '11',
              label: '二级 1-2',
              children: [
                {
                  prop: '12',
                  label: '三级 1-2-1',
                  filed: 'firstSecondFirst'
                },
                {
                  prop: '13',
                  label: '三级 1-2-2',
                  filed: 'firstSecondSecond'
                }
              ]
            }
          ]
        },
        {
          prop: '2',
          label: '一级 2',
          children: [
            {
              prop: '5',
              label: '二级 2-1',
              filed: 'secondFirst'
            },
            {
              prop: '6',
              label: '二级 2-2',
              filed: 'secondSecond'
            }
          ]
        },
        {
          prop: '3',
          label: '一级 3',
          children: [
            {
              prop: '7',
              label: '二级 3-1',
              filed: 'thirdFirst'
            },
            {
              prop: '8',
              label: '二级 3-2',
              filed: 'thirdSecond'
            }
          ]
        }
      ],
      moduleId: null,
      moduleItemId: null,
      moduleData: {
        sourceType: null,
        sourceData: null
      },
      sourceDataList: [
        // 数据源列表
        {
          name: '大数据',
          id: 'data'
        },
        {
          name: '有数',
          id: 'youshu'
        }
      ],
      moduleRules: {
        sourceData: {
          required: true,
          message: '请选择数据源',
          trigger: 'change'
        }
      },
      moduleDataDialogVisible: false,
      sourceTypeList: [], // 模块类型列表
      handleModelData: false // 手动设置源数据
    };
  },
  computed: {},
  watch: {
    // 数据源模块类型变化
    'moduleData.sourceType': {
      handler(val) {
        this.getModuleItemData(val);
      },
      deep: true
    },
    // 数据源变化
    'moduleData.sourceData': {
      handler(val) {
        this.getSourceData(val);
      },
      deep: true
    },
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined
        || !this.activeData.__config__.tag
        || oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true
    },
    historyList: {
      handler(val) {
        this.saveHistoryListDebounce(this.historyList);
      },
      deep: true,
      immediate: true
    },
    historyListIndex: {
      handler(val) {
        this.saveGetHistoryIndexDebounce(this.historyListIndex);
      },
      deep: true,
      immediate: true
    },
    drawingList: {
      handler(val) {
        console.log(val, '77777777777');
        const that = this;
        if (val.length === 0) that.idGlobal = 100;
        that.saveDrawingListDebounce(val);
        that.addHistory(that);
        // that.execDownload(that.formConf)
        if (that.drawerVisible) {
          that.AssembleFormData();
        }
      },
      deep: true
    },
    formConf: {
      handler(val) {
        const that = this;
        that.saveGetFormConfDebounce(val);
        that.addHistory(that);
        // that.execDownload(that.formConf)
        if (that.drawerVisible) {
          that.AssembleFormData();
        }
      },
      deep: true
    },
    fileConf: {
      handler(val) {
        const that = this;
        that.saveGetFileConfDebounce(val);
        that.addHistory(that);
        // that.execDownload(that.formConf)
        if (that.drawerVisible) {
          that.AssembleFormData();
        }
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true
    },
    activeData: {
      handler(val) {},
      deep: true
    }
  },
  mounted() {
    this.getModuleTypeData();
    const html = parse('', '');
    console.log(html, '测试');
    const drawingListInDB = getDrawingList(); // 获取中间编辑列表数据
    this.formConfInDB = getFormConf(); // 获取表单配置
    this.fileConfInDB = getFileConf(); // 获取文件配置
    this.idGlobal = getIdGlobal(); // 获取全局组件id
    this.historyList = getHistoryList() || [];
    if (!isNaN(parseInt(getHistoryListIndex(), 10))) {
      this.historyListIndex = +parseInt(getHistoryListIndex(), 10);
    } else {
      this.historyListIndex = -1;
    }
    if (this.formConfInDB) {
      this.formConf = this.formConfInDB;
    }
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB;
      this.oldHistoryList = {
        drawingList: JSON.parse(JSON.stringify(this.drawingList)),
        formConf: JSON.parse(JSON.stringify(this.formConf)),
        fileConf: JSON.parse(JSON.stringify(this.fileConf))
      };
    } else {
      this.oldHistoryList = {
        drawingList: [],
        formConf: JSON.parse(JSON.stringify(this.formConf)),
        fileConf: JSON.parse(JSON.stringify(this.fileConf))
      };
    }
    if (this.drawingList.length) {
      this.activeFormItem(this.drawingList[0]);
    }

    this.fileName = this.fileConf.fileName;

    // 代码采用js beautifier插件格式化
    loadBeautifier(btf => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generateCode();
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        });
        return codeStr;
      }
    });
    clipboard.on('error', e => {
      this.$message.error('代码复制失败');
    });
  },
  methods: {
    // 设置源数据
    setModuleData(val) {
      this.handleModelData = true; // 通知手动修改数据
      this.moduleData = val;
    },
    // 获取模块类型，并且初始选择第一个类型
    async getModuleTypeData() {
      this.sourceTypeList = (await fetchModules()) || [];
      this.moduleData.sourceType = this.sourceTypeList[0] && this.sourceTypeList[0].id;
    },
    // 获取子模块数据
    async getModuleItemData(val) {
      this.sourceDataList = (await fetchModuleitems(val)) || [];
      if (!this.handleModelData) {
        this.moduleData.sourceData = this.sourceDataList[0] && this.sourceDataList[0].id;
      } else {
        this.handleModelData = false;
      }
    },
    // 获取最终源数据
    async getSourceData(val) {
      // 根据选择的数据来源重新渲染右边树形结构数据
      const tempData = await fetchModulestructure(val);
      const treeData = this.modifyProperty(tempData);
      this.treeData = JSON.parse(JSON.stringify(treeData));
      this.treeDataSearch = JSON.parse(JSON.stringify(treeData));
    },
    // 显示数据源高级配置面板
    showModuleDataPanel() {
      this.moduleDataDialogVisible = true;
    },
    // 更改文件配置
    changeFileConf(val) {
      this.$set(this, 'fileConf', val);
    },
    // 更改表单配置
    changeFormConf(val) {
      this.$set(this, 'formConf', val);
    },
    // 递归容器唯一值componentName和formId递增
    containerIdIncreasing(val) {
      val.forEach(item => {
        const config = item.__config__;
        if (config && config.layout === 'rowFormItem') {
          config.componentName = `row${++this.idGlobal}`;
          config.formId = ++this.idGlobal;
          if (config.children && config.children) {
            this.containerIdIncreasing(config.children);
          }
        }
      });
    },
    // 更改中间区块数据
    changeDrawingList(val, len, templateType) {
      if (templateType === 'report1') {
        // 处理容器名预先递增
        if (val && !val.length) return;
        const copyVal = JSON.parse(JSON.stringify(val));
        this.containerIdIncreasing(copyVal);

        // 如果有模型数据，添加模型数据源
        this.loadSourceData(this, copyVal, len);

        // 根据当前是否容器添加
        if (this.activeData.__config__.layout === 'rowFormItem') {
          this.activeData.__config__.children.push(...copyVal);
        } else {
          this.drawingList.push(...copyVal);
        }
        return;
      }
      if (
        this.activeData
        && this.activeData.__config__
        && this.activeData.__config__.layout === 'rowFormItem'
      ) {
        this.activeData.__config__.children
          && this.activeData.__config__.children.push(...val);
      } else {
        this.drawingList.push(...val);
      }
    },
    // 加载源数据
    loadSourceData(that, modelList, len) {
      if (!modelList.length) return [];
      // 如果有选择的树形节点，那么按照选择的树形节点添加，如果不是那么默认取len的长度
      if (this.checkedNodes.length) {
        const temp = JSON.parse(JSON.stringify(this.checkedNodes));
        const currentData = JSON.parse(JSON.stringify(inputComponents[0]));
        modelList.forEach(filed => {
          const config = filed.__config__;
          const clone = [];
          if (config.layout === 'rowFormItem') {
            temp.forEach(item => {
              currentData.__config__.label = item.label;
              currentData.__config__.placeholder = item.label;
              clone.push(that.cloneComponent(currentData, item.prop, 6));
            });
            config.children.splice(0, config.children.length - 1);
            config.children && config.children.unshift(...clone);
          } else if (config.tag === 'el-table') {
            // 选中组件全部添加到表格中
            filed.__slot__.elTableColumn = [...temp];
          } else {
            temp.forEach(item => {
              currentData.__config__.label = item.label;
              currentData.__config__.placeholder = item.label;
              that.addComponentInTemplate(currentData, item.prop);
            });
            modelList.shift();
          }
        });
      } else {
        const tableColumn = JSON.parse(JSON.stringify(that.treeData));
        const labelTreeNode = JSON.parse(JSON.stringify(that.treeData));
        const currentData = JSON.parse(JSON.stringify(inputComponents[0]));

        tableColumn.splice(len);
        // 这个根据len来判断是否给表格添加列字段其实不太合理，应该多一个参数字段判断是否给表格添加列字段
        modelList.forEach(filed => {
          const config = filed.__config__;
          const clone = [];
          if (config.layout === 'rowFormItem') {
            labelTreeNode.splice(2);
            if (that.treeData && that.treeData.length) {
              labelTreeNode.forEach(item => {
                currentData.__config__.label = item.label;
                currentData.__config__.placeholder = item.label;
                clone.push(that.cloneComponent(currentData, item.prop, 6));
              });
              config.children.splice(0, config.children.length - 1);
              config.children && config.children.unshift(...clone);
            }
          } else if (config.tag === 'el-table') {
            // 选中组件全部添加到表格中
            if (that.treeData && that.treeData.length) {
              filed.__slot__.elTableColumn = [...tableColumn];
            } else {
              filed.__slot__.elTableColumn.push(...tableColumn);
            }
          } else {
            labelTreeNode.splice(2);
            if (that.treeData && that.treeData.length) {
              labelTreeNode.forEach(item => {
                currentData.__config__.label = item.label;
                currentData.__config__.placeholder = item.label;
                that.addComponentInTemplate(currentData, item.prop);
              });
              modelList.shift();
            }
          }
        });
      }
      return modelList;
    },
    // 更新基础属性formConf
    updateFormConf(val) {
      this.formConf = JSON.parse(JSON.stringify(val));
    },
    realTimeGetAllCheckedNodes(checkedNodes) {
      this.checkedNodes = checkedNodes.filter(item => !item.children);
    },
    // 选中的数据源节点
    getAllCheckedNodes(checkedNodes) {
      this.checkedNodes = checkedNodes.filter(item => !item.children);
      if (this.activeData.__config__.tag === 'el-table') {
        // 选中组件全部添加到表格中
        this.activeData.__slot__.elTableColumn.push(...this.checkedNodes);
        this.checkedNodes.forEach(item => {
          this.activeData.data[0][item.prop] = null;
        });
      } else if (this.activeData.__config__.layout === 'rowFormItem') {
        const currentData = JSON.parse(JSON.stringify(inputComponents[0]));
        this.checkedNodes.forEach(item => {
          currentData.__config__.label = item.label;
          currentData.__config__.placeholder = item.label;
          this.addComponentInRow(currentData, item.prop);
        });
      } else {
        const currentData = JSON.parse(JSON.stringify(inputComponents[0]));
        this.checkedNodes.forEach(item => {
          currentData.__config__.label = item.label;
          currentData.__config__.placeholder = item.label;
          this.addComponent(currentData, item.prop);
        });
      }
      // 增加之后去除选中状态
      this.$refs.reportModelTree.$refs.tree.setCheckedKeys([]);
      this.$refs.reportModelTree.allCheckedNodes = [];
    },
    modifyProperty(arrObj) {
      arrObj.forEach(item => {
        item.prop = item.columnName;
        delete item.columnName;
        item.label = item.columnLabel;
        delete item.columnLabel;
        if (item.children) {
          this.modifyProperty(item.children);
        }
      });
      return arrObj;
    },
    // 保存
    save() {
      this.saveDrawingListDebounce(this.drawingList);
      this.saveGetFormConfDebounce(this.formConf);
      this.saveGetFileConfDebounce(this.fileConf);
      this.historyList = [];
      this.oldHistoryList = {
        drawingList: JSON.parse(JSON.stringify(this.drawingList)),
        formConf: JSON.parse(JSON.stringify(this.formConf)),
        fileConf: JSON.parse(JSON.stringify(this.fileConf))
      };
      this.$message.success('保存成功');
    },
    // 前进
    forward() {
      this.activeStatus = true;
      if (!this.historyList.length) return;
      if (+this.historyListIndex < HISTORY_MAX_NUM - 1) {
        this.historyListIndex++;
      } else {
        this.historyListIndex = HISTORY_MAX_NUM - 1;
      }
      if (this.historyListIndex < this.historyList.length) {
        this.drawingList = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].drawingList)
        ) || [];
        this.formConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].formConf)
        ) || {};
        this.fileConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].fileConf)
        ) || {};
        const hitArr = this.drawingList.filter(
          item => item.__config__.formId === this.activeId
        );
        this.activeData = (hitArr && hitArr.length && hitArr[0]) || {
          __config__: {},
          __solt__: {}
        };
      }
    },
    // 后退
    back() {
      this.activeStatus = true;
      if (!this.historyList.length) return;
      if (+this.historyListIndex > -1) {
        this.historyListIndex--;
      } else {
        this.historyListIndex = -1;
      }
      // 当历史索引在最开始的时候，采用老数据（老数据会一直是历史数组的第一个）
      if (this.historyListIndex === -1) {
        this.drawingList = JSON.parse(JSON.stringify(this.oldHistoryList.drawingList)) || [];
        this.formConf = JSON.parse(JSON.stringify(this.oldHistoryList.formConf)) || {};
        this.fileConf = JSON.parse(JSON.stringify(this.oldHistoryList.fileConf)) || {};
        const hitArr = this.drawingList.filter(
          item => item.__config__.formId === this.activeId
        );
        this.activeData = (hitArr && hitArr.length && hitArr[0]) || {
          __config__: {},
          __solt__: {}
        };
        return;
      }
      if (this.historyListIndex < this.historyList.length) {
        this.drawingList = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].drawingList)
        ) || [];
        this.formConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].formConf)
        ) || {};
        this.fileConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].fileConf)
        ) || {};
        const hitArr = this.drawingList.filter(
          item => item.__config__.formId === this.activeId
        );
        this.activeData = (hitArr && hitArr.length && hitArr[0]) || {
          __config__: {},
          __solt__: {}
        };
      }
    },
    // 选中组件
    activeFormItem(element) {
      this.activeData = element;
      this.activeId = element.__config__.formId;
    },
    // 左侧组件拖拽后回调
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    // 添加组件
    addComponent(item, prop) {
      if (this.activeData.__config__.layout === 'rowFormItem') {
        this.addComponentInRow(item, prop);
      } else {
        const clone = this.cloneComponent(item, prop);
        this.drawingList.push(clone);
        this.activeFormItem(clone);
      }
    },
    // 添加在容器里面
    addComponentInRow(item, prop) {
      const clone = this.cloneComponent(item, prop);
      this.activeData.__config__
        && this.activeData.__config__.children
        && this.activeData.__config__.children.push(clone);
    },
    addComponentInTemplate(item, prop) {
      const clone = this.cloneComponent(item, prop);
      // 使新增的table永远放在最下面
      this.drawingList.push(clone);
      // this.drawingList.push(clone)
    },
    // 克隆组件
    cloneComponent(origin, prop, span) {
      const clone = JSON.parse(JSON.stringify(origin));
      const config = clone.__config__;
      config.formId = ++this.idGlobal;
      config.span = span || 24;
      config.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        clone.__vModel__ = prop || `field${this.idGlobal}`;
        clone.prop = prop;
        clone.placeholder !== undefined && (clone.placeholder += config.label);
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`;
        config.gutter = this.formConf.gutter || 15;
      }
      tempActiveData = clone;
      return tempActiveData;
    },
    // 表单数据集合器:收集中间编辑的配置数据
    AssembleFormData() {
      this.formData = {
        fields: JSON.parse(JSON.stringify(this.drawingList)),
        model: {
          form: JSON.parse(JSON.stringify(this.formConf)),
          file: JSON.parse(JSON.stringify(this.fileConf))
        }
      };
    },
    // 生成器 data: {fileName: undefined, type: 'file'}
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    // 运行操作
    execRun(data) {
      this.AssembleFormData();
      this.drawerVisible = true;
      this.editVisible = true;
    },
    // 导出操作
    execDownload(data, isSaveAsLocal) {
      this.generateConf = data;
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
      if (!data.fileName) {
        this.$message.warning('请先在文件配置中输入文件名');
        return;
      }
      if (isSaveAsLocal) {
        saveAs(blob, `${data.fileName}.vue`);
      }
      axios({
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        url: 'http://localhost:3000/save',
        data: {
          codeStr,
          name: data.fileName
        }
      })
        .then(res => {
          this.$message.success('文件生成成功');
          console.log(res && res.data.msg);
        })
        .catch(err => {
          this.$message.success('文件生成失败');
          console.log(err);
        });
    },
    // 复制代码操作
    execCopy(data) {
      document.getElementById('copyNode').click();
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = [];
          this.activeData = { __config__: {} };
          this.idGlobal = 100;
          this.activeStatus = true;
          this.historyList = [];
          this.historyListIndex = -1;
          this.oldHistoryList = {
            drawingList: [],
            formConf: JSON.parse(JSON.stringify(this.formConf)),
            fileConf: JSON.parse(JSON.stringify(this.fileConf))
          };
        }
      );
    },
    // 组件复制
    drawingItemCopy(item, parent) {
      let clone = JSON.parse(JSON.stringify(item));
      clone = this.createIdAndKey(clone);
      parent.push(clone);
      this.activeFormItem(clone);
    },
    // 创建唯一Id和key值
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = +new Date();
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`;
      }
      // 如果组件里面还有子组件，递归调用
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem));
      }
      return item;
    },
    // 删除组件
    drawingItemDelete(index, parent) {
      parent.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        } else {
          this.$set(this, 'activeData', { __config__: {}, __solt__: {} });
        }
      });
    },
    // 代码生成器
    generateCode() {
      // 新增ui类型选择
      if (!this.generateConf) return false;
      const { type, uiType } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formData, type));
      let html = vueTemplate(makeUpHtml(this.formData, type));
      let css = cssStyle(makeUpCss(this.formData));
      if (uiType === 'KM-UI') {
        const regExpHead = /<el-/gi;
        const regExpEnd = /<\/el-/gi;
        const regExpCss = /el-/gi;
        html = html.replace(regExpHead, '<km-');
        html = html.replace(regExpEnd, '</km-');
        css = css.replace(regExpCss, 'km-');
      }
      // 返回的代码进行格式化
      return (
        beautifier && beautifier.html(html + script + css, beautifierConf.html)
      );
    },
    showJson() {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download() {
      this.operationType = 'download';
      this.execDownload(this.formConf, true);
      // this.generate(this.fileConf)
    },
    run() {
      this.operationType = 'run';
      this.generate(this.formConf);
    },
    copy() {
      this.operationType = 'copy';
      this.generate(this.formConf);
    },
    // 右侧组件属性的：组件类型选择
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = this.activeData.__vModel__;
      config.formId = this.activeId;
      config.span = this.activeData.__config__.span;
      this.activeData.__config__.tag = config.tag;
      this.activeData.__config__.tagIcon = config.tagIcon;
      this.activeData.__config__.document = config.document;
      if (
        typeof this.activeData.__config__.defaultValue
        === typeof config.defaultValue
      ) {
        config.defaultValue = this.activeData.__config__.defaultValue;
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    // 更新中间组件列表
    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        item => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) {
            this.updateDrawingList(newTag, item.__config__.children);
          }
        });
      }
    },
    refreshJson(data) {
      this.drawingList = JSON.parse(JSON.stringify(data.fields));
      delete data.fields;
      this.formConf = data;
    }
    // setDisabled(arr, setVal) {
    //   arr.forEach(item => {
    //     this.$set(item, 'disabled', setVal)
    //     if (item.children) {
    //       this.setDisabled(item.children, setVal)
    //     }
    //   })
    // }
  },
  beforeRouteLeave(to, from, next) {
    if (this.historyList.length) {
      this.$confirm('确认不保存离开当前页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
          console.log('取消离开');
        });
    } else {
      next();
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/home";
.drawing-board {
  .el-form-item__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

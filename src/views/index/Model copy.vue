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
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ item.title }}
            </div>
            <!-- :list="item.list" -->
            <draggable
              v-model="item.list"
              class="components-draggable"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
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
      </el-scrollbar>
    </div>

    <div class="center-board">
      <!-- 工具面板 -->
      <div class="action-bar">
        <el-button icon="el-icon-tickets" type="text" @click="goToModelPage">
          模板列表
        </el-button>
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
          运行
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          下载vue文件
        </el-button>
        <el-button
          class="copy-btn-main"
          icon="el-icon-document-copy"
          type="text"
          @click="copy"
        >
          复制代码
        </el-button>
        <el-button
          class="delete-btn"
          icon="el-icon-delete"
          type="text"
          @click="empty"
        >
          清空
        </el-button>
        <el-button class="delete-btn" type="text" @click="save">
          <svg-icon
            icon-class="save"
            style="font-size:20px; padding-right:8px; "
          />保存
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <!-- 中间显示组件 -->
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
            >
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
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 右侧属性面板 -->
    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :form-data="drawingList"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />
    <!-- 运行操作后的表单页面显示 -->
    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <!-- json查看面板 -->
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <!-- 代码生成类型对话框 -->
    <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script>
import { parse } from "@/parse/index";
import axios from "axios";
import draggable from "vuedraggable"; // 拖拽
import { debounce } from "throttle-debounce"; // 节流防抖
import { saveAs } from "file-saver"; // 文件保存
import ClipboardJS from "clipboard"; // 鼠标复制
import render from "@/components/render/render";
import FormDrawer from "./FormDrawer"; // 表单绘制
import JsonDrawer from "./JsonDrawer"; // json绘制
import RightPanel from "./RightPanel"; // 右侧组件面板
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  tableComponents,
  formConf
} from "@/components/generator/config"; // 配置表
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase
} from "@/utils/index"; // 工具函数
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from "@/components/generator/html";
import { makeUpJs } from "@/components/generator/js";
import { makeUpCss } from "@/components/generator/css";
import logo from "@/assets/logo.jpg";
import CodeTypeDialog from "./CodeTypeDialog"; // 复制类型对话框
import DraggableItem from "./components/DraggableItem"; // 可拖拽项目
import {
  getDrawingList,
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf
} from "@/utils/db"; // 本地存储工具函数
import loadBeautifier from "@/utils/loadBeautifier";
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
    DraggableItem
  },
  data() {
    return {
      logo,
      idGlobal: null,
      formConfInDB: null,
      formConf, // config表里面的formConf（表单属性）
      inputComponents, // config表里面的inputComponents（输入项型组件）
      selectComponents, // config表里面的selectComponents（选择型组件）
      layoutComponents, // config表里面的layoutComponents（布局组件）
      tableComponents, // config表里面的layoutComponents（表格组件）
      labelWidth: 100,
      drawingList: [], // 中间面板的数据列表
      drawingData: {},
      activeId: null,
      drawerVisible: false,
      formData: {}, // 中间面板的所有组件数据和整体的表单数据，结合后生成一份config，然后由各自的generate函数渲染
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: { __config__: {} },
      saveDrawingListDebounce: debounce(200, saveDrawingList),
      saveIdGlobalDebounce: debounce(200, saveIdGlobal),
      saveGetFormConfDebounce: debounce(200, getFormConf),
      addHistory: debounce(200, that => {
        // 非主动操作历史记录
        if (!that.activeStatus) {
          if (that.historyListIndex < that.historyList.length - 1) {
            // 索引是0时,保留最后一个历史记录，其他时候按需截取
            if (that.historyListIndex === 0) {
              that.historyList.splice(1);
            } else {
              that.historyList.splice(0, that.historyListIndex);
            }
          }
          // 只保留最大历史列表
          if (that.historyList.length > HISTORY_MAX_NUM - 1) {
            this.oldHistoryList = JSON.parse(
              JSON.stringify(that.historyList.shift())
            );
          }
          that.historyList.push({
            drawingList: JSON.parse(JSON.stringify(that.drawingList)),
            formConf: JSON.parse(JSON.stringify(that.formConf))
          });
          // 历史索引定位到历史列表的最后一项
          that.historyListIndex = that.historyList.length - 1;
        }
        that.activeStatus = false;
      }),
      historyList: [], // 历史记录列表
      oldHistoryList: {},
      historyListIndex: -1, // 历史记录索引
      activeStatus: true, // 是否主动操作历史记录，例如后退，前进，清除
      historyMaxNum: HISTORY_MAX_NUM, // 历史记录保存最大值
      leftComponents: [
        {
          title: "输入型组件",
          list: inputComponents
        },
        {
          title: "选择型组件",
          list: selectComponents
        },
        {
          title: "布局型组件",
          list: layoutComponents
        },
        {
          title: "选择型组件",
          list: tableComponents
        }
      ]
    };
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    "activeData.__config__.label": function(val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder =
        this.activeData.placeholder.replace(oldVal, "") + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        const that = this;
        // that.saveDrawingListDebounce(val)
        if (val.length === 0) that.idGlobal = 100;
        that.addHistory(that);
      },
      deep: true
    },
    formConf: {
      handler(val) {
        const that = this;
        // that.saveGetFormConfDebounce(val)
        that.addHistory(that);
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
      handler(val) {
        console.log(val, "++++++++");
      },
      deep: true
    }
  },
  mounted() {
    const html = parse("", "");
    const drawingListInDB = getDrawingList(); // 获取中间编辑列表数据
    this.formConfInDB = getFormConf(); // 获取表单配置
    this.idGlobal = getIdGlobal(); // 获取全局组件id
    if (this.formConfInDB) {
      this.formConf = this.formConfInDB;
    }
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB;
      this.oldHistoryList = {
        drawingList: JSON.parse(JSON.stringify(this.drawingList)),
        formConf: JSON.parse(JSON.stringify(this.formConf))
      };
      // this.historyList.push({
      //   drawingList: JSON.parse(JSON.stringify(this.drawingList)),
      //   formConf: JSON.parse(JSON.stringify(this.formConf))
      // })
    } else {
      this.oldHistoryList = {
        drawingList: [],
        formConf: JSON.parse(JSON.stringify(this.formConf))
      };
    }
    if (this.drawingList.length) {
      this.activeFormItem(this.drawingList[0]);
    }

    // 代码采用js beautifier插件格式化
    loadBeautifier(btf => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS("#copyNode", {
      text: trigger => {
        const codeStr = this.generateCode();
        this.$notify({
          title: "成功",
          message: "代码已复制到剪切板，可粘贴。",
          type: "success"
        });
        return codeStr;
      }
    });
    clipboard.on("error", e => {
      this.$message.error("代码复制失败");
    });
  },
  methods: {
    // 保存
    save() {
      this.saveDrawingListDebounce(this.drawingList);
      this.saveGetFormConfDebounce(this.formConf);
      this.historyList = [];
      this.oldHistoryList = {
        drawingList: JSON.parse(JSON.stringify(this.drawingList)),
        formConf: JSON.parse(JSON.stringify(this.formConf))
      };
      this.$message.success("保存成功");
    },
    // 返回模板列表页
    goToModelPage() {
      this.$router.push("/");
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
        );
        this.formConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].formConf)
        );
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
      if (this.historyListIndex === -1) {
        this.drawingList = JSON.parse(
          JSON.stringify(this.oldHistoryList.drawingList)
        );
        this.formConf = JSON.parse(
          JSON.stringify(this.oldHistoryList.formConf)
        );
        return;
      }
      if (this.historyListIndex < this.historyList.length) {
        this.drawingList = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].drawingList)
        );
        this.formConf = JSON.parse(
          JSON.stringify(this.historyList[this.historyListIndex].formConf)
        );
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
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
    },
    // 克隆组件
    cloneComponent(origin) {
      const clone = JSON.parse(JSON.stringify(origin));
      const config = clone.__config__;
      config.formId = ++this.idGlobal;
      config.span = this.formConf.span;
      config.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (config.layout === "colFormItem") {
        clone.__vModel__ = `field${this.idGlobal}`;
        clone.placeholder !== undefined && (clone.placeholder += config.label);
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
        config.gutter = this.formConf.gutter;
      }
      tempActiveData = clone;
      return tempActiveData;
    },
    // 表单数据集合器:收集中间编辑的配置数据
    AssembleFormData() {
      this.formData = {
        fields: JSON.parse(JSON.stringify(this.drawingList)),
        formConf: JSON.parse(JSON.stringify(this.formConf))
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
    },
    // 导出操作
    execDownload(data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, data.fileName);
      axios({
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        url: "http://localhost:3000/save",
        data: {
          codeStr,
          name: data.fileName
        }
      }).then(res => {
        console.log(res && res.data.msg);
      });
    },
    // 复制代码操作
    execCopy(data) {
      document.getElementById("copyNode").click();
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          this.idGlobal = 100;
          this.activeStatus = true;
          this.historyList = [];
          this.oldHistoryList = {
            drawingList: [],
            formConf: JSON.parse(JSON.stringify(this.formConf))
          };
          this.historyListIndex = -1;
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
      if (config.layout === "colFormItem") {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
      }
      // 如果组件里面还有子组件，递归调用
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem =>
          this.createIdAndKey(childItem)
        );
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
        }
      });
    },
    // 代码生成器
    generateCode() {
      // 新增ui类型选择
      const { type, uiType } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formData, type));
      let html = vueTemplate(makeUpHtml(this.formData, type));
      let css = cssStyle(makeUpCss(this.formData));
      if (uiType === "KM-UI") {
        const regExpHead = /<el-/gi;
        const regExpEnd = /<\/el-/gi;
        const regExpCss = /el-/gi;
        html = html.replace(regExpHead, "<km-");
        html = html.replace(regExpEnd, "</km-");
        css = css.replace(regExpCss, "km-");
      }
      // 返回的代码进行格式化
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson() {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download() {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = "download";
    },
    run() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "run";
    },
    copy() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "copy";
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
        typeof this.activeData.__config__.defaultValue ===
        typeof config.defaultValue
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
          if (Array.isArray(item.__config__.children))
            this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },
    refreshJson(data) {
      this.drawingList = JSON.parse(JSON.stringify(data.fields));
      delete data.fields;
      this.formConf = data;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.historyList.length) {
      this.$confirm("确认不保存离开当前页面吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
          console.log("取消离开");
        });
    } else {
      next();
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/home";
</style>

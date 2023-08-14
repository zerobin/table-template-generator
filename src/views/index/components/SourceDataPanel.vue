<template>
  <div>
    <el-dialog :visible.sync="computedIsShow" title="数据源高级配置" width="500px">
      <div class="model-dialog-body">
        <el-scrollbar class="scrollBar">
          <el-form ref="newFileFrom" :model="modulePage" label-width="120px" :rules="rules">
            <el-form-item label="数据模型类型" prop="type">
              <el-select v-model="modulePage.type" clearable placeholder="请选择数据模型类型" style="width:100%" @change="changeModuleType">
                <el-option
                  v-for="item in sourceTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!regPanelVisible" label="数据源" prop="sourceData">
              <el-select v-model="modulePage.sourceData" clearable placeholder="请选数据源" style="width:80%">
                <el-option
                  v-for="item in moduleItemList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button style="width:15%; margin-left:5%;" type="primary" icon="el-icon-plus" @click="showRegInfo" />
            </el-form-item>
            <div v-if="regPanelVisible">
              <el-form-item label="数据源类型" prop="sourceType">
                <el-radio-group v-model="modulePage.sourceType">
                  <el-radio :label="0">
                    api
                  </el-radio>
                  <el-radio :label="1">
                    数据库
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="模块注册名" prop="regModuleName">
                <el-input v-model="modulePage.regModuleName" clearable placeholder="请输入模块注册名称" require />
              </el-form-item>
              <div v-if="modulePage.sourceType === 0">
                <el-form-item label="api地址" prop="apiAddress">
                  <el-input v-model="modulePage.apiAddress" clearable placeholder="请输入api地址" require />
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="数据源用户名" prop="userName">
                  <el-input v-model="modulePage.userName" clearable placeholder="请输入数据库用户名" require />
                </el-form-item>
                <el-form-item label="数据库密码" prop="password">
                  <el-input v-model="modulePage.password" clearable placeholder="请输入数据库密码" show-password require />
                </el-form-item>
                <el-form-item label="数据库地址" prop="address">
                  <el-input v-model="modulePage.address" clearable placeholder="请输入数据库地址" require />
                </el-form-item>
                <el-form-item label="数据库表名" prop="tableName">
                  <el-input v-model="modulePage.tableName" clearable placeholder="请输入数据库表名" require />
                </el-form-item>
              </div>

              <el-form-item label="查询地址" prop="url">
                <el-input v-model="modulePage.url" clearable placeholder="请输入查询地址" require />
              </el-form-item>
            </div>
            <el-form-item>
              <div v-show="!regPanelVisible">
                <el-button type="primary" @click="onSubmit">
                  立即应用
                </el-button>
                <el-button @click="cancel">
                  取消
                </el-button>
              </div>
              <div v-show="regPanelVisible">
                <el-button type="primary" @click="regist">
                  立即注册
                </el-button>
                <el-button @click="unRegister">
                  取消
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchModules, regModule, fetchModuleitems } from '@/api/module'

export default {
  props: {
    // 显示隐藏
    isShow: {
      type: Boolean,
      default: false
    },
    // 模块数据
    moduleData: {
      type: Object,
      default: () => {}
    },
    // 模块子元素列表
    sourceDataList: {
      type: Array,
      default: () => []
    },
    // 模块类型列表
    sourceTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      modulePage: {
        name: null,
        type: null,
        sourceData: null,
        sourceType: 0,
        apiAddress: null,
        userName: null,
        password: null,
        address: null,
        tableName: null,
        url: null
      },
      initModelPageNameStatus: false, // 是否手动初始化数据
      rules: {
        type: { required: true, message: '请选择数据模型类型', trigger: 'change' },
        sourceData: { required: true, message: '请选择数据源模块', trigger: 'change' },
        regModuleName: { required: true, message: '请输入文件名称', trigger: 'blur' },
        sourceType: { required: true, message: '请选择数据源类型', trigger: 'change' },
        apiAddress: { required: true, message: '请输入api地址', trigger: 'change' },
        userName: { required: true, message: '请输入数据库用户名', trigger: 'blur' },
        password: { required: true, message: '请输入数据库密码', trigger: 'blur' },
        address: { required: true, message: '请输入数据库地址', trigger: 'blur' },
        tableName: { required: true, message: '请输入数据库表名', trigger: 'blur' },
        url: { required: true, message: '请输入查询地址', trigger: 'blur' }
      },
      listLoading: false,
      list: [], // 列表数据
      pageModelList: [],
      moduleItemList: [],
      regPanelVisible: false, // 隐藏/显示注册信息面板
      resetData: {} // 重置数据
    }
  },
  computed: {
    computedIsShow: {
      get() {
        return this.isShow
      },
      set(val) {
        this.$emit('update:isShow', val)
      }
    }
  },
  watch: {
    moduleData: {
      handler(val) {
        this.modulePage.type = val.sourceType
        this.modulePage.sourceData = val.sourceData
        this.moduleItemList = this.sourceDataList
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 立即注册
    regist() {
      this.$refs.newFileFrom.validate(valid => {
        if (!valid) return
        const data = {
          moduleId: this.modulePage.type,
          name: this.modulePage.regModuleName,
          type: this.modulePage.sourceType, // [0:api ,1:数据源]
          queryUrl: this.modulePage.url
        }
        if (this.modulePage.sourceType === 0) {
          data.url = this.modulePage.apiAddress
        } else {
          data.dsInfo = {
            username: this.modulePage.userName,
            password: this.modulePage.password,
            url: this.modulePage.address,
            tableName: this.modulePage.tableName
          }
        }
        this.defRegModule(data).then(res => {
          this.modulePage.type = res.moduleId
          this.modulePage.sourceData = res.id
          // 注册成功,刷新数据源
          this.getSourceDataList(res.moduleId).then(() => {
            this.regPanelVisible = false
          })
        })
      })
    },
    // 取消注册
    unRegister() {
      this.modulePage = JSON.parse(JSON.stringify(this.resetData))
      this.regPanelVisible = false
    },
    // 显示注册信息
    showRegInfo() {
      this.resetData = JSON.parse(JSON.stringify(this.modulePage))
      this.regPanelVisible = true
    },
    fileNameInput(val) {
      this.initModelPageNameStatus = true
    },
    // 模块类型切换
    changeModuleType(val) {
      // 获取数据源
      this.getSourceDataList(val).then(() => {
        this.modulePage.sourceData = null
      })
    },
    async getSourceDataList(val) {
      try {
        this.moduleItemList = await fetchModuleitems(val)
        Promise.resolve(this.moduleItemList)
      } catch (err) {
        console.log(err)
      }
    },
    // 立即应用
    async onSubmit() {
      try {
        this.$refs.newFileFrom.validate(valid => {
          if (!valid) return
          const tempObj = {
            sourceType: this.modulePage.type,
            sourceData: this.modulePage.sourceData
          }
          this.$emit('setModuleData', tempObj)
          this.$emit('update:isShow', false)
        })
      } catch (err) {
        console.log(err)
      }
    },
    async defRegModule(data) {
      const regModuleData = await regModule(data)
      return Promise.resolve(regModuleData)
    },
    // 取消
    cancel() {
      this.$emit('update:isShow', false)
    },
    // 获取列表数据
    getList() {
    }
  }
}
</script>
<style lang='scss' scoped>
.scrollBar {
  max-height: 600px;
}
</style>

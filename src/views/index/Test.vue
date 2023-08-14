<template>
  <div>
    <el-col :span="24">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="分组" prop="groupby">
            <el-select
              v-model="formData.groupby" placeholder="请选择分组" allow-create default-first-option
              clearable :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in groupbyOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统计值" prop="statfunction">
            <el-select v-model="formData.statfunction" placeholder="请选择统计值" clearable :style="{width: '100%'}">
              <el-option
                v-for="(item, index) in statfunctionOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0" prop="statfield">
            <el-select
              v-model="formData.statfield" placeholder="请选择下拉选择" allow-create default-first-option
              clearable :style="{width: '100%'}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="orderbyDescAsc">
            <el-select
              v-model="formData.orderbyDescAsc" placeholder="请选择排序" clearable :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in orderbyDescAscOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0" prop="orderby">
            <el-select
              v-model="formData.orderby" placeholder="请选择下拉选择" allow-create default-first-option
              clearable :style="{width: '100%'}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="limit" prop="limit">
            <el-input v-model="formData.limit" placeholder="请输入limit" clearable :style="{width: '100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">
              提交
            </el-button>
            <el-button @click="resetForm">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <el-col :span="24">
      <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
        <span
          style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;"
        >统计结果</span>
        <div style="flex:1; overflow: hidden;">
          <el-table :data="statResult" stripe type="primary" size="medium">
            <el-table-column prop="date" label="日期" />
          </el-table>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
import {
  fetchModules, regModule, fetchModuleitems, fetchModulestructure
} from '@/api/module'

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        groupby: undefined,
        statfunction: undefined,
        statfield: undefined,
        orderby: undefined,
        limit: undefined,
        orderbylabel: undefined
      },
      statResult: [
        {
          date: '2016-05-02',
          id: '王小虎',
          name: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      rules: {
        groupby: [{
          required: false,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        statfunction: [{
          required: false,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        statfield: [{
          required: false,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        orderby: [{
          required: false,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        limit: [{
          required: false,
          message: '请选择下拉选择',
          trigger: 'change'
        }]
      },
      groupbyOptions: [],
      statfunctionOptions: [
        {
          label: '最大',
          value: 'max'
        },
        {
          label: '最小',
          value: 'min'
        },
        {
          label: '平均',
          value: 'avg'
        },
        {
          label: '计数',
          value: 'count'
        },
        {
          label: '计数distinct',
          value: 'count_distinct'
        }
      ],
      orderbyDescAscOptions: [
        {
          label: '降序',
          value: 'desc'
        },
        {
          label: '升序',
          value: 'asc'
        }
      ],
      statfieldOptions: [],
      baseFieldOptions: [],
      orderbyOptions: [],
      limitOptions: [],
      statResultOptions: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    handlestatfunctionOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.statfieldOptions = fieldOptions.map(item => {
        item.label = `${item.label} ${this.formData.statfunction}`
        item.value = `${item.value} ${this.formData.statfunction}`
        return item
      })
    },
    handleOrderByFieldOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.orderbyOptions = fieldOptions.map(item => {
        item.label = `${item.label} ${this.formData.orderbyDescAsc}`
        item.value = `${item.value} ${this.formData.orderbyDescAsc}`
        return item
      })
    },
    // changeOrderbyDescAsc() {
    //   const orderbyLabel = []
    //   if (this.formData.orderbyDescAsc.value === 'desc') {
    //     this.orderbyOptions.current
    //     orderbyLabel.join()
    //     this.formData.orderbylabel = orderbyLabel
    //   } else {
    //     this.orderbyOptions && this.orderbyOptions.length && this.orderbyOptions.forEach(item => {
    //       // if (item.)
    //       item.label = `${item.label} asc`
    //       orderbyLabel.concat()
    //     })
    //   }
    // },
    submitForm() {

    },
    resetForm() {
      this.$refs.elForm.resetFields()
    },
    submit() {
      const data = {
        table: this.formData.statResult,
        statfield: this.formData.statfield,
        groupby: this.formData.groupby,
        orderby: this.formData.orderby,
        limit: this.formData.limit
      }
      console.log(JSON.stringify(data))
    },

    async submitAndShowData() {
      // const tempArr = await selfDefineReport() || []
      // tempArr.forEach(item => {
      //   item.label = item.columnLabel
      //   item.value = item.columnName
      // })
      // this.groupbyOptions = tempArr
      // this.baseFieldOptions = tempArr
      // this.orderbyOptions = tempArr.map(item => {
      //   item.label = `${item.label} ${this.formData.orderbyDescAsc}`
      //   item.value = `${item.value} ${this.formData.orderbyDescAsc}`
      //   return item
      // })
    },

    async getData() {
      // try {
      //   const tempArr = await selfDefineReport() || []
      //   tempArr.forEach(item => {
      //     item.label = item.columnLabel
      //     item.value = item.columnName
      //   })
      //   this.groupbyOptions = tempArr
      //   this.baseFieldOptions = tempArr
      // } catch (err) {
      //   console.log(err)
      // }
    }
  }
}

</script>
<style>
</style>

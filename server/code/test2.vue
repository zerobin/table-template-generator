<template>
  <div>
    <el-row :gutter="undefined">
      <div>
        <el-col :span="12">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;">多行文本</span>
            <div style="flex:1; overflow: hidden;">
              <el-input v-model="field102" type="textarea" placeholder="请输入多行文本"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;">单行文本</span>
            <div style="flex:1; overflow: hidden;">
              <el-input v-model="field101" placeholder="请输入单行文本" clearable :style="{width: '100%'}">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:none;">表格</span>
            <div style="flex:1; overflow: hidden;">
              <el-table :data="field103" stripe type="primary" size="medium">
                <el-table-column prop="date" label="日期"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
/* eslint-disable */
import {
  selfDefineReport,
  fetchModules,
  regModule,
  fetchModuleitems,
  fetchModulestructure,
  submitAndShowData
}
from '@/api/module'
export default {
  components: {},
  props: [],
  data() {
    return {
      "field102": null,
      "field101": null,
      rules: {
        "field102": [{
          required: true,
          message: '请输入多行文本',
          trigger: 'blur'
        }],
        "field101": [{
          required: true,
          message: '请输入单行文本',
          trigger: 'blur'
        }],
      },
      "field103": [{
        "date": "2016-05-02"
      }],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  mixins: [],
  methods: {
    handlestatfunctionOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.statfieldOptions = fieldOptions.map(item => {
        item.label = `${item.label} ${this.formData.statfunction }`
        item.value = `${item.value} ${this.formData.statfunction }`
        return item
      })
    },
    handleOrderByFieldOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.orderbyOptions = fieldOptions.map(item => {
        item.label = `${item.label} ${this.formData.orderbyDescAsc }`
        item.value = `${item.value} ${this.formData.orderbyDescAsc }`
        return item
      })
    },
    handleWhereOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.whereOptions = fieldOptions.map(item => {
        item.label = `${item.label} ${this.formData.whereOper} ${this.formData.whereValue }`
        item.value = `${item.value} ${this.formData.whereOper} ${this.formData.whereValue }`
        return item
      })
    },
    submitForm() {
      this.statResult = [{
        'test.id': '',
        'test.name': ''
      }]
      const data = {
        table: this.statResult,
        statfield: this.formData.statfield,
        groupby: this.formData.groupby,
        orderby: this.formData.orderby,
        limit: this.formData.limit,
        where: this.formData.where
      }
      console.log(JSON.stringify(data))
      this.submitAndShowData(data)
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    async submitAndShowData(data) {
      const tempArr = await submitAndShowData(data) || []
      const obj = []
      tempArr.forEach(item => {
        obj.push(JSON.parse(item))
      })
      this.statResult = obj
      console.log(this.statResult)
    },
    async getData() {
      const data = 3
      const tempArr = await selfDefineReport(data) || []
      tempArr.forEach(item => {
        item.label = item.columnLabel
        item.value = item.columnName
      })
      this.groupbyOptions = tempArr
      this.statfieldOptions = tempArr
      this.baseFieldOptions = tempArr
      this.orderbyOptions = tempArr
      this.whereOptions = tempArr
    }
  }
}

</script>
<style>
</style>

<template>
  <div>
    <el-row :gutter="undefined">
      <div>
        <el-col :span="12">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;"
            >单行文本</span>
            <div style="flex:1;">
              <el-input v-model="field101" placeholder="请输入单行文本" clearable :style="{width: '100%'}" />
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;"
            >表格</span>
            <div style="flex:1;">
              <el-table :data="field102" stripe type="primary" size="medium">
                <el-table-column prop="date" label="日期" />
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="15">
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
              <el-col :span="12">
                <el-form-item label="下拉选择" prop="field104">
                  <el-select v-model="formData.field104" placeholder="请选择下拉选择" clearable
                             :style="{width: '100%'}"
                  >
                    <el-option v-for="(item, index) in field104Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="级联选择" prop="field105">
                  <el-cascader v-model="formData.field105" :options="field105Options" :props="field105Props"
                               :style="{width: '100%'}" placeholder="请选择级联选择" clearable
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-col>
        <el-col :span="24">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;"
            >下拉选择</span>
            <div style="flex:1;">
              <el-select v-model="field106" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in field106Options" :key="index" :label="item.label"
                           :value="item.value" :disabled="item.disabled"
                />
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
            <span
              style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;"
            >单行文本</span>
            <div style="flex:1;">
              <el-input v-model="field107" placeholder="请输入单行文本" clearable :style="{width: '100%'}" />
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      field101: null,
      formData: {
        field104: 'undefined',
        field105: ''
      },
      field106: null,
      field107: null,
      rules: {
        field104: [{
          required: true,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        field105: [{
          required: true,
          type: 'array',
          message: '请至少选择一个级联选择',
          trigger: 'change'
        }]
      },
      field102: [{
        date: '2016-05-02'
      }],
      field104Options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      field105Options: [],
      field106Options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      field105Props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {

    },
    resetForm() {
      this.$refs.elForm.resetFields()
    },
    getField105Options() {
      // TODO 发起请求获取数据
      this.field105Options
    }
  }
}

</script>
<style>
</style>

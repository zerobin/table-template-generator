<template>
  <div>
    <div>
      <el-col :span="24">
        <el-row>
          <el-col :span="24">
            <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
              <span
                style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;">下拉选择</span>
              <div style="flex:1; overflow: hidden;">
                <el-select v-model="field102" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
              <span
                style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;">级联选择</span>
              <div style="flex:1; overflow: hidden;">
                <el-cascader v-model="field103" :options="field103Options" :props="field103Props"
                  :style="{width: '100%'}" placeholder="请选择级联选择" clearable></el-cascader>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div style="display:flex; justify-content: center;align-items: center; margin-bottom: 15px;">
              <span
                style="color:#606266; font-size:14px; text-align:right; padding:0 12px 0 0; width:88px; display:inline-block;">多选框组</span>
              <div style="flex:1; overflow: hidden;">
                <el-checkbox-group v-model="field104" size="medium">
                  <el-checkbox v-for="(item, index) in field104Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  components: {},
  props: [],
  data() {
    return {
      "field102": null,
      "field103": [],
      "field104": [],
      field102Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field103Options: [],
      field104Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field103Props: {
        "multiple": false,
        "label": "label",
        "value": "value",
        "children": "children"
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  mixins: [],
  methods: {
    getField103Options() {
      // TODO 发起请求获取数据
      this.field103Options
    },
  }
}

</script>
<style>
</style>

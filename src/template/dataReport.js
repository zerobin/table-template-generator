/* eslint-disable */
export default {
  created: `this.getData()`,
  methods: `handlestatfunctionOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.statfieldOptions = fieldOptions.map(item => {
        item.label = \`\${item.label} \${this.formData.statfunction }\`
        item.value = \`\${item.value} \${this.formData.statfunction }\`
        return item
      })
    },
    handleOrderByFieldOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.orderbyOptions = fieldOptions.map(item => {
        item.label = \`\${item.label} \${this.formData.orderbyDescAsc }\`
        item.value = \`\${item.value} \${this.formData.orderbyDescAsc }\`
        return item
      })
    },
    handleWhereOption() {
      const fieldOptions = JSON.parse(JSON.stringify(this.baseFieldOptions))
      this.whereOptions = fieldOptions.map(item => {
        item.label = \`\${item.label} \${this.formData.whereOper} \${this.formData.whereValue }\`
        item.value = \`\${item.value} \${this.formData.whereOper} \${this.formData.whereValue }\`
        return item
      })
    },
    submitForm() {
      this.statResult = [{ 'test.id': '', 'test.name': '' }]
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
    }`
}

<template>
  <el-form
    :size="formConf.size"
    :label-position="formConf.labelPosition"
    :disabled="formConf.disabled"
    :label-width="formConf.labelWidth + 'px'"
  >
    <slot />
  </el-form>
</template>

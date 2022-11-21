<template>
  <component :is="formulaType"></component>
</template>

<script>
export default {
  name: 'FormulaItem',
  data() {
    return {
      formulaType: 'el-input'
    }
  }
}
</script>

<style scoped>

</style>
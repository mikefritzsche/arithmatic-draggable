<template>
  <div class="flex flex-column items-start" >
    <h3>formula nested block:</h3>
    <div><h3>Constants:</h3> {{ constants }}</div>
    <div><h3>Operator:</h3> {{ operator }}</div>
    <div><h3>Nested:</h3> {{ block }}</div>

    <template v-if="formula.children">
      <formula-nested-block
        :formula="formula.children"
        :level="level"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: "FormulaNestedBlock"
}
</script>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  formula: {
    type: Array,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  }
})
function childLevel(level) {
  return level++
}
const indent = props.level * 10
const constants = props.formula.filter((item) => item.valueType === 'constant')
const operator = props.formula.find((item) => !item.block && item.valueType === 'operator')
const block = props.formula.find((item) => item.block )

</script>
<style scoped>

</style>
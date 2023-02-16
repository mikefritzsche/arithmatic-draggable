<template>
  <div
    class="pa3 tl b--solid br3 pa3 mb3 mr3"
    style="border-width: 0px; border-color: var(--gray-4)"
    :class="level === 0 || level > 1 ? 'w-100' : 'w-50'"
  >
    <slot name="header" :formula-string="formulaString"></slot>

    <formula-nested-block
      :constants="constants"
      :blocks="blocks"
    >
      <template #constant="{ element, index }">
        <el-input
          :data-index="index"
          class="flex br2 mh3"
          style="width: 12ch"
          input-style=""
          v-model="element.item.value"
        />
      </template>
      <template #operator>
        <div class="pv0">
          <el-select
            v-model="operator.value"
          >
            <el-option
              class="w-100"
              v-for="operator in operators"
              :key="operator.value"
              :label="operator.label"
              :value="operator.value"
            />
          </el-select>
        </div>
      </template>
      <template #block="{ element, index }">
        <template v-if="element.item.block">
          <formula-block-builder
            :formula="element.item.children"
            :object-attributes="objectAttributes"
            :formula-example="formulaExample"
            :level="level + 1"
          />
        </template>
        <div v-else>
          <h4>Block: {{ index }}</h4>
          <pre>{{ element }}</pre>
        </div>
      </template>
    </formula-nested-block>


    <!--
    should be 3 array items
    block/constant/field
    operator
    block/constant/field

    shape of the data will follow the DnD array of objects
      operator will be the 1 index of the array
      block/constant/field will be 0/2 indexes of the array

    0 - block
    1 - operator
    2 - constant
    -->

  </div>
</template>

<script lang="ts">
export default {
  name: 'FormulaBlockBuilder'
}
</script>
<script setup lang="ts">
import {computed, ref, defineProps, PropType} from 'vue'
import FormulaNestedBlock from '@/components/formula-block-builder/components/formula-nested-block/index.vue'
import { getFormulaStringNested } from '@/helpers/formula-validation/index'

import {operators} from '@/constants';
import {ArithmeticFormulaElement} from "@/types";

const localOperator = ref('')
const props = defineProps({
  formula: {
    type: Array as PropType<ArithmeticFormulaElement[]>,
    default: () => []
  },
  formulaExample: {
    type: String as PropType<string>,
    default: ''
  },
  level: {
    type: Number as PropType<number>,
    default: 0
  },
  objectAttributes: {
    type: Array,
    default: () => []
  }
})
const formulaString = getFormulaStringNested(props.formula, 'Numbers')
console.log('formulaString: ', formulaString)
// const example = getFormulaExample(formulaString)
// console.log('example: ', example)
const constants = computed(() => props.formula.reduce((acc, item, index) => {
  if (item.valueType === 'constant') {
    acc.push({
      index,
      item
    })
  }
  return acc
}, []))
const blocks = computed(() => props.formula.reduce((acc, item, index) => {
  if (item.block) {
    acc.push({
      index,
      item
    })
  }
  return acc
}, []))
const operator = computed(() => props.formula.find((item) => !item.block && item.valueType === 'operator'))

console.log('formula: ', props.formula)
console.log('operator: ', operator.value)
console.log('constants: ', constants.value)
console.log('blocks: ', blocks.value)
</script>

<style scoped>
:deep(.el-input__wrapper) {
  flex: 1;
}
:deep(.el-input__inner) {
  border: 0px solid #ccc;
}
</style>
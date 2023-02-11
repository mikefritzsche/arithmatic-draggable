<template>
  <div class="pa3 tl">
    formula block builder
    <h2>{{ formulaExample }}</h2>
    <div><h3>Operator:</h3> {{ operator }}</div>
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
formula.forEach((item, index) => {
  console.log('formula item: ', [item, index])
})
[
  {
    "id": "8dc40621-104c-4574-a59d-54a38b523551",
    "block": "open",
    "children": [
      {
        "id": "bc4a00f3-5eaa-42a9-b907-8260159107de",
        "backgroundColor": "orange",
        "block": "open",
        "children": [
          {
            "id": "a8eb283b-0732-4fe2-8951-94ec05f05b8a",
            "value": "1",
            "valueType": "constant"
          },
          {
            "id": "e078187f-e120-4bdd-ab3b-581e512de03c",
            "label": "+",
            "value": "add",
            "valueType": "operator"
          },
          {
            "id": "131929c2-bd44-4b32-8b6c-3d5f9910c2bd",
            "value": "2",
            "valueType": "constant"
          }
        ],
        "valueType": "operator",
        "value": "block_open"
      },
      {
        "id": "c0ff1824-07e5-49ae-814e-7abc57148681",
        "label": "-",
        "value": "subtract",
        "valueType": "operator"
      },
      {
        "id": "3c422261-ee32-492b-8657-5f9c256c8da6",
        "value": "1",
        "valueType": "constant"
      }
    ],
    "valueType": "operator",
    "value": "block_open"
  },
  {
    "id": "bab6c8a9-0784-4337-a8ba-4ac7089a71fd",
    "label": "x",
    "value": "multiply",
    "valueType": "operator"
  },
  {
    "id": "99f01686-9b50-4372-91b3-0fa1ed4733b9",
    "value": "3",
    "valueType": "constant"
  }
]
-->
    <template v-if="!block">
      <div>
        <h3>No Block Constants:</h3>
        <div v-for="(constant, index) in constants" :key="index">
          Position {{ index }} - {{ constant }}
        </div>
      </div>
    </template>

    <template v-else>
      <h2>Block:</h2>
      <h3>Root - blockIndex:</h3>{{ blockIndex }}
      <h4>Root - Block Children:</h4>
      <pre>{{ block.children }}</pre>

      <template v-if="blockIndex === 0">
        <div>
          <h4>Root Constant Position 1:</h4>
          <div>
            <pre>{{ constants[0] }}</pre>
          </div>
        </div>
      </template>

      <formula-nested-block
        :formula="block.children"
        :level="0"
      />

      <template v-if="blockIndex === 2">
        <div>
          <h3>Constant Position 1:</h3>
          <div>
            {{ constants[0] }}
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormulaBlockBuilder'
}
</script>
<script setup lang="ts">
import { computed, ref, defineProps, PropType } from 'vue'
import FormulaNestedBlock from '@/components/formula-block-builder/components/formula-nested-block/index.vue'

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
  objectAttributes: {
    type: Array,
    default: () => []
  }
})
const constants = props.formula.filter((item) => item.valueType === 'constant') ?? []
const operator = props.formula.find((item) => !item.block && item.valueType === 'operator') ?? {}
const block = props.formula.find((item) => item.block ) ?? ''
const blockIndex = computed(() => {
  return block ? props.formula.findIndex((item) => item.block ) : null
})
</script>

<style scoped>

</style>
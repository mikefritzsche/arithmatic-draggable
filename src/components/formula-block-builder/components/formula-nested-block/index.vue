<template>
  <div
    class="flex flex-column items-start b--solid br3 pa3"
    style="border-width: 1px; border-color: var(--gray-4)"
  >
    <h3>formula nested block:</h3>
    <div><h3>Operator:</h3> {{ operator }}</div>
    <div>
      <h4>Block:</h4>
      <pre>{{ block }}</pre>
    </div>

    <template v-if="!block">
      <div>
        <h3>No Block Constants:</h3>
        <div v-for="(constant, index) in constants" :key="index">
          {{ constant }}
        </div>
      </div>
    </template>

    <template v-else>
      <h2>Block:</h2>
      <h4>blockIndex: {{ blockIndex }}</h4>
      <h4>Block children:</h4>
      <pre>{{ block.children }}</pre>

      <template v-if="blockIndex === 0">
        <div>
          <h4>Nested Constant Position 0:</h4>
          <div>
            <pre>{{ constants[0] }}</pre>
          </div>
        </div>
      </template>

      <formula-nested-block
        :formula="block.children"
        :level="localLevel++"
      />

      <template v-if="blockIndex === 2">
        <div>
          <h3>Nested Constant Position 1:</h3>
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
  name: "FormulaNestedBlock"
}
</script>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'

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

const indent = props.level * 10
const constants = props.formula.filter((item) => item.valueType === 'constant')
const operator = props.formula.find((item) => !item.block && item.valueType === 'operator')
const block = props.formula.find((item) => item.block )
const blockIndex = computed(() => {
  return block ? props.formula.findIndex((item) => item.block ) : null
})
const localLevel = ref(props.level)

/*
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
*/
const formula = [
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
const blockBuilder = (formula: any) => {
  console.log('root block')
  formula.forEach((item: any, index: number) => {
    if (index === 0 || index === 2) {
      if (item.block) {
        formulaBlock(item.children)
      }
      else {
        index
        console.log(item)
      }
    }
    else {
      console.log('index 1: ', item)
      console.log(item)
    }
  })
}
const formulaBlock = (formula: any) => {
  formula.forEach((item: any, index: number) => {
    if (index === 0 || index === 2) {
      if (item.block) {
        console.log('formaulBlock: ', )
        formulaBlock(item.children)
      }
      else {
        console.log(item)
      }
    }
  })
}

blockBuilder(formula)
</script>
<style scoped>

</style>
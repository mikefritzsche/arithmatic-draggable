<template>
  <div class="pa3 tl">
    formula block builder
    <div class="mb3" style="border-bottom: 1px solid #ccc">
      Main Formula:
      <pre>{{ formula }}</pre>
    </div>
    <div><h3>Operator:</h3> {{ operator }}</div>

    <template v-if="blockIndex === 0">
      <div>
        <h3>Constants:</h3>
        <div v-for="(constant, index) in constants" :key="index">
          {{ constant }}
        </div>
      </div>
    </template>

    <template v-if="block">
<!--      <h2>Block</h2>-->
<!--      <div>{{ block }}</div>-->
      <formula-nested-block
        :formula="block.children"
        :level="0"
      />
    </template>
    <template v-if="blockIndex === 2">
      <div>
        <h3>Constants:</h3>
        <div v-for="(constant, index) in constants" :key="index">
          {{ constant }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormulaBlockBuilder'
}
</script>
<script setup lang="ts">
import {computed, ref, defineProps} from 'vue'
import FormulaNestedBlock from '@/components/formula-block-builder/components/formula-nested-block/index.vue'

import {operators} from '@/constants';

const localOperator = ref('')
const props = defineProps({
  formula: {
    type: Array,
    default: () => []
  },
  objectAttributes: {
    type: Array,
    default: () => []
  }
})
const constants = props.formula.filter((item) => item.valueType === 'constant')
const operator = props.formula.find((item) => !item.block && item.valueType === 'operator')
const block = props.formula.find((item) => item.block )
const blockIndex = computed(() => {
  return block ? props.formula.findIndex((item) => item.block ) : null
})
</script>

<style scoped>

</style>
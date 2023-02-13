<template>
  <div
    class="flex items-start b--solid br3 pa3 mr3"
    style="border-width: 1px; border-color: var(--gray-4)"
  >
    <!-- two blocks -->
    <template v-if="blocks.length && blocks.length === 2">
      <template v-for="block in blocks">
        <slot :name="`block`" :element="block" :index="block.index"></slot>
      </template>
    </template>

    <!-- two constants -->
    <template v-if="constants.length && constants.length === 2">
      <template v-for="constant in constants">
        <slot :name="`constant`" :element="constant" :index="constant.index"></slot>
      </template>
    </template>

    <!-- block -- constant -->
    <template v-if="blocks.length && blocks.length !== 2 && blocks[0].index === 0">
      <slot :name="`block`" :element="blocks[0]" :index="blocks[0].index"></slot>
    </template>
    <template v-if="constants.length && constants.length !== 2 && constants[0].index === 2">
      <slot :name="`constant`" :element="constants[0]" :index="constants[0].index"></slot>
    </template>

    <!-- constant -- block -->
    <template v-if="constants.length && constants.length !== 2 && constants[0].index === 0">
      <slot :name="`constant`" :element="constants[0]" :index="constants[0].index"></slot>
    </template>
    <template v-if="blocks.length && blocks.length !== 2 && blocks[0].index === 2">
      <slot :name="`block`" :element="blocks[0]" :index="blocks[0].index"></slot>
    </template>

    <slot name="field"></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "FormulaNestedBlock"
}
</script>

<script setup lang="ts">
import {computed, defineProps, ref} from 'vue'

const props = defineProps({
  blocks: {
    type: Array,
    default: () => []
  },
  constants: {
    type: Array,
    default: () => []
  },
})

// const indent = props.level * 10

</script>
<style scoped>

</style>
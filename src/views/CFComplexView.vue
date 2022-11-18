<template>
  <div class="home">
    <CfFormulaBuilderComplex/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CfFormulaBuilderComplex from '@/components/formula-builder-complex/index.vue'

export default defineComponent({
  name: 'CFComplexView',
  components: {
    CfFormulaBuilderComplex,
  },
});
</script>

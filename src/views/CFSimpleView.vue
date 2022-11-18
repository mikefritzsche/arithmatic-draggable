<template>
  <div class="home">
    <CfFormulaBuilderSimple/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CfFormulaBuilderSimple from '@/components/formula-builder-simple/index.vue'

export default defineComponent({
  name: 'CfSimpleView',
  components: {
    CfFormulaBuilderSimple,
  },
});
</script>

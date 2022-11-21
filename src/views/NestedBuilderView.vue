<template>
  <div class="nested-builder">
    <formula-builder-nested/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormulaBuilderNested from '@/components/formula-builder-nested/index.vue'

export default defineComponent({
  name: 'NestedBuilder',
  components: {
    FormulaBuilderNested
  }
});
</script>

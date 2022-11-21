<template>
  <div>
    {{ formulaItem }}
  <draggable
      v-if="false"
      class="w-20"
      group="block"
      v-model="formulaChild"
      @change="handleOperatorChange"
  >
    <template #item="{ element }">
      <div class="block mb3">
        <div>
          <el-button @click="$emit('create-block', element)">Create Block</el-button>
        </div>
        <template v-for="blockValue in element.values" :key="blockValue.id">
          <!--              <pre>{{ JSON.stringify(blockValue, null, 2) }}</pre>-->
          <el-input v-if="blockValue.valueType === 'constant'" v-model="blockValue.value"/>
          <el-select v-if="blockValue.valueType === 'operator'" v-model="blockValue.value" class="w-100">
            <el-option
                v-for="item in operators"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <!--              <draggable-->
          <!--                  v-if="blockValue.valueType === 'formula-item'"-->
          <!--                  v-model="blockValue.value"-->
          <!--                  :group="{ name: 'formula-item', put: true }"-->
          <!--              >-->
          <!--                <template #item="{ element }">-->
          <!--                  <div style="min-height: 54px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;">-->
          <!--                    <div>{{ element.label }}</div>-->
          <!--                  </div>-->
          <!--                </template>-->
          <!--              </draggable>-->
        </template>
      </div>
    </template>
  </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  name: 'FormulaBlock',
  components: {
    Draggable
  },
  emits: [
    'create-block'
  ],
  props: {
    formulaItem: {
      type: Array,
      required: true
    },
    handleOperatorChange: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      formulaChild: {}
    }
  },
  created() {
    this.formulaChild = this.formulaItem
  }
}
</script>

<style scoped>

</style>
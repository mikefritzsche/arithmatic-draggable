<template>
  <div class="flex">
    <div class="left-panel">
      <div>{{ formulaPreview }}</div>
      <draggable
          :group="{ name: 'operator', put: false }"
          class="flex operators"
          v-model="operators"
          :clone="handleOperatorsClone"
      >
        <template #item="{ element }">
          <div>{{ element.label }}</div>
        </template>
      </draggable>
      <div>Fields</div>
      <div>
        <el-button @click="createBlock">Create Block</el-button>
      </div>
    </div>
    <div class="right-panel">
      <draggable
          class="w-20"
          group="block"
          v-model="formula"
          @change="handleOperatorChange"
      >
        <template #item="{ element }">
          <div class="block mb3">
            <div>
              <el-button @click="createBlock(element)">Create Block</el-button>
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
<!--                  v-if="blockValue.valueType === 'operator'"-->
<!--                  v-model="blockValue.value"-->
<!--                  :group="{ name: 'operator', put: true }"-->
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
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import draggable from 'vuedraggable'
// import NestedDraggable from '@components/nested-draggable/index.vue'
import {v4 as uuidv4} from 'uuid'

export default defineComponent({
  name: "FormulaBuilderSimple",
  components: {
    draggable,
    // NestedDraggable,
  },
  data() {
    return {
      currentGroupId: 0,
      drag: false,
      formula: [{
        id: uuidv4(),
        operation: '',
        values: [
          {
            id: uuidv4(),
            position: 0,
            valueType: "constant",
            value: 1
          },
          {
            id: uuidv4(),
            position: 0,
            valueType: "operator",
            value: {value: 'add', label: '+'}
          },
          {
            id: uuidv4(),
            position: 0,
            valueType: "constant",
            value: 1
          },
        ]
      }],
      formula1: [
        {
          id: '12345',
          valueType: 'object_attribute',
          value: '12345',
          group: 0
        },
        {
          valueType: 'operator',
          value: 'add'
        },
        {
          id: 1,
          valueType: 'constant',
          value: 3
        },
        {
          valueType: 'operator',
          value: 'multiply'
        },
        // index 4
        {
          id: 'group_1',
          group: '1',
          valueType: 'operator',
          value: 'block_open'
        },
        {
          id: '2',
          valueType: 'constant',
          value: 12,
          group: '1'
        },
        {
          valueType: 'operator',
          value: 'divide'
        },
        {
          id: '3',
          valueType: 'constant',
          value: 3
        },
        // index
        {
          id: 'group_1_1',
          valueType: 'operator',
          value: 'block_close',
          group: 'group_1'
        },
        {
          valueType: 'operator',
          value: 'subtract'
        },
        {
          id: 4,
          valueType: 'constant',
          value: 35
        },
        {
          valueType: 'operator',
          value: 'block_open'
        },
        {
          id: 2,
          valueType: 'constant',
          value: 12
        },
        {
          valueType: 'operator',
          value: 'divide'
        },
        {
          id: 3,
          valueType: 'constant',
          value: 3
        },
        // index
        {
          valueType: 'operator',
          value: 'block_close'
        },
      ],
      isValidFormula: {
        isValid: true,
        invalidReasons: []
      },
      objectAttributes: [
        {
          id: '3456',
          label: 'Opportunity Amount',
          data_type: 'currency'
        },
        {
          id: '3456',
          label: 'Bonus Amount',
          data_type: 'currency'
        },
        {
          id: '3456',
          label: 'Count Of CMS',
          data_type: 'int'
        },
        {
          id: '12345',
          label: 'Why Not?',
          data_type: 'currency'
        },
        {
          id: '1',
          label: 'Fancy Field',
          data_type: 'currency'
        },
        {
          id: '2',
          label: 'Look at me',
          data_type: 'currency'
        },
        {
          id: '3',
          label: 'Extemporaneous',
          data_type: 'currency'
        },
        {
          id: '4',
          label: 'Kerfuffleling',
          data_type: 'currency'
        },
        {
          id: '5',
          label: 'Last, but not least',
          data_type: 'currency'
        },
      ],
      operators: [
        {
          valueType: 'operator',
          value: 'add',
          label: '+'
        },
        {
          valueType: 'operator',
          value: 'subtract',
          label: '-'
        },
        {
          valueType: 'operator',
          value: 'multiply',
          label: '*'
        },
        {
          valueType: 'operator',
          value: 'divide',
          label: '/'
        },
        {
          valueType: 'operator',
          value: 'block_open',
          label: '('
        },
        {
          valueType: 'operator',
          value: 'block_close',
          label: ')'
        },
        {
          valueType: 'operator',
          value: 'block',
          label: '( )'
        },
        {
          valueType: 'operator',
          value: 'constant',
          label: '#'
        }
      ],
      trashItems: []
    }
  },
  computed: {
    formulaPreview() {
      return ''
    }
  },
  methods: {
    createBlock(element = null) {
      console.log('createBlock element: ', element)
      this.formula.push({
        id: uuidv4(),
        operation: '',
        values: [
          {
            id: uuidv4(),
            position: 0,
            valueType: "constant",
            value: 1
          },
          {
            id: uuidv4(),
            position: 0,
            valueType: "operator",
            value: {value: 'add', label: '+'}
          },
          {
            id: uuidv4(),
            position: 0,
            valueType: "constant",
            value: 1
          },
        ]
      })
    },
    handleOperatorsClone(evt) {
      console.log('handleOperatorsClone: ', evt)
    },
    handleOperatorChange(evt) {
      console.log('handleOperatorChange: ', evt)
    }
  }
})
</script>

<style scoped lang="scss">
.left-panel {
  flex: 1;
  .operators {
    align-items: center;
    justify-content: center;
    gap: 10px;
    > div {
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 32px;
      height: 32px;
    }
  }
}
.right-panel {
  flex: 12;
}
</style>
<template>
  <div class="flex mv3 mr4">
    <div>
      <!-- <draggable 
        class="drag-area list-group w-full" 
        :list="formula"
        @change="log"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
          v-for="(element, i) in list"
          :key="i"
        >
          {{ element }}
        </div>
      </draggable> -->
      <!-- <nested-draggable :tasks="formula"/> -->
    </div>
    <div class="left-panel">
      <!-- trash -->
      <div class="trash-drag-container">
        <draggable
          class="trash-drag-area" 
          v-model="trashItems"
          :group="{ name: 'trash', put: () => true }"
          @change="handleTrashChange"
        >
          <template #item="{element}"><span style="display: none">{{element}}</span></template>
        </draggable>
      </div>

      <!-- operators -->
      <draggable
        class="operators-container"
        v-model="operators"
        :group="{ name: 'formulaItems', pull: 'clone', put: false }"
        :sort="false"
        @start="handleStart"
        @end="drag=false" 
        
        :clone="handleOperatorsClone"
      >
      <template #item="{element}">
        <span
          class="operator-item"
          style="border: 1px solid #ccc; border-radius: 3px; padding: 0 5px; margin-right: 7px"
          :data-element="JSON.stringify(element)"
          @click="(event) => handleOperatorClick(event, element)"
        >{{ element.label }}</span>
      </template>
      </draggable>

      <!-- fields -->
    <draggable
      class="fields-container"
      v-model="objectAttributes"
      :group="{ name: 'formulaItems', pull: 'clone', put: false }"
      item-key="id"
      :sort="false"
      :clone="handleFieldsClone"
      @add="handleOnAdd"
      handle=".handle"
    >
     <template #item="{element}">
      <div 
        class="flex"
        v-if="element.label"
        style="background-color: #F3F4F6;"
      >
       <div style="flex: 3">{{ element.label }}</div>
       <div 
        class="handle" 
        style="flex: 1; text-align: right;"
        @click="(event) => handleFieldClick(event, element)"
        >+</div>
      </div>
     </template> 
    </draggable>
    </div>
    <div class="right-panel">
      <!-- <draggable :group="{name: 'sameGroup', put: true, pull: false}" ghostClass="display-none" draggable=".draggable" class="my-8 mx-12" >
        <template #item> -->

        
        <draggable 
          class="formula-container"
          v-model="formula" 
          group="formulaItems" 
          item-key="id"
          handle=".handle"
          @end="handleOnEnd"
          @start="handleStart"
          @change="handleChange"
        >
        <template #item="{element}">
          <template v-if="element.valueType === 'constant'">
            <div class="handle">
              <el-input 
                height="32"
                v-model="element.value" 
                @input="handleConstantInput(element)"
              />
            </div>
          </template>
          <template v-else-if="element.valueType === 'object_attribute'">
            <div class="handle" style="margin-right: 5px; padding: 3px 5px; height: 32px; border: 1px solid #ccc; border-radius: 5px;">
              {{ objectAttributeLabelById(element.value) }}
            </div>
          </template>
          <template v-else>
            <div class="handle" style="background-color: white; margin-right: 5px; padding: 3px 5px; height: 32px; width: 32px; border: 1px solid #ccc; border-radius: 5px;">
              {{ renderElement(element) }}
            </div>
          </template>
        </template>
        </draggable>
      <!-- </template>
      </draggable> -->

    <div class="formula-example">
      <div>
        <label style="font-weight: bold;">Preview {{ isValidFormula }}</label>
      </div>
      <div class="mv2">
        <el-button type="primary">Numbers</el-button>
        <el-button>Field Names</el-button>
      </div>
      <div class="f6">
        Numeric preview will assign a number value per field
      </div>
      <div class="mv2">
        {{ formulaExample }}
      </div>
    </div>
    
    <div class="formula-object-container">
      <div class="formula-stats mb3">
        <div>Operators: {{ operatorCount }}</div>
        <div>Parentheses Blocks: {{ parenthesisCount }}</div>
      </div>
      <div class="formula-objects-container">
        <div class="formula-object-simple">
          <label>Formula</label>
          <pre>{{ JSON.stringify(formula, null, 2) }}</pre>
        </div>
        <div class="formula-object-api">
          <label>API Object</label>
          <pre> {{ JSON.stringify(apiFormula, null, 2)}}</pre>
        </div>
      </div>
    </div>

    </div>
    
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent } from 'vue';
// import NestedDraggable from './nested-draggable/index.vue'
import draggable from 'vuedraggable'
import { v4 as uuidv4 } from 'uuid';

/*
(((Opportunity Amount + Bonus Amount) / (Count Of CMS + 1)) * 0.33)
*/

const operandPositionTemplate = { 
  position: 0, 
  value_type: "", 
  value: 0
}
const calculatedFieldFormulaPositionTemplate = {
  position: 0, 
  value_type: "calculated_field_formula", 
  value: {
    operation: "",
    query: [],
    operands: []
  }
}
// 12345 + 3 * (12 /3)

// drggable to keep in lone with the formula array
// formula array be able to 
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  components: {
    draggable,
    // NestedDraggable
  },
  data() {
    return {
      currentGroupId: 0,
      drag: false,
      objectItem: {
        one: {},
        two: {}
      },
      formula: [

      ],
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
    objectItemKeys() {
      return Object.keys(this.objectItem)
    },
    apiFormula() {
      return {
        "object_class_id": "{{object_class_id_account}}",
        "label": "Arithmetic CF3",
        "description": "This is an arithmetic CF",
        "formula": { 
          "operation": "add", 
          "query": [],
          "operands": this.formulaOperands
        }
      }
    },
    formulaExample() {
      let randomValue = 1
      const formulaString = this.formula.reduce((acc, item) => {
        // console.log('formula example item: ', [item, item.valueType])
        if (item.valueType === 'operator') {
          acc += ` ${this.operators.find(op => op.value === item.value).label} `
        }
        else if(item.valueType === 'constant') {
          console.log('constant')
          acc += item.value
        }
        else {
          acc += randomValue
          randomValue++
        }
        return acc
      }, '')
      // console.log(eval(formulaString))
      return formulaString
    },
    formulaOperands() {
      let position = 0
      console.log('block indexes: ', this.parenthesesIndexes)
      return this.formula.reduce((acc, item, index) => {
        console.log('item.valueType: ', item.valueType, item.value, index, this.parenthesesIndexes)
        // operandPositionTemplate
        // calculatedFieldFormulaPositionemplate

        if (this.parenthesesIndexes.includes(index)) {
          console.log('create nested group')
            const nestedGroup = {...calculatedFieldFormulaPositionTemplate}
            nestedGroup.value.operands = []
            console.log('nestedGroup: ', nestedGroup)
        }
        // if (item.valueType === 'operator') {
        //   if (item.value.includes('parenthesis')) {
            
        //   }
        // }
        if (item.valueType !== 'operator') {
          acc.push({
            position,
            value_type: item.valueType,
            value: item.value
          })
          position++
        }
        return acc
      }, [])
    },
    parenthesesIndexes() {
      const allParentheses = []
      this.formula.filter((item, index) => {
        if (item.valueType === 'operator' && item.value.includes('parenthesis')) {
          allParentheses.push(index)
        }
      })

      let nextPairIndex = 0
      const indexPairs = []
      allParentheses.forEach((p, i) => {
        if (nextPairIndex < allParentheses.length) {
          console.log('nextPairIndex: ', nextPairIndex)
          indexPairs.push([allParentheses[nextPairIndex], allParentheses[nextPairIndex+1]])
          nextPairIndex+=2

          console.log(p,i)
        }
      })
      console.log('indexPairs: ', indexPairs)
  
      console.log('all parentheses: ', this.isValidFormula.isValid, allParentheses)

      return this.formula.reduce((acc, item, index) => {
        if (item.valueType === 'operator' && item.value.includes('parenthesis')) {
          const parenthesis = {
            index,
            type: item.value.includes('open') ? 'open' : 'close'
          }
          acc.push(parenthesis)
        }
        return acc
      }, [])
    },
    parenthesisCount() {
      const parenthesesLength = this.formula.filter(item => item.valueType === 'operator' && (item.value.includes('parenthesis')))?.length
      return parenthesesLength > 0 ? parenthesesLength / 2 : parenthesesLength
    },
    operatorCount() {
      return this.formula.filter(item => item.valueType === 'operator')?.length
    },
    
  },
  watch: {
    formula: {
      handler(value) {
        console.log('formula watch: ', value)
        this.isValidFormula = this.checkIsValidFormula()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    log(event) {
      console.log(event)
    },
    checkIsValidFormula() {
      let isValid = true
      let invalidReasons = []
      let currentItem = null

      this.formula.forEach(item => {
        if (currentItem) {
          
          // check if currentItem and item are both operators
          // if both are operators, check if either contains 'parenthesis'
          if (currentItem?.valueType === 'operator' && item?.valueType === 'operator' && (!item?.value.includes('parenthesis') && !currentItem?.value.includes('parenthesis'))) {
            // console.log('two operators item: ', item)
            isValid = false
            invalidReasons.push('Must have a field or constant between operator')
          }
          else if (currentItem?.valueType !== 'operator' && item?.valueType !== 'operator' && (!item?.value.includes('parenthesis') && !currentItem?.value.includes('parenthesis'))) {
            // console.log('two fields/constants item: ', item)
            isValid = false
            invalidReasons.push('Must have an operator between a field or constant')
          }
        }
        currentItem = item
      })
      return {isValid, invalidReasons}
    },
    handleOnAdd(evt) {
      console.log('add: ', evt)
    },
    handleOnEnd(evt) {
      this.drag = false
      const itemEl = evt.item;  // dragged HTMLElement
      // evt.to;    // target list
      // evt.from;  // previous list
      // evt.oldIndex;  // element's old index within old parent
      // evt.newIndex;  // element's new index within new parent
      // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
      // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
      // evt.clone // the clone element
      // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
      console.log('onEnd: ', evt)   
    },
    handleFieldClick(evt, element) {
      console.log('handleFieldClick: ', element)
      // const operator = this.operators.find(op => op.value === value)
      this.formula.push({
        id: uuidv4(),
        groupId: 0,
        valueType: 'object_attribute',
        value: element.id
      })
    },
    handleOperatorClick(evt, element) {
      console.log('handleOperatorClick: ', [evt, element])
      if (element.value === 'constant') {
        this.formula.push({
          id: uuidv4(),
          valueType: element.value,
          groupId: 0,
          value: 0
        })
      }
      else if (element.value === 'block') {
        // are there 
        this.formula.push({
          id: uuidv4(),
          valueType: 'operator',
          groupId:  '0_1',
          value: 'block_open'
        })
      }
      else {
        this.formula.push({
          id: uuidv4(),
          valueType: 'operator',
          value: element.value,
          // label: element.label,
          groupId: 0
        })
      }
    },
    handleOperatorsClone({value}) {
      const operator = this.operators.find(op => op.value === value)
      
      console.log('handleOperatorsClone: ', value, operator)
      if (value === 'constant') {
        return {
          id: uuidv4(),
          valueType: value,
          groupId: 0,
          value: 0
        }
        
      }
      else if (value === 'block') {
        // are there 
        const block = {
          id: uuidv4(),
          valueType: 'operator',
          groupId:  'group_0_1',
          value: 'block_open'
        }
        
        return (
          block
        )
      }
      else if (value.includes('paren')) {
        return {
          id: uuidv4(),
          valueType: 'operator',
          value,
          blockGroupId: uuidv4(),
        }
      }
      return {
        id: uuidv4(),
        valueType: 'operator',
        value,
        // label: operator.label,
        groupId: 0
      }
    },
    handleFieldsClone({ id, label }) {
      console.log('handleFieldsClone value: ', id, label)
      // const operator = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        valueType: 'object_attribute',
        value: id
      }
    },
    handleConstantInput(element) {
      let formulaConstant = this.formula.find(item => item.id === element.id)
      formulaConstant.value = Number(element.value)
      // console.log('handleConstantInput: ', [element, formulaConstant])
    
    },
    handleDrop(ev) {
      console.log('handleDrop: ', ev)
    },
    handleChange(evt) {
      if (evt.added && typeof evt?.added?.element?.value === 'string' && evt.added?.element?.value.includes('block_open')) {
        const { element, newIndex } = evt.added
        const closeElement = JSON.parse(JSON.stringify(element))
        closeElement.value = 'block_close'
        this.formula.splice(newIndex + 1, 0, closeElement)
        console.log('handleChange: ', [evt, newIndex, element, closeElement])

        console.log(this.formula)
      }
    },
    handleStart(evt) {
      console.log('start: ', evt)
      this.drag = true
    },
    handleTrashChange(value) {
      console.log('handleTrashChange: ', value)
      return null
    },
    modelValue(element) {
      // console.log('modelValue: ', element)
      return this.formula.find(item => item.id === element.id).value // this.formula.find(item => item."
    },
    objectAttributeLabelById(id) {
      const objectAttribute = this.objectAttributes.find(attribute => {
        // console.log(id, attribute.id, id === attribute.id)
        return attribute.id === id
      })
      
      return objectAttribute.label
    },
    renderElement(element) {
      // console.log('renderElement: ', element)
      if (element.valueType === 'operator') {
        const operator = this.operators.find(op => op.value === element.value)
        // console.log('renderElement operator: ', [element, operator])
        return operator?.label || 'error'
      }
      // else if (element.valueType === 'object_attribute') {
      //   console.log('renderElement object_attribute: ', element)
      //   return this.objectAttributes.find(attribute => attribute.id === element.value)?.value || 'error'
      // }
      // else if(element.valueType === 'constant') {
      //   console.log('renderElement constant: ', element)
      //   return this.operators.find(attribute => attribute.id === element.value)?.value
      // }
      // return element.value
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.display-none {
  display: none;
}
.left-panel {
  margin-left: 10px;
  flex: 1
}
.right-panel {
  margin-left: 10px;
  flex: 6
}
.formula-example {
  // border-top: 1px solid #ccc;
  margin-top: 10px;
  padding: 10px;
  text-align: left;
}
.formula-object-container {
  // display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  text-align: left;
  overflow: hidden;
  height: 650px;
  // margin-left: 20px;
  .formula-stats {
    display: flex;
    gap: 10px;
  }

  .formula-objects-container {
    display: flex;
    gap: 10px;
    .formula-object-simple {
      overflow-y: auto;
      height: 600px;
      border-right: 1px solid #ccc;
      padding-right: 10px;
    }
    .formula-object-api {
      overflow-y: auto;
      height: 600px;
    }
  }
  
}
.input {
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: inherit;
  padding: 1px 6px;
}
.formula-container {
  min-height: 54px;;
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #E5E7EB;
  padding: 10px;
  border-radius: 5px;
  input {
    padding: 5px 5px;
    border: 1px solid rgb(227, 227, 227);
    border-radius: 5px;
  }
}
.operators-container {
  margin: 10px 0;
  .operator-item {
    cursor: pointer;
    border: 1px solid #ccc; 
    border-radius: 3px; 
    padding: 0 5px; 
    margin-right: 7px;
    background-color: white
  }
}
.fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // border: 1px solid #ccc;
  width: 200px;
  > div {
    width: 100%;
    height: 100%;
    text-align: left;
    padding: 10px;;
    // border-top: 1px solid #ccc;
    background-color: #F3F4F6;
    box-sizing: border-box;
    margin-bottom: 10px;
    &:hover {
      background-color: skyblue;
    }
    .handle {
      cursor: pointer;
    }
  }
}
.trash-drag-container {
  display: flex;
  justify-content: flex-end;
  .trash-drag-area {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background-color: red;
    margin-right: 20px;
  }
}
</style>

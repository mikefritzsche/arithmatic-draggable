<template>
  <div class="container">
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
            <template #item="{element}"><span style="display: none">{{ element }}</span></template>
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
              >+
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="right-panel">
        <div>(((Opportunity Amount + Bonus Amount) / (Count Of CMS + 1)) * 0.33)</div>
        <!-- <draggable :group="{name: 'sameGroup', put: true, pull: false}" ghostClass="display-none" draggable=".draggable" class="my-8 mx-12" >
          <template #item> -->

        <draggable
            class="formula-container"
            v-model="formula"
            group="formulaItems"
            item-key="id"
            handle=".handle"
            empty-insert-threshold="5"
            @filter="handleFilter"
            @end="handleOnEnd"
            @start="handleStart"
            @change="handleChange"
        >
          <template #item="{element}">
            <template v-if="element.valueType === 'constant'">
              <div class="handle">
                <el-input
                    style="width:60px"
                    height="32"
                    v-model="element.value"
                    input-style="text-align: center"

                />
              </div>
            </template>
            <template v-else-if="element.valueType === 'object_attribute'">
              <div class="handle"
                  style="margin-right: 5px; padding: 3px 5px; height: 32px; border: 1px solid #ccc; border-radius: 5px;">
                {{ objectAttributeLabelById(element.value) }}
              </div>
            </template>
            <template v-else>
              <div
                  class="handle formula-item operator"
                  :class="{block: element.value.includes('block')}"
                  :style="{backgroundColor: element.backgroundColor}"
                  @mouseover="operatorMouseOver(element)"
                  @mouseleave="operatorMouseLeave(element)"
                  :ref="element.id"
              >
                <span @click="operatorRemoveClick(element)" class="remove"></span>
                <span>{{ renderElement(element) }}</span>
              </div>
            </template>
          </template>
        </draggable>


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
            <div>Parentheses Blocks: {{ blocksCount }}</div>
            <div>Operands: {{ formulaOperands.length }}</div>
          </div>
          <div class="formula-objects-container">
            <div class="formula-object-simple">
              <label>Formula</label>
              <pre>{{ JSON.stringify(formula, null, 2) }}</pre>
            </div>
            <div class="formula-object-api">
              <label>API Object</label>
              <pre> {{ JSON.stringify(apiFormula, null, 2) }}</pre>
            </div>
          </div>
        </div>

      </div>

    </div>
    <div class="flex w-100" style="text-align: left;">
      <div class="flat-tree-data" style="flex: 1;">
        <pre>{{ JSON.stringify(treeData, null, 2) }}</pre>
      </div>
      <div class="nested-data-tree" style="flex: 1;">
        <pre>{{ JSON.stringify(root, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {defineComponent} from 'vue';
// import NestedDraggable from './nested-draggable/index.vue'
import draggable from 'vuedraggable'
import FormulaItemBase from './components/formula-item-base/index.vue'
import {v4 as uuidv4} from 'uuid'
import {clone, evaluate, format, parse} from 'mathjs'
import Tree from '@/shared/helpers/TreeNode'

const randomColor = require('randomcolor')
// console.log('randomColor: ', randomColor())
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

const colorGenRandom = [
  randomColor({
    count: 10,
    luminosity: 'light',
    hue: 'green'
  }),
  randomColor({
    count: 10,
    luminosity: 'light',
    hue: 'blue'
  }),
  randomColor({
    count: 10,
    luminosity: 'light',
    hue: 'red'
  }),
  randomColor({
    count: 10,
    luminosity: 'light',
    hue: 'yellow'
  })
]

const depthNested = (d) => (o) => {
  o.depth = d
  (o.operands || []).forEach(depthNested(d + 1))
}

function validateFormulaBlocks(arr) {
  return arr.reduce((acc, item, index) => {
    if (item?.block !== 'close') {
      if (!acc[item.parentId]) acc[item.parentId] = 0
      acc[item.parentId] = acc[item.parentId] + 1
    }
    return acc
  }, {})
}

export default defineComponent({
  name: 'CFBuilderComplex',
  components: {
    draggable,
    FormulaItemBase,
  },
  data() {
    return {
      componentData: {
        "onUpdate:modelValue": this.inputChanged,
        modelValue: []
      },
      currentGroupId: 0,
      drag: false,
      objectItem: {
        one: {},
        two: {}
      },
      formula: [],
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
      objectAttributes: Object.freeze([
        {
          id: 'c81cbaf9-6f6b-4d2d-a37a-8191ba61de1b',
          label: 'Opportunity Amount',
          data_type: 'currency'
        },
        {
          id: '666a4dd3-9955-43c6-a399-f98d81774bef',
          label: 'Bonus Amount',
          data_type: 'currency'
        },
        {
          id: 'd1302356-e080-4eeb-827a-6d2383e0a11a',
          label: 'Count Of CMS',
          data_type: 'int'
        },
        {
          id: '91380ee0-b723-4c67-9f27-4aff5e62c629',
          label: 'Why Not?',
          data_type: 'currency'
        },
        {
          id: 'affde7bd-e241-4122-b0d1-7b7f32bf8b0b',
          label: 'Fancy Field',
          data_type: 'currency'
        },
        {
          id: '7ec1cdb3-9f4f-4702-b242-c5c90d493137',
          label: 'Look at me',
          data_type: 'currency'
        },
        {
          id: 'c5aa47c4-e349-490b-b0c7-721db17aed6d',
          label: 'Extemporaneous',
          data_type: 'currency'
        },
        {
          id: 'b13611f3-8f4a-4e6c-b5ff-6fcc0de69ed3',
          label: 'Kerfuffleling',
          data_type: 'currency'
        },
        {
          id: 'd055f01c-e5ea-4c1d-a376-97f3f0eb52f2',
          label: 'Last, but not least',
          data_type: 'currency'
        },
      ]),
      operators: Object.freeze([
        {
          valueType: 'operator',
          value: 'add',
          label: '+',
          pemdasNumber: 0,
        },
        {
          valueType: 'operator',
          value: 'subtract',
          label: '-',
          pemdasNumber: 0,
        },
        {
          valueType: 'operator',
          value: 'multiply',
          label: '*',
          pemdasNumber: 1
        },
        {
          valueType: 'operator',
          value: 'divide',
          label: '/',
          pemdasNumber: 1
        },
        {
          valueType: 'operator',
          value: 'block_open',
          label: '(',
          pemdasNumber: 0.5
        },
        {
          valueType: 'operator',
          value: 'block_close',
          label: ')',
          pemdasNumber: 0.5
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
      ]),
      renderedTreeData: undefined,
      root: undefined,
      trashItems: [],
      tree: new Tree('0', {}),
      treeData: [
        {id: 0, parentId: null},
      ],
      treeData1: [
        {id: 56, parentId: 62},
        {id: 81, parentId: 80},
        {id: 0, parentId: null},
        {id: 76, parentId: 80},
        {id: 63, parentId: 62},
        {id: 80, parentId: 86},
        {id: 87, parentId: 86},
        {id: 94, parentId: 86},
        {id: 62, parentId: 0},
        {id: 86, parentId: 0},
      ]
    }
  },
  computed: {
    objectItemKeys() {
      return Object.keys(this.objectItem)
    },
    apiFormula() {
      // console.log('this.formula.filter(item => item.valueType === \'formula-item\'): ',
      //     this.formula.filter(item => item.valueType === 'operator'),
      //     this.operatorCount
      // )

      const operation = this.operatorCount === 1 ? this.formula.filter(item => item.valueType === 'operator')?.[0].value : ''
      if (this.formulaOperands.length > 2 && this.pemdasValue === 0) {
        //create bracket groups
      } else if (this.formulaOperands.length > 2 && this.pemdasValue > 0 && this.blocksCount > 0) {
        // validate correct blocks/operators/values
      }
      return {
        "object_class_id": "{{object_class_id_account}}",
        "label": "Arithmetic CF3",
        "description": "This is an arithmetic CF",
        "formula": {
          "operation": operation,
          "query": [],
          "operands": this.formulaOperands
        }
      }
    },

    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    formulaExample() {
      let randomValue = 1
      const formulaString = this.formula.reduce((acc, item) => {
        // console.log('formula example item: ', [item, item.valueType])
        if (item.valueType === 'operator') {
          acc += ` ${this.operators.find(op => op.value === item.value).label} `
        } else if (item.valueType === 'constant') {
          // console.log('constant')
          acc += item.value
        } else {
          acc += randomValue
          randomValue++
        }
        return acc
      }, '')
      if (formulaString) {
        const node = parse('3+4*2')
        // console.log('parse string: ', node.toString())
        try {
          // const equals = Function("return " + formulaString)()
          // return `${formulaString} = ${equals}`
          return `${parse(formulaString.toString())} = ${evaluate(formulaString)}`
        }
        catch (e) {
          // console.log('eval error: ', e)
        }
        // console.log(eval(formulaString))
        return formulaString + 'invalid'
      }
      return ''
    },
    formulaOperands() {
      let position = 0
      // console.log('block indexes: ', this.blocksIndexes)
      return this.formula.reduce((acc, item, index) => {
        // console.log('item.valueType: ', item.valueType, item.value, index, this.blocksIndexes)
        // operandPositionTemplate
        // calculatedFieldFormulaPositionemplate

        if (this.blocksIndexes.includes(index)) {
          // console.log('create nested group')
          const nestedGroup = {...calculatedFieldFormulaPositionTemplate}
          nestedGroup.value.operands = []
          // console.log('nestedGroup: ', nestedGroup)
        }
        // if (item.valueType === 'formula-item') {
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
    idMapping() {
      const formulaIds = this.formula.reduce((acc, el, i) => {
        acc[el.id] = i
        return acc
      }, {})
      console.log('formulaIds: ', formulaIds)
      return formulaIds
      return this.treeData.reduce((acc, el, i) => {
        acc[el.id] = i
        return acc
      }, {})
    },
    blocksIndexes() {
      const allBlocks = []
      this.formula.filter((item, index) => {
        if (item.valueType === 'operator' && item.value.includes('block')) {
          allBlocks.push(index)
        }
      })

      let nextPairIndex = 0
      const indexPairs = []
      allBlocks.forEach((p, i) => {
        if (nextPairIndex < allBlocks.length) {
          // console.log('nextPairIndex: ', nextPairIndex)
          indexPairs.push([allBlocks[nextPairIndex], allBlocks[nextPairIndex + 1]])
          nextPairIndex += 2

          console.log(p, i)
        }
      })
      // console.log('indexPairs: ', indexPairs)

      // console.log('all allBlocks: ', this.isValidFormula.isValid, allBlocks)

      return this.formula.reduce((acc, item, index) => {
        if (item.valueType === 'operator' && item.value.includes('block')) {
          const blocks = {
            index,
            type: item.value.includes('open') ? 'open' : 'close'
          }
          acc.push(blocks)
        }
        return acc
      }, [])
    },
    blocksCount() {
      const blocksLength = this.formula.filter(item => item.valueType === 'operator' && (item.value.includes('block')))?.length
      return blocksLength > 0 ? blocksLength / 2 : blocksLength
    },
    operatorCount() {
      return this.formula.filter(item => item.valueType === 'operator' && !item.value.includes('block'))?.length
    },
    // Calculate operator values based on PEMDAS/BEDMAS priority
    pemdasValue() {
      return this.formula.reduce((acc, item) => {
        if (item.valueType === 'operator') {
          const operator = this.operators.find(op => {
            return op.value === item.value
          })
          console.log('pemdasValue operator: ', operator)
          acc += operator.pemdasNumber
        }
        return acc
      }, 0)
    }
  },
  watch: {
    formula: {
      handler(value) {
        // console.log('formula watch: ', value)
        // this.isValidFormula = this.checkIsValidFormula()
        let valueClone = JSON.parse(JSON.stringify(value))
        console.log('valueClone: ', valueClone)
        const builtNestedData = this.buildNestedData(valueClone.filter(item => item?.block !== 'close', '0'), '0')
        // builtNestedData.forEach(depthNested(0))
        console.log('builtNestedData: ', builtNestedData)
        console.log('validateFormulaBlocks: ', validateFormulaBlocks(builtNestedData))
      },
      immediate: true,
      deep: true,
    },
    treeData: {
      handler(data, prev) {
        // this.generateTreeData()
      },
      immediate: true
    }
  },
  methods: {
    buildNestedData(arr, parent, blockCount = 0) {
      let out = []
      for(let i in arr) {
        if (arr[i]?.block !== 'close') {
          console.log('hi: ', [arr[i], parent])
          if (arr[i]?.block) delete arr[i].block
          if (arr[i].parentId === '0') arr[i].blockCount = blockCount
          if (arr[i].parentId === parent) {
            let operands = this.buildNestedData(arr, arr[i].id, blockCount+1)

            if (operands.length) {
              arr[i].operands = operands
            }

            out.push(arr[i])
          }
        }
      }
      return out
    },
    inputChanged(evt) {
      // console.log('inputChanged: ', evt)
    },
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
          if (currentItem?.valueType === 'operator' && item?.valueType === 'operator' && (!item?.value.includes('block') && !currentItem?.value.includes('block'))) {
            // console.log('two operators item: ', item)
            isValid = false
            invalidReasons.push('Must have a field or constant between formula-item')
          } else if (currentItem?.valueType !== 'operator' && item?.valueType !== 'operator' && (!item?.value.includes('block') && !currentItem?.value.includes('block'))) {
            // console.log('two fields/constants item: ', item)
            isValid = false
            invalidReasons.push('Must have an formula-item between a field or constant')
          }
        }
        currentItem = item
      })
      return {isValid, invalidReasons}
    },
    generateTreeData() {
      let treeData = JSON.parse(JSON.stringify(this.formula))
      // let treeData = JSON.parse(JSON.stringify(this.treeData))
      treeData.forEach((el) => {
        // Handle the root element
        if (el.parentId === null) {
          this.root = el
          return
        }
        // Use our mapping to locate the parent element in our data array
        const parentEl = treeData[this.idMapping[el.parentId]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el]
      })
    },
    handleOnAdd(evt) {
      // console.log('add: ', evt)
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
      // console.log('onEnd: ', evt)
    },
    handleFieldClick(evt, element) {
      // console.log('handleFieldClick: ', element)
      // const formula-item = this.operators.find(op => op.value === value)
      this.formula.push({
        id: uuidv4(),
        groupId: 0,
        valueType: 'object_attribute',
        value: element.id
      })
    },
    handleOperatorClick(evt, element) {
      const formulaObject = this.handleOperatorsClone({value: element.value})
      // console.log('handleOperatorClick: ', [element, formulaObject])
      this.formula.push(formulaObject)
    },
    handleFieldsClone({id, label}) {
      // console.log('handleFieldsClone value: ', id, label)

      // const formula-item = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        blockGroupId: '0',
        valueType: 'object_attribute',
        value: id
      }
    },
    handleOperatorsClone({value}) {
      console.log('handleOperatorsClone: ', value)
      const operator = this.operators.find(op => op.value === value)
      // 1 + ( 2 * ( 3 + 4 ) )  2 levels
      // 6 secondary Taro colors
      // random number for fields start a 1
      // console.log('handleOperatorsClone: ', value, operator)
      if (value === 'constant') {
        return {
          id: uuidv4(),
          parentId: '0',
          value: 0,
          valueType: value
        }
      }
      else if (value.includes('block')) {
        const randomIndex = Math.floor(Math.random() * colorGenRandom.length) + 1
        const randomColorArr = colorGenRandom[randomIndex - 1]
        const randomColorIndex = Math.floor(Math.random() * randomColorArr.length) + 1
        // insert(parentNodeKey, key, value = key)

        return {
          backgroundColor: colorGenRandom[randomIndex][randomColorIndex],
          block: 'open',
          blockGroupId: uuidv4(),
          id: uuidv4(),
          parentId: '0',
          value,
          valueType: 'operator',
        }
      }
      return {
        id: uuidv4(),
        parentId: '0',
        value,
        valueType: 'operator'
      }
    },
    handleDrop(ev) {
      // console.log('handleDrop: ', ev)
    },
    handleChange(evt) {
      if (evt.added) {

        // handle blocks
        if (typeof evt?.added?.element?.block && evt.added?.element?.block === 'open') {
          // console.log('handleChange: ', evt.added.element)
          const {element, newIndex} = evt.added
          const closeElement = JSON.parse(JSON.stringify(element))
          closeElement.value = 'block_close'
          closeElement.block = 'close'
          closeElement.id = uuidv4() // closeElement.id.replace('block_open__', 'block_close__')
          this.tree.insert('formula', closeElement.id, element)
          // this.treeData.push({
          //   id: closeElement.id.replace('block_close__', ''),
          //   valueType: 'block',
          //   parentId: 0,
          // })

          this.formula.splice(newIndex + 1, 0, closeElement)
        }
        else if (evt?.added?.element?.valueType === 'operator' || evt?.added?.element?.valueType === 'object_attribute' || evt?.added?.element?.valueType === 'constant') {
          const index = evt.added.newIndex
          this.tree.insert('formula', evt.added.element.valueType, evt.added.element)
          this.updateGroupBlockId(index)

          // console.log('change constant/object_attribute: ', {added: evt.added, index})
        }
      }
      else if (evt.moved) {
        // console.log('change evt moved: ', evt.moved)
        const index = evt.moved.newIndex
        if (evt?.moved?.element?.block) {
          const { element } = evt.moved
          console.log('block moved: ', [index, element])
          this.updateGroupBlockId(index)

        }
        else if (evt?.moved?.element?.valueType === 'operator' || evt?.moved?.element?.valueType === 'object_attribute' || evt?.moved?.element?.valueType === 'constant') {
          const index = evt.moved.newIndex

          this.updateGroupBlockId(index)

          // console.log('change constant/object_attribute: ', {moved: evt.moved, index})
        }
      }
      else if (evt.removed) {
        // console.log('change evt removed: ', evt.removed)
        const {element, oldIndex} = evt.removed
        if (element.value.includes('block')) {
          const matchingBlockPosition = element.id.includes('open') ? 'close' : 'open'
          const blockGroupId = element.id.replace(/(block_open__|block_close__)/g, '')

          // console.log('filter formula and remove matching block object: ', [
          //   matchingBlockPosition, this.formula, element, oldIndex, blockGroupId
          // ])
          const formulaClone = JSON.parse(JSON.stringify(this.formula))
          const filteredFormula = formulaClone.reduce((acc, f) => {
            if (
                typeof f.value !== 'string' ||
                (
                    typeof f.value === 'string' &&
                    !f.value.includes('block') &&
                    !f.value.includes(matchingBlockPosition)
                )
            ) {
              if (f.parentId === blockGroupId) {
                f.parentId = '0'
              }
              acc.push(f)
            }
            return acc
          }, [])

          // console.log('filteredFormula: ', filteredFormula)
          this.formula = filteredFormula
        }
      }
    },

    handleFilter(evt) {
      // console.log('handleFilter: ', evt)

    },
    handleStart(evt) {
      this.drag = true
    },
    handleTrashChange(evt) {
      // console.log('handleTrashChange: ', evt)
      // if (evt.added) {
      //   const { element, newIndex } = evt.added
      //   if (element.value.includes('block')) {
      //     console.log('block item removed...find match and remove: ', [this.formula, element, newIndex])
      //     // this.formula = this.formula.filter(f = f.)
      //   }
      // }
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
    operatorMouseOver(element) {
      this.$refs[element.id].querySelector('span.remove').classList.add('active')
    },
    operatorMouseLeave(element) {
      this.$refs[element.id].querySelector('span.remove').classList.remove('active')
    },
    operatorRemoveClick(element) {
      // console.log('operatorRemoveClick: ', element)
      const filteredFormula = this.formula.reduce((acc, item) => {
        if (item.id !== element.id) acc.push(item)
        return acc
      }, [])
      this.formula = filteredFormula
    },
    renderElement(element) {
      // console.log('renderElement: ', element)
      if (element.valueType === 'operator') {
        const operator = this.operators.find(op => op.value === element.value)
        // console.log('renderElement formula-item: ', [element, formula-item])
        return operator?.label || 'error'
      }
    },
    updateGroupBlockId(index) {
      console.log('updateGroupBlockId: ', index)

      if (this.formula[index]?.block) {
        console.log('block moved - find elements between: ', this.formula[index])
      }
      else {
        console.log('item moved: ', this.formula[index])
      }
      const blocks = this.formula.reduce((acc, item, blockIndex) => {
        if (item?.block) {
          acc.push({
            id: item.id,
            index: blockIndex,
            value: item,
            type: item.block,
            parentId: item.id
          })
        }
        return acc
      }, [])
      const blockTypes = this.formula.reduce((acc, item, formulaIndex) => {
        if (item?.block) {
          acc[item.block][item.blockGroupId] = {
            id: item.id,
            index: formulaIndex,
            value: item,
            type: item.block,
            parentId: item.id
          }
        }
        return acc
      }, {open: {}, close: {}})

      console.log('blocks/open/close: ', [blocks, blockTypes])

      blocks.forEach(block => {
        if (block.type === 'open') {
          console.log('open block.index: ', block.index)
          const openBlockGroupId = block.blockGroupId
          let endBlock = ''

          // find matching close block
          blocks.find(b => {
            if (b.type === 'close' && b.blockGroupId === openBlockGroupId) {
              const closeBlockGroupId = b.blockGroupId
              console.log('find closing block: ', [b, closeBlockGroupId, openBlockGroupId])
              console.log('closing block: ', b)
              endBlock = b
              console.log('index, block.index, endBlock.index: ', index, block.index, endBlock.index)
              if (index > block.index && index < endBlock.index) {
                this.formula[index].parentId = block.id
                console.log('add parentId to element: ', [block, endBlock, this.formula])
              }
              else {
                this.formula[index].parentId = '0'
              }
            }
          })
        }
      })
    }
  }
});

// ---------------------
const resp = {
  "object_class_id": "{{object_class_id_account}}",
  "label": "Arithmetic CF3",
  "description": "This is an arithmetic CF",
  "formula": {
    "operation": "subtract",
    "query": [],
    "operands": [
      {
        "position": 0,
        "value_type": "constant",
        "value": 1
      },
      {
        "position": 1,
        "value_type": "calculated_field_formula",
        "value": {
          "operation": "divide",
          "query": [],
          "operands": [
            {
              "position": 0,
              "value_type": "object_attribute",
              "value": "{{object_attribute_id_field_a}}"
            },
            {
              "position": 1,
              "value_type": "object_attribute",
              "value": "{{object_attribute_id_field_b}}"
            }
          ]
        }
      }
    ]
  }
}
function flattenChildren(children) {

}
let formula = []
resp.formula.operands.forEach((operand, i) => {
  if (operand.value_type !== 'calculated_field_formula') {
    operand.id = i+1
    operand.parentId = '0'
    formula.push(operand)
  }
  else {
    formula.push({
      "backgroundColor": "#fcebae",
      "block": "open",
      "blockGroupId": "a12de4e9-299f-43a0-aee8-bddfa8eb5d90",
      "id": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
      "parentId": '0',
      "value": "block_open",
      "valueType": "operator"
    })
    operand.value.operands.forEach((nestedOperand, nestedIndex) => {
      if (operand.value_type !== 'calculated_field_formula') {
        nestedOperand.id = nestedIndex+1
        nestedOperand.parentId = `${i+1}`
        formula.push(nestedOperand)
      }
    })
  }
  // console.log(operand)
})
// console.log('formula: ', formula)

const data = [
  {
    id: '0',
    parentId: null,
  },
  {
    "backgroundColor": "#fcebae",
    "block": "open",
    "blockGroupId": "a12de4e9-299f-43a0-aee8-bddfa8eb5d90",
    "id": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
    "parentId": '0',
    "value": "block_open",
    "valueType": "operator"
  },
  {
    "id": "b7cf8df9-78c6-4037-9e58-9191c8ab464b",
    "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
    "value": "1",
    "valueType": "constant"
  },
  {
    "id": "b602f5a9-257e-4d34-a5ee-0cb936877627",
    "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
    "value": "add",
    "valueType": "operator"
  },
  {
    "id": "22c148af-2371-4bfd-90cb-4c454a0e12ae",
    "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
    "value": "2",
    "valueType": "constant"
  },
  {
    "id": "126842dd-0805-48cb-ac91-bcef6900cb80",
    "parentId": '0',
    "value": "multiply",
    "valueType": "operator"
  },
  {
    "id": "035d224d-740c-4612-a6b2-3be703b4ccd5",
    "parentId": '0',
    "value": "3",
    "valueType": "constant"
  }
];

const idMapping = data.reduce((acc, el, i) => {
  acc[el.id] = i;
  return acc;
}, {});

let root;
data.forEach((el) => {
  // console.log('el: ', el.parentId)
  // Handle the root element
  if (el.parentId === null) {
    root = el;
    return;
  }

  // Use our mapping to locate the parent element in our data array
  const parentEl = data[idMapping[el.parentId]];
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el];
  // console.log('children: ', parentEl.children)
});
const request = {
  "object_class_id": "{{object_class_id_account}}",
  "label": "Arithmetic CF3",
  "description": "This is an arithmetic CF",
  "formula": {
    "operation": "",
    "query": [],
    operands: root
  }
}
// root
// console.log(request)

var a = [
  { ID: "1671", parent: "0", },
  { ID: "1223", parent: "0", },
  { ID: "1668", parent: "0", },
  { ID: "1688", parent: "0", },
  { ID: "1669", parent: "0", },
  { ID: "1681", parent: "1669", },
  { ID: "1680", parent: "1669", },
  { ID: "1670", parent: "1669", },
  { ID: "1682", parent: "1669", },
  { ID: "1433", parent: "1682", },
  { ID: "1684", parent: "1682", },
  { ID: "1672", parent: "1684", },
  { ID: "1685", parent: "1672", },
  { ID: "1686", parent: "1672", },
  { ID: "1683", parent: "0", },
  { ID: "1230", parent: "0", },
  { ID: "1667", parent: "0", },
  { ID: "1687", parent: "0", }
];

function findFor(parentId) {
  var z = {};
  for (var i = 0; i<a.length; i++){
    if (a[i].parent === parentId) {
      var ch = findFor(a[i].ID);
      var o = Object.keys(ch).length === 0 ? {} : { children: ch };
      z[a[i].ID] = Object.assign(o, a[i]);
    }
  }

  return z;
}

// console.log(findFor("0"));

const familyTree = [
  {
    id: "23b9dbff",
    name: "Jessie",
    age: 50,
    children: [
      {
        id: "5c0f3094",
        name: "Peter",
        age: 20
      },
      {
        id: "c1484221",
        name: "Paul",
        age: 32,
        children: [
          {
            id: "2e6d866e",
            name: "Carol",
            age: 12
          },
          {
            id: "e48a27ad",
            name: "Hester",
            age: 15
          }
        ]
      },
      {
        id: "8a265c23",
        name: "Hilda",
        age: 25
      }
    ]
  },
  {
    id: "53164b2b",
    name: "Mathew",
    age: 70,
    children: [
      {
        id: "b14a960c",
        name: "Spencer",
        age: 45,
        children: [
          {
            id: "ff3c260c",
            name: "Joseph",
            age: 22
          },
          {
            id: "7c60920a",
            name: "Robert",
            age: 27,
            children: [
              {
                id: "0e11874f",
                name: "Ian",
                age: 2
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "5a4bdc98",
    name: "Claire",
    age: 63,
    children: [
      {
        id: "014b62a3",
        name: "Adrian",
        age: 41
      },
      {
        id: "a1899541",
        name: "Julie",
        age: 32,
        children: [
          {
            id: "013362a3",
            name: "Patricia",
            age: 4
          }
        ]
      }
    ]
  }
];

const getMembers = (members) => {
  let children = [];
  const flattenMembers = members.map(m => {
    if (m.children && m.children.length) {
      children = [...children, ...m.children];
    }
    return m;
  });

  return flattenMembers.concat(children.length ? getMembers(children) : children);
};

// getMembers(familyTree);
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

.formula-item {
  &.operator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    padding: 3px 5px;
    height: 32px;
    width: 32px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #42b983;
    position: relative;

    .remove {
      display: none;

      &.active {
        display: block;
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 13px;
        border: 1px solid #fff;
        border-radius: 9px;
        padding: 7px;
        width: 3px;
        height: 3px;
        background-color: red;
        vertical-align: middle;
        line-height: 3px;
      }
    }

    //&:hover {
    //&:after {
    //
    //}
    //}
    & > span {

    }

    &.block {
      background-color: #ccc;
    }
  }
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

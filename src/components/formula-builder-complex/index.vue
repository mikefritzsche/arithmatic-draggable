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
              >
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
        <pre>{{ JSON.stringify(treeData, null, 2)}}</pre>
      </div>
      <div class="nested-data-tree" style="flex: 1;">
        <pre>{{ JSON.stringify(root, null, 2)}}</pre>
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
import Tree from '@/shared/helpers/TreeNode'
const randomColor = require('randomcolor')
console.log('randomColor: ', randomColor())
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
const blockColorsGen = [...Array(12).keys()].reduce((acc, color) => {
  acc.push(`#${Math.floor(Math.random()*16777215).toString(16)}`)
  return acc
}, [])

const colorGenRandom = {
  green: randomColor({
    count: 10,
    luminosity: 'dark',
    hue: 'green'
  }),
  blue: randomColor({
    count: 10,
    luminosity: 'dark',
    hue: 'blue'
  }),
  red: randomColor({
    count: 10,
    luminosity: 'dark',
    hue: 'red'
  })
}

const randomColorCategory = Math.floor(Math.random() * (Object.keys(colorGenRandom).length + 1)) + 1
console.log('color gen: ', colorGenRandom, randomColorCategory)

const blockColors = [
  "#5476bd",
  "#bccf1e",
  "#862f5a",
  "#858ac6",
  "#a7d3c2",
  "#82bd20",
  "#156a58",
  "#d03555",
  "#4658d6",
  "#ff1523",
  "#68044d",
  "#2b951f"
]

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
      ]),
      renderedTreeData: undefined,
      root: undefined,
      trashItems: [],
      tree: new Tree('formula', 'A'),
      treeData: [
          { id: 0, parentId: null },
      ],
      treeData1: [
        { id: 56, parentId: 62 },
        { id: 81, parentId: 80 },
        { id: 0, parentId: null },
        { id: 76, parentId: 80 },
        { id: 63, parentId: 62 },
        { id: 80, parentId: 86 },
        { id: 87, parentId: 86 },
        { id: 94, parentId: 86 },
        { id: 62, parentId: 0 },
        { id: 86, parentId: 0 },
      ]
    }
  },
  computed: {
    objectItemKeys() {
      return Object.keys(this.objectItem)
    },
    apiFormula() {
      console.log('this.formula.filter(item => item.valueType === \'formula-item\'): ',
          this.formula.filter(item => item.valueType === 'operator'),
          this.operatorCount
      )

      const singleOperator = this.formula.filter(item => item.valueType === 'operator' && !item.value.includes('block'))
      const hasBlocks = false
      const operation = this.operatorCount === 1 ? this.formula.filter(item => item.valueType === 'operator')?.[0].value : ''
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
          console.log('constant')
          acc += item.value
        } else {
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
      console.log('block indexes: ', this.blocksIndexes)
      return this.formula.reduce((acc, item, index) => {
        console.log('item.valueType: ', item.valueType, item.value, index, this.blocksIndexes)
        // operandPositionTemplate
        // calculatedFieldFormulaPositionemplate

        if (this.blocksIndexes.includes(index)) {
          console.log('create nested group')
          const nestedGroup = {...calculatedFieldFormulaPositionTemplate}
          nestedGroup.value.operands = []
          console.log('nestedGroup: ', nestedGroup)
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
          console.log('nextPairIndex: ', nextPairIndex)
          indexPairs.push([allBlocks[nextPairIndex], allBlocks[nextPairIndex + 1]])
          nextPairIndex += 2

          console.log(p, i)
        }
      })
      console.log('indexPairs: ', indexPairs)

      console.log('all allBlocks: ', this.isValidFormula.isValid, allBlocks)

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
    treeData: {
      handler(data, prev) {
        this.generateTreeData()
      },
      immediate: true
    }
  },
  methods: {
    inputChanged(evt) {
      console.log('inputChanged: ', evt)
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
      let treeData = JSON.parse(JSON.stringify(this.treeData))
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
      // const formula-item = this.operators.find(op => op.value === value)
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
      else if (element.value.includes('block')) {
        const openBlock = {
          id: `block_open__${uuidv4()}`,
          valueType: 'operator',
          blockGroupId: 0,
          value: element.value
        }

        this.formula.push(openBlock)
      }
      else {
        this.formula.push({
          id: uuidv4(),
          valueType: 'operator',
          value: element.value,
          blockGroupId: 0
        })
      }
    },
    handleConstantInput(element) {
      let formulaConstant = this.formula.find(item => item.id === element.id)
      formulaConstant.value = Number(element.value)
      // console.log('handleConstantInput: ', [element, formulaConstant])

    },
    handleFieldsClone({id, label}) {
      console.log('handleFieldsClone value: ', id, label)

      // const formula-item = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        blockGroupId: '0',
        valueType: 'object_attribute',
        value: id
      }
    },
    handleOperatorsClone({value}) {
      const operator = this.operators.find(op => op.value === value)

      console.log('handleOperatorsClone: ', value, operator)
      if (value === 'constant') {
        return {
          id: uuidv4(),
          valueType: value,
          blockGroupId: '0',
          value: 0
        }
      }
      else if (value.includes('block')) {
        return {
          id: `block_open__${uuidv4()}`,
          valueType: 'operator',
          value,
          blockGroupId: '0',
          backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }
      }
      return {
        id: uuidv4(),
        valueType: 'operator',
        value,
        blockGroupId: '0'
      }
    },
    handleDrop(ev) {
      console.log('handleDrop: ', ev)
    },
    handleChange(evt) {
      if (evt.added) {
        // handle blocks
        if (typeof evt?.added?.element?.value === 'string' && evt.added?.element?.value.includes('block_open')) {
          const {element, newIndex} = evt.added
          const closeElement = JSON.parse(JSON.stringify(element))
          closeElement.value = 'block_close'
          closeElement.id = closeElement.id.replace('block_open__', 'block_close__')
          this.tree.insert('formula', closeElement.id.replace('block_close__', ''), element)
          this.treeData.push({
            id: closeElement.id.replace('block_close__', ''),
            valueType: 'block',
            parentId: 0,
          })

          this.formula.splice(newIndex + 1, 0, closeElement)

          console.log('handleChange: ', [
            evt, newIndex, element,
            closeElement, closeElement.id,
            this.formula[newIndex],
          ])

          console.log(this.formula)
        }
        else if (evt?.added?.element?.valueType === 'operator' || evt?.added?.element?.valueType === 'object_attribute' || evt?.added?.element?.valueType === 'constant') {
          const index = evt.added.newIndex
          this.tree.insert('formula', evt.added.element.valueType, evt.added.element)
          this.updateGroupBlockId(index)

          console.log('change constant/object_attribute: ', {added: evt.added, index})
        }
      }
      else if (evt.moved) {
        console.log('change evt moved: ', evt.moved)
        if (evt?.moved?.element?.valueType === 'operator' || evt?.moved?.element?.valueType === 'object_attribute' || evt?.moved?.element?.valueType === 'constant') {
          const index = evt.moved.newIndex

          this.updateGroupBlockId(index)

          console.log('change constant/object_attribute: ', {moved: evt.moved, index})
        }
      }
      else if (evt.removed) {
        console.log('change evt removed: ', evt.moved)
      }
    },

    handleFilter(evt) {
      console.log('handleFilter: ', evt)

    },
    handleStart(evt) {
      this.drag = true
    },
    handleTrashChange(value) {
      // console.log('handleTrashChange: ', value)
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
        // console.log('renderElement formula-item: ', [element, formula-item])
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
    },
    updateGroupBlockId(index) {
      const blocks = this.formula.reduce((acc, item, index) => {
        if (item.valueType === 'operator' && item.value.includes('block')) {
          acc.push({
            index,
            value: item,
            type: item.id.includes('open') ? 'open' : 'close',
            blockGroupId: item.id.replace(/(block_open__|block_close__)/g, '')
          })
        }
        return acc
      }, [])
      console.log('blocks: ', blocks)

      blocks.forEach(block => {
        let isOpenBlock = block.type ==='open'

        if (isOpenBlock) {
          const openBlockId = block.blockGroupId
          let endBlock = ''

          // find matching close block
          blocks.find(b => {
            let isCloseBlock = b.type === 'close'
            if (isCloseBlock) {
              const closeBlockId = b.blockGroupId
              console.log('find closing block: ', [b, closeBlockId, openBlockId])
              if (closeBlockId === openBlockId) {
                console.log('closing block: ', b)
                endBlock = b
                if (index > block.index && index < endBlock.index) {
                  this.formula[index].blockGroupId = closeBlockId
                  console.log('add blockGroupId to element: ', [block, endBlock, this.formula])
                }
                else {
                  this.formula[index].blockGroupId = '0'
                }
              }
            }
          })
        }
      })
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
    &.block {
      //background-color: #ccc;
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

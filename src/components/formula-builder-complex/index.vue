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
            class="operators-container flex"
            v-model="operators"
            :group="{ name: 'formulaItems', pull: 'clone', put: false }"
            ghost-class="sortable-ghost"
            selected-class="sortable-selected"
            :sort="false"
            @start="handleFieldOperatorStart"
            @end="drag=false"
            :clone="handleOperatorsClone"
        >
          <template #item="{element}">
            <span
                v-if="!Object.keys(element).includes('showInList') || element?.showInList"
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
            @start="handleFieldOperatorStart"
            @end="handleFieldOperatorEnd"
            handle=".handle"
            chosen-class="sortable-chosen"
            drag-class="sortable-drag"
            ghost-class="sortable-drag"
            :multiDrag="true"
            selected-class="sortable-selected"
        >
          <template #item="{element}">
            <div
                class="flex"
                v-if="element.label"

            >
              <div class="handle" style="flex: 3">{{ element.label }}</div>
              <div
                  style="flex: 1; text-align: right; cursor: pointer;"
                  @click="(event) => handleFieldClick(event, element)"
              >+
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="right-panel">
<!--        <div>(((Opportunity Amount + Bonus Amount) / (Count Of CMS + 1)) * 0.33)</div>-->

        <div style="text-align: right"><button :disabled="saveEnabled" type="submit">Save</button></div>
        <div>Drag: {{ !!drag }}</div>
        <draggable
            class="formula-container"
            :class="{highlight: !!dragFieldOperators}"
            v-model="formula"
            group="formulaItems"
            item-key="id"
            handle=".handle"
            empty-insert-threshold="5"
            @filter="handleFilter"
            @end="handleOnEnd"
            @start="handleStart"
            @change="handleChange"
            @dragover="handleDrag"
            @dragenter="handleDrag"
            @dragleave="handleDrag"
        >
          <template #item="{element}">
            <template v-if="element.valueType === 'constant'">
              <div
                  class="handle formula-item constant"
                  @mouseover="elementMouseOver(element, 'constant')"
                  @mouseleave="elementMouseLeave(element, 'constant')"
                  :ref="element.id"
              >
                <span @click="elementRemoveClick(element)" class="remove"></span>
                <el-input
                    resize="horizontal"
                    @input="(event) => constantInput(event, element)"
                    v-model="element.value"
                    style="{width: 65px}"
                    input-style="text-align: center"
                    :ref="`constant-input-${element.id}`"
                />
              </div>
            </template>
            <template v-else-if="element.valueType === 'object_attribute'">
              <div class="handle object-attribute-item" :ref="element.id">
                <span>{{ objectAttributeLabelById(element.value, allObjectAttributes) }}</span>
                <span @click="elementRemoveClick(element)" class="remove">x</span>
              </div>
            </template>
            <template v-else>
              <div
                  class="handle formula-item operator"
                  :class="{block: element.value.includes('block')}"
                  :style="{color: element.backgroundColor, fontWeight: 'bold'}"
                  @mouseover="operatorMouseOver(element)"
                  @mouseleave="operatorMouseLeave(element)"
                  :ref="element.id"
              >
                <span @click="elementRemoveClick(element)" class="remove"></span>
                <span>{{ renderElement(element) }}</span>
              </div>
            </template>
          </template>
        </draggable>


        <div class="formula-example">
          <div>
            <label style="font-weight: bold;">Preview</label>
          </div>
          <div class="mv2">
            <el-radio-group v-model="formulaPreviewType" size="large">
              <el-radio-button label="Numbers" />
              <el-radio-button label="Field Names" />
            </el-radio-group>
          </div>
          <div class="f6">
            <div v-if="formulaPreviewType === 'Numbers'">Numeric preview will assign a number value per field</div>
            <div v-else>Field Name preview will show field names preview</div>
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

  </div>
</template>

<script>
/* eslint-disable */
import {defineComponent} from 'vue';
// import NestedDraggable from './nested-draggable/index.vue'
import draggable from 'vuedraggable'
import FormulaItemBase from './components/formula-item-base/index.vue'
import {v4 as uuidv4} from 'uuid'
import { evaluate, parse} from 'mathjs'
import Tree from '@/shared/helpers/TreeNode'
import { create, all } from 'mathjs'
import { getFormulaExample, getFormulaString } from './helpers/formula-validation'
import { objectAttributes, calculatedFields, objectAttributeLabelById } from './helpers/object-attributes'
import { operators } from './constants'

const config = { }
const math = create(all, config)
window.math = math

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

const taroColorNames = ['kiwi', 'orange', 'raspberry', 'blueberry', 'lime', 'grape', 'sand']
const taroColors = taroColorNames.reduce((colors, name) => {
  colors.push(`var(--${name}-5)`)
  return colors
}, [])

export default defineComponent({
  name: 'CFBuilderComplex',
  components: {
    draggable,
    FormulaItemBase,
  },
  data() {
    return {
      availableBlockColors: taroColors,
      componentData: {
        "onUpdate:modelValue": this.inputChanged,
        modelValue: []
      },
      constantInputStyle: {width: '45px', textAlign: 'center'},
      currentGroupId: 0,
      drag: false,
      dragFieldOperators: false,
      formula: [],
      formulaPreviewType: 'Numbers',
      isValidFormula: {
        isValid: true,
        invalidReasons: []
      },
      calculatedFields,
      objectAttributes,
      operators: Object.freeze(operators),
      trashItems: [],

      usedBlockColors: [],
    }
  },
  computed: {
    allObjectAttributes() {
      return [...this.objectAttributes, ...this.calculatedFields]
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
      const formulaString = this.getFormulaString(this.formula, this.formulaPreviewType, this.objectAttributes)
      return getFormulaExample(formulaString, this.formulaPreviewType)
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
    // a zero value indicates that all operators are either + or -
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
  created() {
    this.buildReqObject(copiedData, )
  },
  methods: {
    handleDrag(evt) {
      switch(evt.type) {
        case 'dragover':
        
          break
        case 'dragenter':
          console.log('dragenter: ', evt)
          this.dragFieldOperators = false
          break
        case 'dragleave':
          console.log('dragleave: ', evt)
          break
      }
    },
    constantInput(evt, element) {
      const stepValue = 15
      const constantInputRef = this.$refs[`constant-input-${element.id}`]
      // el.styles.width = '45px'
      console.log(constantInputRef.$el.querySelector('input').style.width)
      console.log('constantInput: ', [Number(evt), evt.length, element, this.$refs[`constant-input-${element.id}`]])
      constantInputRef.$el.querySelector('input').style.width = `${evt.length + 8}ch`
    },
    // -----------------------------
    getChildren(args) {
      console.log('getChildren')
      console.log(args)
      const children = []
      args.forEach((arg, i) => {
        console.log(i)
        console.log(arg)

        if (arg.content) {
          console.log('has content')
          console.log(arg.content)
          this.getChildren(arg.content.args)
        }
        else {
          children[i] = arg
        }
      })
      return children
    },
    buildReqObject(node) {
      console.log(node)
      if (node.args) {
        console.log('call --> getChildren')
        const operands = this.getChildren(node.args)
        console.log(operands)
      }
      else {
        console.log(node)
      }

    },

    nestedLoop(obj) {
      const res = {};
      function recurse(obj, current) {
        for (const key in obj) {
          let value = obj[key];
          if(value !== undefined) {
            if (value && typeof value === 'object') {
              recurse(value, key);
            } else {
              // Do your stuff here to var value
              res[key] = value;
            }
          }
        }
      }
      recurse(obj);
      return res;
    },
    // ------------------

    buildNestedData(arr, parent, blockCount = 0) {
      let out = []
      for(let i in arr) {
        if (arr[i]?.block !== 'close') {
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
    getFormulaString,
    handleFieldOperatorEnd(evt) {
      this.dragFieldOperators = false
    },
    handleFieldOperatorStart(evt) {
      this.dragFieldOperators = true
      console.log('handleFieldOperatorStart: ', evt)
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
      console.log('handleFieldClick: ', [evt, element])
      // const formula-item = this.operators.find(op => op.value === value)
      this.formula.push({
        id: uuidv4(),
        groupId: 0,
        parentId: '0',
        valueType: 'object_attribute',
        value: element.id
      })
    },
    handleOperatorClick(evt, element) {
      const formulaObject = this.handleOperatorsClone({value: element.value, click: true})

      if (element.value === 'block_open_close') {
        formulaObject.forEach(obj => this.formula.push(obj))
      }
      else {
        this.formula.push(formulaObject)
      }
      console.log('handleOperatorClick: ', [element, formulaObject])
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
    handleOperatorsClone({click, value}) {
      console.log('handleOperatorsClone: ', value)
      const operator = this.operators.find(op => op.value === value)
      // 1 + ( 2 * ( 3 + 4 ) )  2 levels
      // 6 secondary Taro colors
      // random number for fields start a 1

      if (value === 'constant') {
        return {
          id: uuidv4(),
          parentId: '0',
          value: undefined,
          valueType: value
        }
      }
      else if (value === 'block_open_close') {
        console.log('handleOperatorsClone block_open_close: ', value, operator)
        const availableColors = this.availableBlockColors.reduce((acc, color) => {
          if (!this.usedBlockColors.includes(color)) acc.push(color)

          return acc
        }, [])


        const randomIndex = Math.floor(Math.random() * availableColors.length) + 1
        console.log(availableColors[randomIndex])

        this.usedBlockColors.push(availableColors[randomIndex])

        if (click) {
          const blockGroupId = uuidv4()
          const blockArr = [
            {
              backgroundColor: '#000', // colorGenRandom[randomIndex][randomColorIndex],
              block: 'open',
              blockGroupId,
              id: uuidv4(),
              parentId: '0',
              value: 'block_open',
              valueType: 'operator',
            },
            {
              backgroundColor: '#000', // colorGenRandom[randomIndex][randomColorIndex],
              block: 'close',
              blockGroupId,
              id: uuidv4(),
              parentId: '0',
              value: 'block_close',
              valueType: 'operator',
            }
          ]
          return blockArr
        }
        else {
          return {
            backgroundColor: availableColors[randomIndex],
            block: 'open',
            blockGroupId: uuidv4(),
            id: uuidv4(),
            parentId: '0',
            value: 'block_open',
            valueType: 'operator',
          }
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
        console.log('handleChange added: ', evt)
        // handle blocks
        if (typeof evt?.added?.element?.block && evt.added?.element?.block === 'open') {
          // console.log('handleChange: ', evt.added.element)
          const {element, newIndex} = evt.added
          const closeElement = JSON.parse(JSON.stringify(element))
          closeElement.value = 'block_close'
          closeElement.block = 'close'
          closeElement.id = uuidv4() // closeElement.id.replace('block_open__', 'block_close__')

          this.formula.splice(newIndex + 1, 0, closeElement)
        }
        else if (evt?.added?.element?.valueType === 'operator' || evt?.added?.element?.valueType === 'object_attribute' || evt?.added?.element?.valueType === 'constant') {
          const index = evt.added.newIndex
          const { element } = evt.added
          this.updateGroupBlockId(index)
          console.log('evt.added --> element: ', element)
          if (element.valueType === 'constant') {
            this.$nextTick(() => {
              console.log('all refs: ', this.$refs)
              console.log('constant ref: ', this.$refs[`constant-input-${element.id}`])
              this.$refs[`constant-input-${element.id}`].focus()
            })
          }
          console.log('change constant/object_attribute: ', {added: evt.added, index})
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
    handleStart() {
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
    objectAttributeLabelById,
    objectAttributeLabelById1(id) {
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
    elementMouseOver(element, type = '') {
      this.$refs[element.id].querySelector('span.remove').classList.add('active')
    },
    elementMouseLeave(element, type = '') {
      this.$refs[element.id].querySelector('span.remove').classList.remove('active')
    },
    elementRemoveClick(element) {
      // console.log('elementRemoveClick: ', element)
      let blockGroupId = 0
      const filteredFormula = this.formula.reduce((acc, item) => {
        console.log('item remove: ', item)
        if (item.block) {
          if (!blockGroupId) {
            blockGroupId = item.blockGroupId
          }
        }
        console.log('matching block: ', [
          blockGroupId, item.block, item.blockGroupId,
          (blockGroupId && item.block && item.blockGroupId !== blockGroupId)
        ])
        if (item.id !== element.id || (blockGroupId && item.block && item.blockGroupId !== blockGroupId)) acc.push(item)
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

    // update parent ids for blocks, operators, constants and object attributes
    updateGroupBlockId(index) {
      console.log('updateGroupBlockId: ', index)

      /*
      if the index is for a block object that has been moved
        Get matching block (open/close)
        assign the opening block id value to the parentId property of any element between open/close
      if this is a non-block element
        determine if the element is inside any block pair and assign the id of the opening block to the parentId of the element
        if the element currently has a parentId assign but is now no longer in any block pair, set the parentId to '0'
       */
      if (this.formula[index]?.block) {
        console.log('index belongs to a block that has been moved - find all elements between: ', this.formula[index])
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
    },
  }
})

// ----------- work files ------------- //

const copiedData = {
  implicit: false,
  isPercentage: false,
  op: '+',
  fn: 'add',
  args: [
    { value: 10 },
    {
      content: {
        implicit: false,
        isPercentage: false,
        op: '*',
        fn: 'multiply',
        args: [
          {
            content: {
              implicit: false,
              isPercentage: false,
              op: '*',
              fn: 'multiply',
              args: [ { value: 20 }, { value: 2 } ]
            }
          },
          { value: 0.75 }
        ]
      }
    }
  ]
}

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

const contentGroup = (node) => {
  // node
  switch(node.type) {
    case 'OperatorNode':
      console.log(node.type)
      break
    case 'ConstantNode':
      console.log(node.type)
      break
    case 'ParenthesisNode':
      console.log(node.type)
      // node
      contentGroup(node.content)
      break
  }
}
const NodeTypes = {
  OperatorNode: 'operation',
  ConstantNode: 'constant',
  ParenthesisNode: 'calculated_field_formula'
}

const outJson = {
  operation: '+',
  operands: [
    {
      position: 0,
      value: 10, // args[0]
      value_type: 'constant;'
    },
    {
      position: 1,
      value_type: 'calculated_field_formula',
      value: {
        operation: 'multiply',
        operands: [
          {
            position: 0, // args[0]
            value_type: 'calculated_field_formula',
            value: {
              operation: 'multiple',
              operands: [
                {
                  position: 0,
                  value: 20, // args[0]
                  value_type: 'constant'
                },
                {
                  position: 1,
                  value: 10, // args[0]
                  value_type: 'constant'
                },
              ]
            }
          },
          {
            position: 1, // args[1]
            value: 0.75,
            value_type: 'constant'
          }
        ]
      }
    }
  ]
}
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
  margin-top: 10px;
  padding: 10px;
  text-align: left;
}

.formula-item {
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
      z-index: 1;
    }
  }
  &.operator, &.constant {
    position: relative;
  }

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
    //background-color: #F3F4F6;
    position: relative;
    color: #42b983;



    //&:hover {
    //&:after {
    //
    //}
    //}
    & > span {

    }

    &.block {
      background-color: #F3F4F6;
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
      flex: 1;
      height: 600px;
      border-right: 1px solid #ccc;
      padding-right: 10px;
    }

    .formula-object-api {
      overflow-y: auto;
      flex: 1;
      height: 600px;
    }
  }

}

.sortable-chosen {
  background-color: var(--purple-3);
  border-radius: 5px;
  padding: 3px 5px;
  width: auto;
}
.sortable-drag {
  background-color: blue;
}

.sortable-ghost {
  opacity: 0.3;
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

  &.highlight {
    border-color: var(--purple-5);
    box-shadow: 5px 5px 5px rgb(0, 0, 0, 0.25);
    background-color: var(--purple-1);
  }

  input {
    padding: 5px 5px;
    border: 1px solid rgb(227, 227, 227);
    border-radius: 5px;
  }
  .object-attribute-item {
    margin-right: 5px;
    padding: 5px 10px;
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
    background-color: #F3F4F6;

    .remove {
      position: relative;
      right: -5px;
      cursor: pointer;
      padding: 0 5px;
      border-radius: 5px;

      &:hover {
        background-color: red;
        color: white
      }
    }
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
    background-color: white;
    width: 32px;
    height: 32px;
    text-align: center;
    vertical-align: middle;
    line-height: 2;
  }
}

.fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // border: 1px solid #ccc;
  //width: 200px;

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
      cursor: grab;
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

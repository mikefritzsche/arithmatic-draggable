<template>
  <div class="container">
    <div class="flex mv3 mr4">
      <div class="left-panel">

        <!-- operators -->
        <draggable
            class="operators-container flex"
            v-model="filteredOperators"
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
        <el-collapse>
          <el-collapse-item :title="`Calculated Fields (${calculatedFieldsCount})`">
            <draggable
              class="fields-container"
              v-model="calculatedFields"
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
              style="max-height: 300px; overflow-y: auto"
            >
              <template #item="{element}">
                <div
                  class="flex"
                  v-if="element.label"

                >
                  <div class="handle" style="flex: 3">
                    <div class="taro-icon--container">
                      <i class="ti taro-icon ti-feather-trending-up" style="width: 14px; height: 14px; -webkit-mask-size: 14px 14px;"></i>
                    </div>
                    <div>{{ element.label }}</div>
                  </div>
                  <div
                    style="flex: 1; text-align: right; cursor: pointer;"
                    @click="(event) => handleFieldClick(event, element)"
                  >+
                  </div>
                </div>
              </template>
            </draggable>
          </el-collapse-item>
          <el-collapse-item :title="`Account Fields ${objectAttributesCount}`" >
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
              style="max-height: 300px; overflow-y: auto"
            >
              <template #item="{element}">

                <div
                  class="flex"
                  v-if="element.local_label"
                >
                  <div class="handle" style="flex: 3">{{ element.local_label }}</div>
                  <div
                    style="flex: 1; text-align: right; cursor: pointer;"
                    @click="(event) => handleFieldClick(event, element)"
                  >+
                  </div>
                </div>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>

      </div>
      <div class="right-panel">
<!--        <div>(((Opportunity Amount + Bonus Amount) / (Count Of CMS + 1)) * 0.33)</div>-->

        <div style="text-align: right"><button :disabled="saveEnabled" type="submit">Save</button></div>
        <div>Drag: {{ activeDragFormulaElement?.block }}</div>
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
            @sort="onSort"
            @move="onMove"
            @start="handleStart"
            @change="handleChange"
            @dragover="handleDrag"
            @dragenter="handleDrag"
            @dragleave="handleDrag"
            :setData="setData"
        >
          <template #item="{element}">
            <template v-if="element.valueType === 'constant'">
              <div
                class="handle formula-item constant"
                @mouseover="elementMouseOver(element, 'constant')"
                @mouseleave="elementMouseLeave(element, 'constant')"
                :ref="element.id"
              >
                <span @click="elementRemoveClick(element)" class="remove">x</span>
                <el-input
                  class="constant-input"
                  resize="horizontal"
                  @input="(event) => constantInput(event, element)"
                  v-model="element.value"
                  style="{width: 65px}"
                  input-style="text-align: center;"
                  :ref="`constant-input-${element.id}`"
                />
              </div>
            </template>
            <template v-else-if="element.valueType === 'object_attribute'">
              <div
                class="handle object-attribute-item"
                @click="formulaElementClick(element)"
                :ref="element.id"
              >
                <span>{{ objectAttributeLabelById(element.value, allObjectAttributes) }}</span>
                <span @click="elementRemoveClick(element)" class="remove">x</span>
                <div
                  class="object-attribute-context-control"
                  tabindex="0"
                  :ref="`${element.valueType}-context__${element.id}`"
                >
                  <div>
                    <label>Preview Value</label>
                    <el-input @click.stop v-model="element.previewValue"/>
                    <i @click.stop="handleFocusOut(element)">x</i>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="handle formula-item operator"
                :class="{block: element.block, highlight: element.active}"
                :style="{color: element.backgroundColor, fontWeight: 'bold'}"
                @click="formulaElementClick(element)"
                @mouseover="operatorMouseOver(element, element.block ? 'block' : '')"
                @mouseleave="operatorMouseLeave(element, element.block ? 'block' : '')"
                :ref="element.id"
              >
                <span @click="elementRemoveClick(element)" class="remove">x</span>
                <div
                  class="operator-context-control"
                  tabindex="0"
                  @focusout="handleFocusOut(element)"
                  :ref="`${element.valueType}-context__${element.id}`"
                >
                  <div
                    v-for="operator in contextOperators"
                    :key="operator.label"
                    class="operator-context-item"
                    @click.stop="updateFormulaOperator(operator, element)"
                  >
                    <div>{{ operator.label }}</div>
                  </div>
                  <div class="operator-context-item trash" @click.stop="deleteFormulaOperator(element)">
                    <i>T</i>
                  </div>
                </div>
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

import NestedDraggable from './components/nested-draggable/index.vue'
import draggable from 'vuedraggable'
import FormulaItemBase from './components/formula-item-base/index.vue'
import {v4 as uuidv4} from 'uuid'
import { evaluate, parse} from 'mathjs'
import Tree from '@/shared/helpers/TreeNode'
import { create, all } from 'mathjs'
import { getFormulaExample, getFormulaString } from './helpers/formula-validation'
import {
  attributeMappings,
  objectAttributes,
  calculatedFields,
  objectAttributeLabelById
} from './helpers/object-attributes'
import { operators } from './constants'

import LeftPanel from '@/components/formula-builder-complex/components/left-panel/index.vue'
import FormulaPanel from '@/components/formula-builder-complex/components/formula-panel/index.vue'

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
/*
raspberry-1, raspberry-4
blueberry-1, blueberry-5
lime-1, lime-5
purple-1, purple-5
blue-1, blue-5
kiwi-1, kiwi-4
yellow-1, yellow-5
sand-1, sand-4
orange-1, orange-4
 */
const taroColorNames = ['kiwi', 'orange', 'raspberry', 'blueberry', 'lime', 'grape', 'sand', 'blue', 'yellow']
const taroColors = taroColorNames.reduce((colors, name) => {
  colors.push(`var(--${name}-4)`)
  return colors
}, [])

const taroColorGroups = {
  raspberry: [1, 4],
  blueberry: [1, 5],
  lime: [1, 5],
  purple: [1, 5],
  blue: [1, 5],
  kiwi: [1, 4],
  yellow: [1, 5],
  sand: [1, 4],
  orange: [1, 4],
}

export default defineComponent({
  name: 'CFBuilderComplex',
  components: {
    draggable,
    FormulaItemBase,
    FormulaPanel,
    LeftPanel,
  },
  data() {
    return {
      attributeMappings,
      blockMarkup: '<div class="formula-item operator block" style="color: var(--raspberry-3); font-weight: bold;"><span>( )</span></div>',
      ghostEl: {},
      ghostElTmp: {},
      activeDragElement: {},
      availableBlockColors: taroColors,
      componentData: {
        "onUpdate:modelValue": this.inputChanged,
        modelValue: []
      },
      constantInputStyle: {width: '45px', textAlign: 'center'},
      contextOperators: [],
      currentGroupId: 0,
      drag: false,
      dragFieldOperators: false,
      formulaFull: [
        {
          "backgroundColor": "var(--blueberry-3)",
          "block": "open",
          "blockGroupId": "ff590636-a695-4e0f-9b6c-f3c5d34ced2e",
          "id": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator",
          "active": false
        },
        {
          "active": false,
          "backgroundColor": "var(--raspberry-3)",
          "block": "open",
          "blockGroupId": "9ec70c12-bf24-4d4c-af8e-ec061ef35134",
          "children": [],
          "id": "532ee8bd-7bb4-4772-807f-5a2824213e2c",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "1c46fd5f-7e9f-49f3-8d5b-27461ed92108",
          "parentId": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "0c446d62-ae56-4694-ab11-b83e3f00c9cc",
          "parentId": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "1313f8a8-b89c-4468-a7ff-5915c2d2610a",
          "parentId": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "value": "2",
          "valueType": "constant"
        },
        {
          "active": false,
          "backgroundColor": "var(--raspberry-3)",
          "block": "close",
          "blockGroupId": "9ec70c12-bf24-4d4c-af8e-ec061ef35134",
          "id": "753cdf97-be36-4b0c-b3af-9daebc9b0072",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "id": "88eef4c3-f5fe-4ceb-bcfa-9faa28b2b7a9",
          "parentId": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "81509a67-411a-4f1f-89da-95090eec32c4",
          "parentId": "a87c53c1-020b-40d1-b462-f31e4a3a8cc8",
          "value": "3",
          "valueType": "constant"
        },
        {
          "backgroundColor": "var(--blueberry-3)",
          "block": "close",
          "blockGroupId": "ff590636-a695-4e0f-9b6c-f3c5d34ced2e",
          "id": "48c87455-8f49-4b77-90d2-0b15247251f8",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "id": "ce1c5225-8347-455f-bced-b4f4eb45286d",
          "parentId": "0",
          "value": "divide",
          "valueType": "operator"
        },
        {
          "id": "a20cf3cb-d1cc-44d7-aa88-779c773c2f0d",
          "parentId": "0",
          "value": "2",
          "valueType": "constant"
        }
      ],
      formula: [],
      formulaPreviewType: 'Numbers',
      isValidFormula: {
        isValid: true,
        invalidReasons: []
      },
      // calculatedFields,
      // objectAttributes,
      operators: Object.freeze(operators),
      trashItems: [],

      usedBlockColors: [],
    }
  },
  computed: {
    activeDragType() {
      if (!Object.keys(this.activeDragFormulaElement).length) return
      return this.activeDragFormulaElement.valueType
    },
    activeDragFormulaElement() {
      if (!Object.keys(this.activeDragElement).length) return
      console.log('activeDragFormulaElement: ', this.activeDragElement)
      return this.formula[this.activeDragElement.oldIndex]
    },
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

    calculatedFields() {
      return this.attributeMappings.filter(attribute => attribute.is_catalyst_cf)
    },
    calculatedFieldsCount() {
      return this.calculatedFields.length
    },
    objectAttributes() {
      return this.attributeMappings.filter(attribute => !attribute.is_catalyst_cf)
    },
    objectAttributesCount() {
      return this.objectAttributes.length
    },

    filteredOperators() {
      return operators
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

          console.log('block/index: ', p, i)
        }
      })
      // console.log('indexPairs: ', indexPairs)

      // console.log('all allBlocks: ', this.isValidFormula.isValid, allBlocks)

      return this.formula.reduce((acc, item, index) => {
        if (item.valueType === 'operator' && item.block) {
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
      const string = this.getFormulaString(this.formula, 'Numbers', this.objectAttributes)
      const formulaOperators = string.match(/[\+\-\/\*]/g)
      console.log('formula operators: ', string.match(/[\+\-\/\*]/g))
      return this.formula.reduce((acc, item) => {
        if (item.valueType === 'operator') {
          const operator = this.operators.find(op => {
            return op.value === item.value
          })
          // console.log('pemdasValue operator: ', operator)
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
        // console.log('valueClone: ', valueClone)
        const builtNestedData = this.buildNestedData(valueClone.filter(item => item?.block !== 'close', '0'), '0')

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
    setData(dataTransfer, dragEl) {
      const { element, index } = dragEl.__draggable_context
      console.log('setData: ', [dataTransfer, dragEl, element, element?.block, index])
      // this.blockMarkup
      this.ghostElTmp = dragEl.innerHTML
      if (element?.block) {
        dragEl.innerHTML = '( )' // this.blockMarkup
      }
    },
    handleDrag(evt) {
      switch(evt.type) {
        case 'dragover':
        
          break
        case 'dragenter':
          // console.log('dragenter: ', evt)
          this.dragFieldOperators = false // removes highlight
          break
        case 'dragleave':
          // console.log('dragleave: ', evt)
          break
      }

    },
    constantInput(evt, element) {
      const stepValue = 15
      const constantInputRef = this.$refs[`constant-input-${element.id}`]
      // el.styles.width = '45px'
      // console.log(constantInputRef.$el.querySelector('input').style.width)
      // console.log('constantInput: ', [Number(evt), evt.length, element, this.$refs[`constant-input-${element.id}`]])
      constantInputRef.$el.querySelector('input').style.width = `${evt.length + 4}ch`
    },
    // -----------------------------
    deleteFormulaOperator(element) {
      this.formula = this.formula.filter((f) => f.id !== element.id)
    },
    handleFocusOut(element) {
      // console.log('handleFocusOut: ', element)
      this.$refs[`${element.valueType}-context__${element.id}`]?.classList?.remove('active')
    },
    formulaElementClick(element) {
      console.log('operator click: ', [element, `${element.valueType}-context__${element.id}`])
      if (element.block) return
      const thisRef = this.$refs[`${element.valueType}-context__${element.id}`]

      if (element.valueType === 'operator') {
        this.contextOperators = this.operators.filter(
          (op) => op.value !== 'constant' && !op.value.includes('block') && op.value !== element.value
        )
        thisRef.classList.add('active')
        thisRef.focus()
      }
      else if (element.valueType === 'object_attribute') {
        thisRef.classList.add('active')
        // thisRef.focus()
      }
    },
    updateFormulaOperator(operator, element) {
      // console.log('updateFormulaOperator: ', [operator, element])
      element.value = operator.value
      this.handleFocusOut(element)
    },
    // ------------------

    getChildren(args) {
      // console.log('getChildren')
      // console.log(args)
      const children = []
      args.forEach((arg, i) => {
        // console.log(i)
        // console.log(arg)

        if (arg.content) {
          // console.log('has content')
          // console.log(arg.content)
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
        // console.log('call --> getChildren')
        const operands = this.getChildren(node.args)
        // console.log(operands)
      }
      else {
        // console.log(node)
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
      // console.log('handleFieldOperatorStart: ', evt)
    },
    handleOnAdd(evt) {
      // console.log('add: ', evt)
    },
    handleOnEnd(evt) {
      const { oldIndex, newIndex } = evt
      const { element, index } = evt.item.__draggable_context
      console.group('onEnd')
      console.log('evt, oldIndex, newIndex, element, index, activeDragFormulaElement: ', [
        evt, oldIndex, newIndex, element, index, this.activeDragFormulaElement
      ])

      if (element?.block) {
        const blockElements = this.formula.reduce((acc, item, index) => {
          if (item.block) acc[item.id] = {type: item.block, blockGroupId: item.blockGroupId, index, item}
          return acc
        }, {})
        console.log('blockElements: ', blockElements)
        console.log('element: ', [
          element.id,
          blockElements[element.id],
          element.blockGroupId
        ])

        this.ghostElTmp
          ? evt.item.innerHTML = this.ghostElTmp
          : null

        const currentBlockType = element.block
        const matchingBlock = this.formula.find(item => item?.block && item.block !== currentBlockType && item.blockGroupId === element.blockGroupId)
        matchingBlock.active = false

        if (element.block === 'open') {
          // check to see if open parenthesis is after closing
          let closeIndex = 0
          const closeBlock = this.formula.find((item, index) => {
            if (item?.block === 'close' && item.blockGroupId === element.blockGroupId) {
              closeIndex = index
              return true
            }
          })
          // is there a block element between the moved element and the matching block

          if (newIndex > closeIndex) {
            this.formula.splice(closeIndex, 1)
            this.formula.splice(newIndex, 0, closeBlock)
          }
        }
        else if (element.block === 'close') {
          // check to see if close parenthesis is before open
          // check to see if open parenthesis is after closing
          let openIndex = 0
          const openBlock = this.formula.find((item, index) => {
            if (item?.block === 'open' && item.blockGroupId === element.blockGroupId) {
              openIndex = index
              return true
            }
          })
          if (newIndex < openIndex) {
            this.formula.splice(openIndex, 1)
            this.formula.splice(newIndex, 0, openBlock)
          }
        }
      }
      this.drag = false
      this.activeDragElement = {}
    },
    handleFieldClick(evt, element) {
      // console.log('handleFieldClick: ', [evt, element])
      // const formula-item = this.operators.find(op => op.value === value)
      this.formula.push({
        id: uuidv4(),
        groupId: 0,
        parentId: '0',
        previewValue: 3,
        valueType: 'object_attribute',
        value: element.id
      })
    },
    handleOperatorClick(evt, element) {
      console.log('operatorClick: ', [evt, element])
      const formulaObject = this.handleOperatorsClone({value: element.value, click: true})

      if (element.value === 'block_open_close') {
        formulaObject.forEach(obj => this.formula.push(obj))
      }
      else {
        this.formula.push(formulaObject)
        if (element.value === 'constant') {
          this.$nextTick(() => {
            this.$refs[`constant-input-${formulaObject.id}`].focus()
          })
        }
      }
      // console.log('handleOperatorClick: ', [element, formulaObject])
    },
    handleFieldsClone({id, label}) {
      // console.log('handleFieldsClone value: ', id, label)

      // const formula-item = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        parentId: '0',
        previewValue: 3,
        valueType: 'object_attribute',
        value: id
      }
    },
    handleOperatorsClone({click, value}) {
      // console.log('handleOperatorsClone: ', value)
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

        function colorGen(colors) {
          const randomIndex = Math.floor(Math.random() * colors.length) + 1
          const newColor = colors[randomIndex]
          console.log([colors, newColor])
          return newColor
        }

        const blockColor = colorGen(availableColors)
        this.usedBlockColors.push(blockColor)

        if (click) {
          const blockGroupId = uuidv4()
          const blockArr = [
            {
              backgroundColor: blockColor,
              block: 'open',
              blockGroupId,
              id: uuidv4(),
              parentId: '0',
              value: 'block_open',
              valueType: 'operator',
            },
            {
              backgroundColor: blockColor,
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
            backgroundColor: blockColor,
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
      const { element, index } = evt.item.__draggable_context
      console.log('start: ', [evt, element, index])
      if (element.block) {
        const currentBlockType = element.block
        // find matching block item
        const matchingBlock = this.formula.find(item => item?.block && item.block !== currentBlockType && item.blockGroupId === element.blockGroupId)
        console.log('matchingBlock: ', matchingBlock)
        matchingBlock.active = true
      }
      this.activeDragElement = evt
      this.drag = true
    },
    onMove(evt) {
      console.log('onMove: ', evt)
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

    onSort(evt) {
      console.log('onSort: ', evt)
    },

    operatorMouseOver(element, type = '') {
      if (type === 'block') {
        const blockMatch = this.formula.find(item => item.block && item.blockGroupId === element.blockGroupId && item.block !== element.block)
        // console.log('block element mouse over: ', [element, element.backgroundColor, blockMatch, this.$refs[element.id]])
        this.$refs[element.id].style.backgroundColor = element.backgroundColor
        this.$refs[blockMatch.id].style.backgroundColor = element.backgroundColor
      }
    },
    operatorMouseLeave(element, type = '') {
      if (type === 'block') {
        const blockMatch = this.formula.find(item => item.block && item.blockGroupId === element.blockGroupId && item.block !== element.block)
        // console.log('block element mouse leave: ', [element, blockMatch, this.$refs[element.id]])
        this.$refs[element.id].removeAttribute('style')
        this.$refs[blockMatch.id].removeAttribute('style')
      }
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
        // console.log('item remove: ', item)
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
      const blockIndexes = this.formula.reduce((acc, item, index) => {
        if (item?.block === 'open') acc.push({...item, index})
        return acc
      }, [])
      console.log('blockIndexes: ', blockIndexes)

      /*
      if the index is for a block object that has been moved
        -- Get matching block (open/close)
        -- assign the opening block id value to the parentId property of any element between open/close
        -- find any elements that have a parent id of a block that is no longer in the block group
      if this is a non-block element
        determine if the element is inside any block pair and assign the id of the opening block to the parentId of the element
        if the element currently has a parentId assign but is now no longer in any block pair, set the parentId to '0'
       */
      if (this.formula[index]?.block) {
        const block = this.formula[index]
        const blockPair = this.formula.reduce((acc, item, formulaIndex) => {
          if (item?.block && item.blockGroupId === block.blockGroupId) {
            acc[item.block] = {
              blockGroupId: item.blockGroupId,
              id: item.id,
              index: formulaIndex,
              value: item,
              type: item.block,
              parentId: item.id
            }
          }
          return acc
        }, {open: {}, close: {}})
        const openIndex = blockPair.open.index
        const closeIndex = blockPair.close.index
        console.log('block: ', [block, blockPair, openIndex, closeIndex])
        console.log('index belongs to a block that has been moved - find all elements between: ', [index,this.formula[index]])

        this.formula.forEach((item, itemIndex) => {
          if (!item.block) {
            if (itemIndex > openIndex && itemIndex < closeIndex) {
              console.log('inside block: ', item.value, item.valueType, itemIndex, openIndex, closeIndex, itemIndex > openIndex, itemIndex < closeIndex)
              item.parentId = blockPair.open.id
            }
            else {
              console.log('remove parent id: ', )
              item.parentId = '0'
            }
          }
        })
      }
      else {
        console.log('item moved: ', this.formula[index])
        const blocks = this.formula.reduce((acc, item, blockIndex) => {
          if (item?.block) {
            acc.push({
              blockGroupId: item.blockGroupId,
              id: item.id,
              index: blockIndex,
              value: item,
              type: item.block,
              parentId: item.id
            })
          }
          return acc
        }, [])
        console.log('blocks/open/close: ', blocks)

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
]

const idMapping = data.reduce((acc, el, i) => {
  acc[el.id] = i
  return acc
}, {})

let root
data.forEach((el) => {
  // console.log('el: ', el.parentId)
  // Handle the root element
  if (el.parentId === null) {
    root = el
    return
  }

  // Use our mapping to locate the parent element in our data array
  const parentEl = data[idMapping[el.parentId]]
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el]
  // console.log('children: ', parentEl.children)
})

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
<style lang="scss">
.object-attribute-context-control {
  display: none;
  width: 130px;
  height: 45px;
  background-color: var(--gray-2);
  position: absolute;
  top: 40px;
  left: 0;
  text-align: left;

  i {
    position: absolute;
    width: 32px;
    height: 32px;
  }
  &.active {
    display: flex;
  }
}
.operator-context-control {
  width: 88px;
  height: 88px;
  background-color: var(--gray-10);
  position: absolute;
  top: 40px;
  left: 0px;
  display: none;
  padding: 8px;
  gap: 8px;
  flex-wrap: wrap;
  border-radius: 5px;

  &.active {
    display: flex;
  }

  .operator-context-item {
    width: 32px;
    height: 32px;
    background-color: var(--gray-2);
    border-radius: 5px;
    color: var(--gray-7);
    display: flex;
    justify-content: center;
    align-items: center;
    &.trash {
      background-color: var(--red-5);
    }
  }
}

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
      display: inline-block;
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 13px;
      border-radius: 12px;
      width: 20px;
      height: 20px;
      background-color: white;
      vertical-align: middle;
      line-height: 1.3;
      z-index: 1;
      border: 1px solid #ccc;
    }
  }
  &.operator, &.constant {
    position: relative;
    background-color: var(--gray-2);
  }

  &.constant {
    border-width: 0;
    .el-input.constant-input {
      .el-input__inner {
        border: 0 solid #ccc;
        width: 6ch;
        padding: 0;
      }

      .el-input__wrapper {
        padding: 1px 2px !important
      }
    }
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
    position: relative;
    color: var(--gray-7);

    &.block {
      background-color: #F3F4F6;
      &.block-highlight {
        background-color: var(--blue-1);
      }
      &.highlight {
        background-color: red;
      }
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
  //border: 1px solid #ccc;
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

  //input {
  //  padding: 5px 5px;
    //border: 1px solid rgb(227, 227, 227);
  //  border-radius: 5px;
  //}
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

.el-input__inner {
  border: none;
  padding: 0 5px;
}
.el-input__wrapper {
  padding: 1px 5px;
  background-color: transparent;
}
label {
  margin-top: var(--spacing-extra-small);
  margin-bottom: var(--spacing-small);
  align-items: flex-start;
  .el-radio__input {
    padding-top: 3px;
  }
  &.cf-radio-horizontal {
    margin-bottom: var(--spacing-none);
  }
  &:not(:first-child) {
    margin-bottom: var(--spacing-none);
  }
}

//label {
//  &.cf-radio-horizontal {
//    margin-bottom: var(--spacing-none);
//  }
//}
//label:not(:first-child) {
//  margin-bottom: var(--spacing-none);
//}
</style>

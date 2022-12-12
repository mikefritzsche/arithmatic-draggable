<template>
  <div class="right-panel">
    <!--        <div>(((Opportunity Amount + Bonus Amount) / (Count Of CMS + 1)) * 0.33)</div>-->

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
                input-style="text-align: center; border: none"
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

    <div class="object-data-types pb6" style="text-align: left">
      <label>Select data types:</label>
      <el-select>
        <el-option>Currency</el-option>
        <el-option>Percent</el-option>
      </el-select>
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
</template>

<script>
import Draggable from 'vuedraggable'
import {getFormulaExample, getFormulaString} from '@/components/formula-builder-complex/helpers/formula-validation'
import {v4 as uuidv4} from "uuid";
import { objectAttributes, calculatedFields, objectAttributeLabelById } from '@/components/formula-builder-complex/helpers/object-attributes'
import { operators } from '@/components/formula-builder-complex/constants'

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

export default {
  name: 'FormulaPanel',
  components: {
    Draggable
  },
  data() {
    return {
      drag: false,
      formula: [],
      formulaPreviewType: 'Numbers',
    }
  },
  computed: {
    allObjectAttributes() {
      return [...objectAttributes, ...calculatedFields]
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

    blocksCount() {
      const blocksLength = this.formula.filter(item => item.valueType === 'operator' && (item.value.includes('block')))?.length
      return blocksLength > 0 ? blocksLength / 2 : blocksLength
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

      return formulaIds
    },
    operatorCount() {
      return this.formula.filter(item => item.valueType === 'operator' && !item.value.includes('block'))?.length
    },

    // Calculate operator values based on PEMDAS/BEDMAS priority
    // a zero value indicates that all operators are either + or -
    pemdasValue() {
      return this.formula.reduce((acc, item) => {
        if (item.valueType === 'operator') {
          const operator = operators.find(op => {
            return op.value === item.value
          })
          console.log('pemdasValue operator: ', operator)
          acc += operator.pemdasNumber
        }
        return acc
      }, 0)
    }
  },
  methods: {
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
    constantInput(value, element) {
      const stepValue = 15
      const constantInputRef = this.$refs[`constant-input-${element.id}`]
      // el.styles.width = '45px'
      console.log(constantInputRef.$el.querySelector('input').style.width)
      console.log('constantInput: ', [Number(value), value?.length, element, this.$refs[`constant-input-${element.id}`]])
      constantInputRef.$el.querySelector('input').style.width = `${(value?.length || 0) + 8}ch`
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
    getFormulaString,
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
    inputChanged(evt) {
      // console.log('inputChanged: ', evt)
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
              this.constantInput(undefined, element)
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

    handleDrop(ev) {
      // console.log('handleDrop: ', ev)
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
    log(event) {
      console.log(event)
    },
    modelValue(element) {
      // console.log('modelValue: ', element)
      return this.formula.find(item => item.id === element.id).value // this.formula.find(item => item."
    },
    objectAttributeLabelById,

    operatorMouseOver(element) {
      this.$refs[element.id].querySelector('span.remove').classList.add('active')
    },
    operatorMouseLeave(element) {
      this.$refs[element.id].querySelector('span.remove').classList.remove('active')
    },
    renderElement(element) {
      // console.log('renderElement: ', element)
      if (element.valueType === 'operator') {
        const operator = operators.find(op => op.value === element.value)
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
}
</script>

<style scoped>

</style>
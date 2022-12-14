<template>
  <div class="row">
    <div class="el-col-4">
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
    <div class="el-col-8">
      <h3>Nested draggable</h3>
      <nested-draggable
        :parent="true"
        :tasks="formula"
        @update:context-operators="updateContextOperators"
      />
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import NestedDraggable from './components/nested-draggable/index.vue'
import {
  calculatedFields,
  objectAttributeLabelById,
  objectAttributes
} from "@/components/formula-builder-complex/helpers/object-attributes";
import {operators} from "@/components/formula-builder-complex/constants";
import {getFormulaString} from "@/components/formula-builder-complex/helpers/formula-validation";
import {v4 as uuidv4} from "uuid";

export default {
  name: "builder-nested",
  display: "Nested",
  order: 15,
  components: {
    Draggable,
    NestedDraggable
  },
  data() {
    return {
      calculatedFields,
      objectAttributes,
      operators: Object.freeze(operators),
      formula: [
        // {
        //   name: "task 1",
        //   tasks: [
        //     {
        //       name: "task 2",
        //       tasks: []
        //     }
        //   ]
        // },
        // {
        //   name: "task 3",
        //   tasks: [
        //     {
        //       name: "task 4",
        //       tasks: []
        //     }
        //   ]
        // },
        // {
        //   name: "task 5",
        //   tasks: []
        // }
      ]
    };
  },
  methods: {
    updateContextOperators(value) {
      this.contextOperators = value
    },
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
      console.log('updateFormulaOperator: ', [operator, element])
      element.value = operator.value
      this.handleFocusOut(element)
    },
    // ------------------

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
        previewValue: 3,
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
        parentId: '0',
        previewValue: 3,
        tasks: [],
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
          name: value,
          tasks: [],
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
        name: value,
        tasks: [],
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
      console.log('modelValue: ', [this.formula, element])
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
};
</script>
<style scoped></style>
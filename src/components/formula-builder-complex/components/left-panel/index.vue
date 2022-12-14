<template>
<div>
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
          :data-element="JSON.stringify(element)"
          @click="(event) => handleOperatorClick(event, element)"
      >{{ element.label }}</span>
    </template>
  </draggable>

  <!-- fields -->
  <el-input
      class="flex-auto w-100"
      placeholder="Search Fields..."
  >
    <template #prepend>

      <taro-icon
          namespace="feather"
          width="14"
          height="14"
          name="search"
          class="mr2"
          :color="'var(--gray-8)'"
      />

    </template>
  </el-input>
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
</template>

<script>
import Draggable from 'vuedraggable'
import {v4 as uuidv4} from 'uuid'

import { objectAttributes, calculatedFields, objectAttributeLabelById } from '../../helpers/object-attributes'
import {operators} from '@/components/formula-builder-complex/constants'

const taroColorNames = ['kiwi', 'orange', 'raspberry', 'blueberry', 'lime', 'grape', 'sand']
const taroColors = taroColorNames.reduce((colors, name) => {
  colors.push(`var(--${name}-5)`)
  return colors
}, [])

export default {
  name: 'LeftPanel',
  components: {
    Draggable
  },
  data() {
    return {
      calculatedFields,
      objectAttributes,
      operators: Object.freeze(operators),
      availableBlockColors: taroColors,
      usedBlockColors: [],
    }
  },
  computed: {},
  methods: {
    handleFieldClick(evt, element) {
      // const formula-item = this.operators.find(op => op.value === value)
      this.formula.push({
        id: uuidv4(),
        groupId: 0,
        parentId: '0',
        valueType: 'object_attribute',
        value: element.id
      })
    },
    handleFieldsClone({id, label}) {
      // console.log('handleFieldsClone value: ', id, label)

      // const formula-item = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        blockGroupId: '0',
        parentId: '0',
        valueType: 'object_attribute',
        value: id
      }
    },
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
    handleOperatorClick(evt, element) {
      const formulaObject = this.handleOperatorsClone({...element, click: true})

      if (element.value === 'block_open_close') {
        formulaObject.forEach(obj => this.formula.push(obj))
      }
      else {
        this.formula.push(formulaObject)
        console.log('handleOperatorClick --> this.formula: ', this.formula)
        this.$nextTick(() => {
          this.constantInput(undefined, formulaObject)
          this.$refs[`constant-input-${formulaObject.id}`].focus()
        })
      }
      console.log('handleOperatorClick: ', [element, formulaObject])
    },
    handleOperatorsClone({value, valueType, click}) {
      console.log('handleOperatorsClone: ', value, valueType, click)

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
  }
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  width: 100%;
}

</style>
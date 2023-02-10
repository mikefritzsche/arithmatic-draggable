<template>
  <draggable
    class="flex dragArea"
    tag="div"
    :list="formula"
    :group="{ name: 'formula', put: canAddElement }"
    @change="onChange"
    @start="drag = true; $emit('formula-drag', true)"
    @end="drag = false; $emit('formula-drag', false)"
    :animation="300"
    item-key="id"

  >
    <template #item="{ element, index }">
      <div
        class="flex items-center formula-item"
        :data-id="element.id"
      >
        <template v-if="element?.block">
          <div class="drag-handle" style="display:flex; align-items: center;">
            <div
              class="operator"
              @mouseenter="($event) => onMouseEvent($event, element)"
              @mouseleave="($event) => onMouseEvent($event, element)"
              :ref="`block-open-${element.id}`"
            >
              <div
                @click.stop="($event) => operatorRemove($event, element)"
                class="operator-remove"
              >x
              </div>
              <span>(</span>
            </div>
            <nested-draggable
              class="block child"
              :child="true"
              :formula="element.children"
              :level="localLevel"
            />
            <div
              class="operator"
              @mouseenter="($event) => onMouseEvent($event, element)"
              @mouseleave="($event) => onMouseEvent($event, element)"
              :ref="`block-close-${element.id}`"
            >
              <div @click.stop="($event) => operatorRemove($event, element)" class="operator-remove">x</div>
              <span>)</span>
            </div>
          </div>
        </template>
        <template v-else-if="element.valueType === 'operator'">
          <formula-operator
            :ref="getRef(element)"
            :context-operators="contextOperators"
            :element="element"
            :index="index"
            @delete-formula-operator="deleteFormulaOperator"
            @operator-click="operatorClick"
            @update-formula-operator="updateFormulaOperator"
          />

        </template>
        <template v-else-if="element.valueType === 'constant'">
          <div
            class="handle formula-item constant"
            @mouseenter="($event) => onMouseEvent($event, element)"
            @mouseleave="($event) => onMouseEvent($event, element)"
            :ref="`${element.valueType}-${element.id}`"
          >
            <span @click.stop="() => elementRemoveClick(element)" class="remove">x</span>
            <el-input
              class="constant-input"
              resize="horizontal"
              v-model="element.value"
              style="{width: 65px}"
              input-style="text-align: center;"
              :ref="`constant-input-${element.id}`"
              @mouseover="($event) => onMouseEvent($event, element)"
            />
          </div>
        </template>
        <template v-else-if="element.valueType === '1object_attribute'">
          <div class="drag-handle ph3" style="height: 30px; background-color: #e3e3e3; border: 1px solid #ccc">
            {{ objectAttributeLabelById(element.value) }}
          </div>
        </template>

        <template v-else-if="element.valueType === 'object_attribute'">
          <div
            class="handle object-attribute-item"
            @click="formulaElementClick(element)"
            :ref="element.id"
          >
            <span v-if="element.value && !element.active">{{
                objectAttributeLabelById(element.value, attributeMappings)
              }}</span>
            <span v-else-if="!element.value && !element.active">{{ element.value ?? 'select' }}</span>
            <el-select
              v-else-if="!element.value || (element.value && element.active)"
              v-model="element.value"
              filterable
              @change="() => handleFocusOut(element)"
            >
              <el-option
                v-for="attribute in attributeMappings"
                :key="attribute.id"
                :label="attribute.local_label"
                :value="attribute.id"
              />
            </el-select>
            <span @click="elementRemoveClick(element)" class="remove">x</span>
            <div
              class="object-attribute-context-control"
              tabindex="0"
              :ref="`${element.valueType}-context__${element.id}`"
            >
              <el-select
                v-model="element.value"
                filterable
                @change="() => handleFocusOut(element)"
              >
                <el-option
                  v-for="attribute in attributeMappings"
                  :key="attribute.id"
                  :label="attribute.local_label"
                  :value="attribute.id"
                />
              </el-select>
              <i @click.stop="handleFocusOut(element)">x</i>
              <!--                  <div>-->
              <!--                    <label>Preview Value</label>-->
              <!--                    <el-input @click.stop v-model="element.previewValue"/>-->
              <!--                    <i @click.stop="handleFocusOut(element)">x</i>-->
              <!--                  </div>-->
            </div>
          </div>
        </template>

      </div>
    </template>
  </draggable>
</template>
<script>
import {operators} from '@/constants'
import draggable from 'vuedraggable'
import {cloneDeep} from 'lodash'

import FormulaOperator from '@/components/nested-simple/components/formula-operator/index.vue'

import {
  attributeMappings,
  objectAttributeLabelById
} from '@/helpers/object-attributes'

const filteredMappings = attributeMappings.filter(attribute => attribute?.object_class_id === 'ae907ed3-b6c6-4fdc-a948-0bac811c2c08')
import {uniqueId} from 'lodash'

export default {
  name: "nested-draggable",
  props: {
    child: {
      type: Boolean,
      default: false,
    },
    formula: {
      required: true,
      type: Array
    },
    level: {
      type: Number,
      default: 0
    },
    objectAttributes: {
      type: Object,
      required: true
    },
    parent: {
      type: [Object, undefined],
      default: undefined
    }
  },
  components: {
    draggable,
    FormulaOperator,
  },
  data() {
    return {
      attributeMappings: filteredMappings.slice(0, 30),
      contextOperators: [],
      drag: false,
      localLevel: 0,
      operators: Object.freeze(operators),
    }
  },
  computed: {
    allObjectAttributes() {
      return [...this.objectAttributes, ...this.calculatedFields]
    },
    calculatedFields() {
      return this.attributeMappings.filter(attribute => attribute.is_catalyst_cf)
    },
    // objectAttributes() {
    //   return this.attributeMappings.filter(attribute => !attribute.is_catalyst_cf)
    // },
    myList: {
      get() {
        return this.$store.state.myList
      },
      set(value) {
        this.$store.commit('updateList', value)
      }
    }
  },
  watch: {
    drag(bool) {
      console.log('nested-simple drag: ', bool)
    }
  },
  created() {
    if (this.child) {
      this.localLevel = this.level + 1
    }
  },
  methods: {
    getRef(element) {
      return `${element.id}`
    },
    getChildRef(refId) {
      return this.$refs[refId]
    },
    // :group="{ name: 'instruction-element', put: (toSortable, fromSortable, draggedElement) => topLevelContainerFilter(toSortable, fromSortable, draggedElement) }"

    canAddElement(toSortable, fromSortable, draggedElement) {
      // console.log('canAddElement: ', [toSortable, fromSortable, draggedElement])
      return true
    },
    deleteFormulaOperator({index, element}) {
      console.log('deleteFormulaOperator: ', [index, element])
      const formula = this.formula
      formula.splice(index, 1)
    },
    elementRemoveClick(index, element) {
      console.log('elementRemoveClick: ', [index, element])
      const formula = this.formula
      formula.splice(index, 1)
    },
    formulaElementClick(element) {
      // console.log('formulaElementClick click: ', [element, element.valueType, `${element.valueType}-context__${element.id}`.split(element.valueType), `${element.valueType}-context__${element.id}`])
      if (element.block) return
      const thisRef = this.$refs[`${element.valueType}-context__${element.id}`]

      if (element.valueType === 'operator') {
        this.contextOperators = this.operators.filter(
          (op) => op.value !== 'constant' && !op.value.includes('block') && op.value !== element.value
        )
        thisRef.classList.add('active')
        thisRef.focus()
      } else if (element.valueType === 'object_attribute') {
        // thisRef.classList.add('active')
        element.active = true
        // thisRef.focus()
      }
    },
    handleFocusOut(element, ref = undefined) {
      if (element.valueType === 'object_attribute') {
        element.active = false
      } else {
        console.log('handleFocusOut: ', element)
        if (ref) {
          ref.classList?.remove('active')
        } else {
          this.$refs[`${element.valueType}-context--${element.id}`]?.classList?.remove('active')
        }
      }
    },
    updateFormulaOperator({index, operator, element}) {
      console.log('updateFormulaOperator: ', [index, operator, element])
      const formula = this.formula
      const {label, value} = operator
      element = {...element, label, value}

      formula.splice(index, 1, element)
      const parentChild = this.getChildRef(`${element.id}`)
      const thisRef = parentChild.$refs[`${element.valueType}-context--${element.id}`]
      this.handleFocusOut(element, thisRef)
    },

    isBlock(element) {
      return element.block
    },
    objectAttributeLabelById,
    onChange(evt) {
      console.log('formula onChange: ', evt)
    },
    onClone(evt) {
      console.log('clone: ', evt)
    },
    onMouseEvent(evt, element) {
      console.log('mouse event: ', [evt.type, element])
      const target = evt.target
      if (this.drag) return
      // console.log('onMouseEvent: ', [
      //   this.drag,
      //   evt, evt.type, element, target
      // ])
      if (evt.type === 'mouseenter') {
        if (element.block) {
          const blockOpenRef = this.$refs[`block-open-${element.id}`]
          const blockCloseRef = this.$refs[`block-close-${element.id}`]

          target.querySelector('.operator-remove').classList.add('active')
          blockOpenRef.style.backgroundColor = 'red'
          blockCloseRef.style.backgroundColor = 'red'
        } else if (!element.block && element.valueType === 'operator') {
          const operatorRef = this.$refs[`operator-${element.id}`]
          operatorRef.querySelector('.operator-remove').style.display = 'block'
        } else if (element.valueType === 'constant') {
          const ref = this.$refs[`${element.valueType}-${element.id}`]
          console.log('constqant ref: ', ref)
          ref.querySelector('.remove').classList.add('active')
        }
      } else if (evt.type === 'mouseleave') {
        if (element.block) {
          const blockOpenRef = this.$refs[`block-open-${element.id}`]
          const blockCloseRef = this.$refs[`block-close-${element.id}`]
          target.querySelector('.operator-remove').classList.remove('active')
          blockOpenRef.removeAttribute('style')
          blockCloseRef.removeAttribute('style')
        } else if (!element.block && element.valueType === 'operator') {
          const operatorRef = this.$refs[`operator-${element.id}`]
          operatorRef.querySelector('.operator-remove').removeAttribute('style')
        } else if (element.valueType === 'constant') {
          const ref = this.$refs[`${element.valueType}-${element.id}`]
          console.log('constqant ref: ', ref)
          ref.querySelector('.remove').classList.remove('active')
        }
      }
    },

    operatorClick(element) {
      const parentChild = this.getChildRef(`${element.id}`)
      const thisRef = parentChild.$refs[`${element.valueType}-context--${element.id}`]

      if (element.valueType === 'operator') {
        this.contextOperators = this.operators.filter(
          (op) => op.valueType !== 'constant' && op.valueType !== 'block' && op.value !== element.value
        )
        thisRef.classList.add('active')
        thisRef.focus()
      }
    },
    operatorRemove(index, element) {

      const {id} = element
      let formula = cloneDeep(this.formula)

      function filterFormulaElements(item, id, parent = null) {
        console.log('getNestedBlock formula: ', [item, id, parent])
        return formula.reduce((acc, child, index) => {
          console.log('child: ', [id, child.id, child, index, parent])
          if (child.children) {
            acc.push(filterFormulaElements(child, id, child.id))
          } else {
            acc.push(child)
          }
          return acc
        }, [])
      }

      function findParentBlock(col, id, blockLevel = 0, parent = null) {
        let i, temp;
        for (i = 0; i < col.length; i++) {
          if (col[i].id === id) {
            return {blockLevel, parent, children: col[i].children, item: col[i]}
          }
          if (col[i]?.children?.length > 0) {
            blockLevel++
            temp = findParentBlock(col[i].children, id, blockLevel, col[i].id); // store result
            if (temp) {                           // check
              return temp;                      // return result
            }
          }
        }
        return null;
      }

      const removeElement = (formula, id) => {
        console.log('formula in removeElement: ', formula)
        formula.forEach((formulaItem, i) => {
          console.log('formulaItem in forEach: ', [formulaItem, i])
          if (formulaItem.id === id) {
            formula.splice(i, 1, ...formulaItem.children)
          } else {
            removeElement(formulaItem.children, id)
          }
        })

        console.log(formula)
        return formula
      };
      console.log('id: ', id)
      console.log('formula: ', formula)
      const newFormula = removeElement(cloneDeep(formula), id)
      // console.log('formula/newFormula: ', [formula, newFormula])

      // let blockLevel = 0
      // const findBlock = findParentBlock(formula, id, blockLevel)
      // console.log('findBlock: ', findBlock)
      // let nestedLevel = 0
      // formula.forEach((item) => {
      //   if (item.children && item.id !== findBlock.parent && nestedLevel !== findBlock.blockLevel-1) {
      //     console.log(`go deeper from ${nestedLevel}`)
      //     nestedLevel++
      //     item.children.forEach(child => {
      //       if (child.children && child.id !== findBlock.parent && nestedLevel !== findBlock.blockLevel-1) {
      //         console.log(`go deeper from ${nestedLevel}`)
      //         nestedLevel++
      //       }
      //       else if (child.children && child.id === findBlock.parent && nestedLevel === findBlock.blockLevel-1) {
      //         console.log('found parent')
      //         child.children.splice(0, 1)
      //         child.children = [...findBlock.children, ...child.children]
      //       }
      //     })
      //   }
      // })
      console.log('newFormula: ', newFormula)
      console.log('emit: ', formula)
      this.$emit('update-formula', formula)
    }
  }
}
</script>
<style lang="scss">
.el-input__inner {
  width: 65px
}
</style>
<style scoped lang="scss">
.object-attribute-item {
  margin-right: 5px;
  padding: 5px 10px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  background-color: #F3F4F6;
  display: flex;
  align-items: center;

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
  z-index: 1;

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

.sortable-chosen {
  &.formula-item {
    .operator {
      opacity: 0.3;
    }
  }
}

.draggable-ghost {
  &.formula-item {
    .operator {
      outline: 1px solid red;
    }
  }
}

.operator-remove {
  display: none;
  position: absolute;
  top: -8px;
  right: -10px;
  border: 1px solid #ccc;
  padding: 0 5px;
  border-radius: 8px;
  background-color: white;

  &.active {
    display: block;
  }
}

.drag-handle {
  cursor: pointer;
}

.sortable-drag {
  background-color: white;
}

.sortable-ghost {
  background-color: white;
}

.dragArea {
  min-height: 50px;
  outline: 1px solid #ccc;
  border-radius: 5px;
  align-items: center;
  gap: 8px;

  &.child {
    outline: 0px;
    //gap: 8px;

    &.block {
      min-height: 30px;
      min-width: 30px;
      margin-right: 10px;
      margin-left: 5px;

      &:hover {
        //border: 1px dashed;
      }
    }
  }
}

:deep(.formula-item) {
  .remove {
    display: none;
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: 0;
    font-size: 13px;
    border-radius: 12px;
    width: 20px;
    height: 20px;
    background-color: white;
    vertical-align: middle;
    line-height: 1.3;
    z-index: 1;
    border: 1px solid #ccc;

    &.active {
      display: inline-block;
    }
  }

  &.constant {
    position: relative;

    .remove {

    }
  }

  .operator {
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
    box-sizing: border-box;

    &.sortable-ghost {
      background-color: transparent;
    }

    &.sortable-drag {
      background-color: transparent;
    }
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
  z-index: 1;

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
</style>
<template>
  <div>
    <!--
    { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    -->
    <sortable
      class="flex dragArea"
      tag="div"
      :list="formula"
      :group="{ name: 'formula' }"
      @change="onChange"
      @start="drag = true; $emit('formula-drag', true)"
      @end="drag = false; $emit('formula-drag', false)"
      :animation="300"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="formula-item" style="display: flex; align-items: center">
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
              <sortable-nested-draggable
                class="block child"
                :child="true"
                :formula="element.children"
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

            <div
              class="operator drag-handle"
              @mouseenter="($event) => onMouseEvent($event, element)"
              @mouseleave="($event) => onMouseEvent($event, element)"
              :ref="`operator-${element.id}`"
            >
              <div
                @click.stop="($event) => operatorRemove($event, element)"
                class="operator-remove"
              >x
              </div>
              <span>{{ element.label }}</span>
            </div>
          </template>
          <template v-else-if="element.valueType === 'constant'">
            <el-input
              class="constant-input"
              resize="horizontal"
              v-model="element.value"
              style="{width: 65px}"
              input-style="text-align: center;"
              :ref="`constant-input-${element.id}`"
            >
              <template #suffix>
                <div class="drag-handle" style="font-weight: 900; cursor:pointer; width: 30px">::</div>
              </template>
            </el-input>
          </template>
          <templae v-else-if="element.valueType === 'object_attribute'">
            <div class="drag-handle ph3" style="height: 30px; background-color: #e3e3e3; border: 1px solid #ccc">
              {{ objectAttributeLabelById(element.value) }}
            </div>
          </templae>
        </div>
      </template>
    </sortable>
    <draggable
      v-if="false"
      class="flex dragArea"
      tag="div"
      :list="formula"
      :group="{ name: 'formula' }"
      @change="onChange"
      @start="drag = true; $emit('formula-drag', true)"
      @end="drag = false; $emit('formula-drag', false)"
      :animation="300"
      item-key="id"

    >
      <template #item="{ element }">
        <div class="formula-item" style="display: flex; align-items: center">
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

            <div
              class="operator drag-handle"
              @mouseenter="($event) => onMouseEvent($event, element)"
              @mouseleave="($event) => onMouseEvent($event, element)"
              :ref="`operator-${element.id}`"
            >
              <div
                @click.stop="($event) => operatorRemove($event, element)"
                class="operator-remove"
              >x
              </div>
              <span>{{ element.label }}</span>
            </div>
          </template>
          <template v-else-if="element.valueType === 'constant'">
            <el-input
              class="constant-input"
              resize="horizontal"
              v-model="element.value"
              style="{width: 65px}"
              input-style="text-align: center;"
              :ref="`constant-input-${element.id}`"
            >
              <template #suffix>
                <div class="drag-handle" style="font-weight: 900; cursor:pointer; width: 30px">::</div>
              </template>
            </el-input>
          </template>
          <templae v-else-if="element.valueType === 'object_attribute'">
            <div class="drag-handle ph3" style="height: 30px; background-color: #e3e3e3; border: 1px solid #ccc">
              {{ objectAttributeLabelById(element.value) }}
            </div>
          </templae>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script>
import SortableJs from 'sortablejs'
import { MultiDrag } from 'sortablejs/modular/sortable.core.esm'
SortableJs.mount(new MultiDrag())
import { Sortable } from 'sortablejs-vue3'
import draggable from 'vuedraggable'
import {cloneDeep} from 'lodash'

import {
  objectAttributeLabelById
} from '@/helpers/object-attributes'

export default {
  name: "sortable-nested-draggable",
  props: {
    child: {
      type: Boolean,
      default: false,
    },
    formula: {
      required: true,
      type: Array
    },
    objectAttributes: {
      type: Object,
      required: true
    }
  },
  components: {
    draggable,
    Sortable
  },
  data() {
    return {
      drag: false
    }
  },
  watch: {
    drag(bool) {
      console.log('nested-simple drag: ', bool)
    }
  },
  methods: {
    onClone(evt) {
      console.log('clone: ', evt)
    },
    isBlock(element) {
      return element.block
    },
    objectAttributeLabelById,
    onChange(evt) {
      console.log('formula onChange: ', evt)
    },
    onMouseEvent(evt, element) {
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
        }
        else if (!element.block && element.valueType === 'operator') {
          const operatorRef = this.$refs[`operator-${element.id}`]
          operatorRef.querySelector('.operator-remove').style.display = 'block'
        }
      }
      else if (evt.type === 'mouseleave') {
        if (element.block) {
          const blockOpenRef = this.$refs[`block-open-${element.id}`]
          const blockCloseRef = this.$refs[`block-close-${element.id}`]
          target.querySelector('.operator-remove').classList.remove('active')
          blockOpenRef.removeAttribute('style')
          blockCloseRef.removeAttribute('style')
        }
        else if (!element.block && element.valueType === 'operator') {
          const operatorRef = this.$refs[`operator-${element.id}`]
          operatorRef.querySelector('.operator-remove').removeAttribute('style')
        }
      }
    },

    operatorRemove(event, element) {
      const {id} = element

      function getNestedBlocks(item, id, parent = null) {
        console.log('getNestedBlock formula: ', [item, id, parent])
        if (item.children) {
          getNestedBlocks(item.children, id, item.id)
        }
        else {
          console.log('item: ', item, id, parent)
        }
      }

      let formula = cloneDeep(this.formula)
      console.log('element block remove formula: ', formula)
      if (element.block) {
        console.log('operatorRemove: ', element)
        // formula.forEach((item, index) => {
        //   console.log('forEach: ', item.id, element.id, index)
        //   if (item.id === element.id) {
        //     const children = item.children
        //     console.log('found block item: ', [item.id, element.id, item, element, index])
        //   }

        // })
        // const blockParents = this.formula.reduce((acc, item, index) => {
        //   if (item.block) {
        //     console.log('item.id: ', item.id)
        //     // console.log('found block, not selected block: ', index)
        //   }
        //   return acc
        // }, [])

        console.log('block operatorRemove: ', [event, element.id, this.formula, element])
      }
      else {

        console.log('operatorRemove: ', [id, event, element.id, this.formula, element])
      }
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

.formula-item {
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
</style>
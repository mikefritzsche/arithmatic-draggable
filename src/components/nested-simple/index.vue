<template>
  <draggable
    style="display: flex;"
    class="dragArea"
    tag="div"
    :list="formula"
    :group="{ name: 'formula' }"
    :animation="150"
    @change="onChange"
    :swap-threshhold="0.1"
    item-key="id"
    handle=".drag-handle"

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
              <div @click.stop="($event) => operatorRemove($event, element)" class="operator-remove">x</div>
              <span>(</span>
            </div>
            <nested-draggable class="block child" :formula="element.children" />
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
          <span class="operator drag-handle">{{ element.label }}</span>
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
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: "nested-draggable",
  props: {
    formula: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  },

  methods: {
    isBlock(element) {
      return element.block
    },
    onChange(evt) {
      console.log('formula onChange: ', evt)
    },
    onMouseEvent(evt, element) {
      const target = evt.target
      if (evt.type === 'mouseenter') {
        if (element.block) {
          const blockOpenRef = this.$refs[`block-open-${element.id}`]
          const blockCloseRef = this.$refs[`block-close-${element.id}`]

          target.querySelector('.operator-remove').classList.add('active')
          blockOpenRef.style.backgroundColor = 'red'
          blockCloseRef.style.backgroundColor = 'red'
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
      }
      console.log('onMouseEvent: ', [evt, evt.type, element, target, this.$refs[`block-open-${element.id}`], this.$refs[`block-close-${element.id}`]])
    },

    operatorRemove(event, element) {
      function getNestedBlocks(values, parent = null) {
        if (values.children) {
          getNestedBlocks(values.children, )
        }
      }
      if (element.block) {
        const blockParents = this.formula.reduce((acc, item, index) => {
          if (item.block) {
            console.log('item.id: ', item.id)
            // console.log('found block, not selected block: ', index)
          }
          return acc
        }, [])

        console.log('operatorRemove: ', [event, element.id, this.formula, element])
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
  cursor:pointer;
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

  &.child {
    outline: 0px;
    &.block {
      min-height: 30px;
      min-width: 30px;
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
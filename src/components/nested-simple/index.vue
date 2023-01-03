<template>
  <draggable
    style="display: flex;"
    class="dragArea"
    tag="div"
    :list="formula"
    :group="{ name: 'formula' }"
    :animation="500"
    @change="onChange"
    :swap-threshhold="0.5"
    item-key="id"
    handle=".drag-handle"
    drag-class=".sortable-drag"
    ghost-class=".sortable-ghost"
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
            >(</div>
            <nested-draggable class="block child" :formula="element.children" />
            <div
              class="operator"
              @mouseenter="($event) => onMouseEvent($event, element)"
              @mouseleave="($event) => onMouseEvent($event, element)"
              :ref="`block-close-${element.id}`"
            >)</div>
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
      if (evt.type === 'mouseenter') {
        this.$refs[`block-open-${element.id}`]
          // .classList.add('hover')
          .style.backgroundColor = 'red'
        this.$refs[`block-close-${element.id}`]
          // .classList.add('hover')
          .style.backgroundColor = 'red'
      }
      else if (evt.type === 'mouseleave') {
        this.$refs[`block-open-${element.id}`]
          // .classList.remove('hover')
          .removeAttribute('style')
        this.$refs[`block-close-${element.id}`]
          // .classList.remove('hover')
          .removeAttribute('style')
      }
      console.log('onMouseenter: ', [evt, evt.type, element, this.$refs[`block-open-${element.id}`], this.$refs[`block-close-${element.id}`]])
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
.formula-item .operator {
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
}
</style>
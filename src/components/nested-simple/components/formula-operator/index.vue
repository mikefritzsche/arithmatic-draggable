<template>
  <div
      class="operator drag-handle"
      @click="$emit('operator-click', element)"
      :ref="`${element.valueType}-${element.id}`"
  >
    <div
        @click="$emit('operator-remove', {index, element})"
        class="operator-remove"
    >x
    </div>


    <span>{{ element.label }}</span>

    <div
        class="operator-context-control"
        tabindex="0"
        @focusout="$emit('handle-focus-out', element)"
        :ref="`${element.valueType}-context--${element.id}`"
    >
      <div
          v-for="operator in contextOperators"
          :key="operator.label"
          class="operator-context-item"
          @click.self.stop="() => $emit('update-formula-operator', {index, operator, element})"
      >
        {{ operator.label }}
      </div>
      <div
          class="operator-context-item trash"
          @click.self="$emit('delete-formula-operator', {index, element})"
      >
        <div>T</div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
export default {
  name: "FormulaOperator",
  props: {
    contextOperators: {
      type: Array,
      default: () => ([])
    },
    element: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'operator-click',
    'operator-remove',
    'mouse-event',
    'handle-focus-out',
    'update-formula-operator',
    'delete-formula-operator',
  ],
}
</script>

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
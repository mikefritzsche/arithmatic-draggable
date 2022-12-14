<template>
  <draggable
      class="dragArea"
      :class="{primary: parent}"
      :style="styles"
      tag="div"
      :list="tasks"
      :group="{ name: 'g1' }"
      item-key="name"
  >
    <template #item="{ element }">
      <div>
        <p>{{ element.name }}</p>
        <nested-draggable :tasks="element.tasks" />
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  props: {
    parent: {
      type: Boolean,
      default: false,
    },
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  },
  name: "nested-draggable",
  computed: {
    styles() {
      return this.parent ? {display: 'flex'} : {}
    }
  }
};
</script>
<style lang="scss">
.dragArea {
  &.primary {
    min-height: 50px;
    outline: 1px dashed;
    justify-content: center;
  }
}
</style>
<template>
  <draggable
      class="dragArea"
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
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  },
  name: "nested-draggable"
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
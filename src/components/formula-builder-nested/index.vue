<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <nested-draggable :parent="true" :tasks="formula"/>
    </div>
  </div>
</template>

<script>
import NestedDraggable from './components/nested-draggable/index.vue'

export default {
  name: "builder-nested",
  display: "Nested",
  order: 15,
  components: {
    NestedDraggable
  },
  data() {
    return {
      formula: [
        {
          name: "task 1",
          tasks: [
            {
              name: "task 2",
              tasks: []
            }
          ]
        },
        {
          name: "task 3",
          tasks: [
            {
              name: "task 4",
              tasks: []
            }
          ]
        },
        {
          name: "task 5",
          tasks: []
        }
      ]
    };
  }
};
</script>
<style scoped></style>
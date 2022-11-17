<template>
    <draggable 
        class="dragArea" 
        tag="ul" 
        :formula="tasks" 
        :group="{ name: 'g1', put: () => true }"
        >
        <template #item="element">
            {{ element }} {{ tasks }}
            <!-- <li v-for="el in tasks" :key="el.name">
                <p>{{ el.name }}</p>
                <nested-draggable :tasks="el.tasks" />
            </li> -->
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
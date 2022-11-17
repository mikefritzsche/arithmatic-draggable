<template>
  <div class="home">
    <CalculatedFieldsArithmatic/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CalculatedFieldsArithmatic from '@/components/CalculatedFieldsArithmatic.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    CalculatedFieldsArithmatic,
  },
});
</script>

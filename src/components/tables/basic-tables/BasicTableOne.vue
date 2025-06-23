<template>
  <table class="min-w-full table-auto border-collapse dark:text-white">
    <thead>
      <tr>
        <th v-for="(column, index) in columns" :key="index" class="border px-4 py-2">
          {{ column.label }}
        </th>
        <th v-if="hasActions" class="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="(column, colIndex) in columns" :key="colIndex" class="border px-4 py-2">
          {{ row[column.field] }}
        </td>
        <td v-if="hasActions" class="border px-4 py-2">
          <button
            @click="$emit('edit', row)"
            class="mr-2 text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            @click="$emit('delete', row)"
            class="text-red-500 hover:underline"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface Column {
  label: string;
  field: string;
}
interface Row {
  [key: string]: any;
}

const props = defineProps<{
  columns: Column[];
  data: Row[];
}>();

// Check if actions column is needed
const hasActions = computed(() => {
  return true; // always show actions now
});
</script>

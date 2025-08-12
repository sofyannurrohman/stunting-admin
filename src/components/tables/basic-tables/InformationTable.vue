<template>
  <table class="min-w-full table-auto border-collapse dark:text-white text-center">
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
        <td
          v-for="(column, colIndex) in columns"
          :key="colIndex"
          class="border px-4 py-2 justify-center items-center"
        >
          <template v-if="column.field === 'image_url'">
            <img
              :src="getFullImageUrl(row[column.field])"
              alt="Image"
              class="w-20 h-20 object-cover mx-auto"
            />
          </template>
          <template v-else>
            {{ row[column.field] }}
          </template>
        </td>

        <td v-if="hasActions" class="border px-4 py-2">
          <button @click="$emit('edit', row)" class="mr-2 text-blue-500 hover:underline">
            Edit
          </button>
          <button @click="$emit('delete', row)" class="text-red-500 hover:underline">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://default-backend-url.com'

function getFullImageUrl(path: string) {
  if (!path) return '' // fallback if path is empty/null
  if (path.startsWith('http')) return path // already full URL
  // Make sure there is a slash between backendUrl and path
  const slash = backendUrl.endsWith('/') || path.startsWith('/') ? '' : '/'
  return `${backendUrl}${slash}${path}`
}
interface Column {
  label: string
  field: string
}
interface Row {
  [key: string]: any
}

const props = defineProps<{
  columns: Column[]
  data: Row[]
}>()

const hasActions = computed(() => {
  return true // always show actions
})
</script>

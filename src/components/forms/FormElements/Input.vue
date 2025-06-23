<!-- Input.vue -->
<template>
    <div>
      <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
      <input
        v-bind="$attrs"
        :placeholder="placeholder"
        :type="type"
        v-model="inputValue"
        class="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </template>
  
  <script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: string | number
  placeholder?: string
  type?: string
}>()

const emit = defineEmits(['update:modelValue'])

// Computed binding for v-model
const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
<template>
    <button
      class="px-4 py-2 rounded text-white font-semibold shadow transition duration-200"
      :class="{
        'bg-blue-500 hover:bg-blue-600': variant === 'primary',
        'bg-gray-400 hover:bg-gray-500': variant !== 'primary',
      }"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  defineProps({
    variant: {
      type: String,
      default: 'default',
    },
  })
  </script>
  
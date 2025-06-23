<template>
  <div class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto px-4 py-6">
    <!-- Backdrop -->
    <div
      v-if="fullScreenBackdrop"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          <slot name="title" />
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ModalProps {
  fullScreenBackdrop?: boolean
}

defineProps<ModalProps>()
defineEmits(['close'])
</script>

<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
  },
  name: 'Dashboard Posyandu Balita',
}
</script>

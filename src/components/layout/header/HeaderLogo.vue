<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden w-42" src="/images/logo/logo_light.png" alt="Logo" />
    <img class="hidden dark:block w-42" src="/images/logo/logo-dark.png" alt="Logo" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

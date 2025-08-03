<template>
  <admin-layout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">Data Pengukuran Balita</h1>

      <!-- Add Toddler Button -->
      <button
        @click="openCreateModal"
        class="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Data Pengukuran Balita
      </button>

      <!-- Toddler Table -->
      <TableComponent
        :columns="columns"
        :data="enrichedToddlers"
        @edit="handleEditToddler"
        @delete="handleDeleteToddler"
      />

      <!-- Create Modal -->
      <Modal v-if="showCreateModal" @close="closeCreateModal">
        <template #title>Tambah Data Balita</template>
        <form @submit.prevent="handleCreateToddler">
          <!-- Profile select -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Balita</label>
            <select v-model="form.profile_id" required class="w-full border p-2 rounded">
              <option disabled value="0">-- Pilih Balita --</option>
              <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
                {{ profile.name }}
              </option>
            </select>
          </div>

          <!-- Gender select -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select v-model="form.gender" required class="w-full border p-2 rounded">
              <option disabled value="">-- Pilih Jenis Kelamin --</option>
              <option v-for="g in genders" :key="g" :value="g">{{ g }}</option>
            </select>
          </div>

          <!-- Number inputs -->
          <Input
            v-model="form.age_months"
            type="number"
            min="0"
            step="1"
            label="Umur (Bulan)"
            placeholder="Contoh: 24"
            required
          />
          <Input
            v-model="form.weight_kg"
            type="number"
            min="0"
            step="0.1"
            label="Berat Badan (Kg)"
            placeholder="Contoh: 12.5"
            required
          />
          <Input
            v-model="form.height_cm"
            type="number"
            min="0"
            step="0.1"
            label="Tinggi Badan (Cm)"
            placeholder="Contoh: 80.5"
            required
          />

          <div class="flex justify-end space-x-2 mt-4">
            <Button @click="closeCreateModal" type="button">Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>

      <!-- Edit Modal -->
      <Modal v-if="showEditModal" @close="closeEditModal">
        <template #title>Ubah Toddler</template>
        <form @submit.prevent="handleUpdateToddler">
          <Input v-model="editForm.profile_id" label="Nama" required />
          <Input v-model="editForm.gender" label="Gender" required />
          <Input v-model="editForm.age_months" label="Age (months)" type="number" required />
          <Input v-model="editForm.weight_kg" label="Weight (kg)" type="number" required />
          <Input v-model="editForm.height_cm" label="Height (cm)" type="number" required />
          <Input v-model="editForm.predicted" label="Kondisi Kesehatan" type="text" required />

          <div class="flex justify-end space-x-2 mt-4">
            <Button @click="closeEditModal" type="button">Cancel</Button>
            <Button type="submit" variant="primary">Update</Button>
          </div>
        </form>
      </Modal>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TableComponent from '@/components/tables/basic-tables/BasicTableOne.vue'
import { getToddlers, createToddler, updateToddler, deleteToddler } from '@/api/toddler'
import childProfileService from '@/api/child_profile'
import type { ToddlerRead, ToddlerCreate, ToddlerUpdate } from '@/api/schemas/toddler_schema'
import type { ChildProfileRead } from '@/api/schemas/child_profile_schema'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Button from '@/components/forms/FormElements/Button.vue'

import { computed } from 'vue'

const enrichedToddlers = computed(() =>
  toddlers.value.map((toddler) => {
    const profile = profiles.value.find((p) => p.id === toddler.profile_id)
    return {
      ...toddler,
      profile_id: profile ? profile.name : `ID: ${toddler.profile_id}`,
    }
  }),
)

// Table columns
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Nama Balita', field: 'profile_id' },
  { label: 'Jenis Kelamin', field: 'gender' },
  { label: 'Umur (Bulan)', field: 'age_months' },
  { label: 'Berat (kg)', field: 'weight_kg' },
  { label: 'Tinggi (cm)', field: 'height_cm' },
  { label: 'Kondisi Kesehatan', field: 'predicted' },
  { label: 'Tanggal Pemeriksaan', field: 'createdAt' },
]

// Data
const toddlers = ref<ToddlerRead[]>([])
const profiles = ref<ChildProfileRead[]>([])
const genders = ['Laki-laki', 'Perempuan']

// Form state
const showCreateModal = ref(false)
const showEditModal = ref(false)

const form = ref<ToddlerCreate>({
  profile_id: 0,
  gender: '',
  age_months: 0,
  weight_kg: 0,
  height_cm: 0,
})

const editForm = ref<{
  id: number
  profile_id: number
  gender: string
  age_months: number
  weight_kg: number
  height_cm: number
  predicted: string
}>({
  id: 0,
  profile_id: 0,
  gender: '',
  age_months: 0,
  weight_kg: 0,
  height_cm: 0,
  predicted: '',
})

// Fetch functions
const fetchToddlers = async () => {
  try {
    const { data } = await getToddlers()
    toddlers.value = data
  } catch (error) {
    console.error('Failed to fetch toddlers:', error)
  }
}

const fetchProfiles = async () => {
  try {
    const { data } = await childProfileService.getAll()
    profiles.value = data
  } catch (error) {
    console.error('Failed to fetch profiles:', error)
  }
}

// Create
const handleCreateToddler = async () => {
  try {
    await createToddler(form.value)
    closeCreateModal()
    fetchToddlers()
  } catch (error) {
    console.error('Failed to create toddler:', error)
  }
}

// Edit
const handleEditToddler = (toddler: ToddlerRead) => {
  editForm.value = {
    id: toddler.id,
    profile_id: toddler.profile_id,
    gender: toddler.gender,
    age_months: toddler.age_months,
    weight_kg: toddler.weight_kg,
    height_cm: toddler.height_cm,
    predicted: toddler.predicted,
  }
  showEditModal.value = true
}

const handleUpdateToddler = async () => {
  try {
    const updateData: ToddlerUpdate = {
      age_months: editForm.value.age_months,
      gender: editForm.value.gender,
      weight_kg: editForm.value.weight_kg,
      height_cm: editForm.value.height_cm,
      predicted: editForm.value.predicted,
    }
    await updateToddler(editForm.value.id, updateData)
    closeEditModal()
    fetchToddlers()
  } catch (error) {
    console.error('Failed to update toddler:', error)
  }
}

// Delete
const handleDeleteToddler = async (toddler: ToddlerRead) => {
  if (confirm(`Are you sure you want to delete toddler ID: ${toddler.id}?`)) {
    try {
      await deleteToddler(toddler.id)
      fetchToddlers()
    } catch (error) {
      console.error('Failed to delete toddler:', error)
    }
  }
}

// Modal helpers
const openCreateModal = () => {
  form.value = {
    profile_id: 0,
    gender: '',
    age_months: 0,
    weight_kg: 0,
    height_cm: 0,
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}
const closeEditModal = () => {
  showEditModal.value = false
}

onMounted(() => {
  fetchToddlers()
  fetchProfiles()
})
</script>

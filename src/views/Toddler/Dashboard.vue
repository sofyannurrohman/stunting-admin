<template>
  <admin-layout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">Data Balita</h1>

      <!-- Add Toddler Button -->
      <button
        @click="openCreateModal"
        class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Data Balita
      </button>

      <!-- Toddler Table -->
      <TableComponent
        :columns="columns"
        :data="toddlers"
        @edit="handleEditToddler"
        @delete="handleDeleteToddler"
      />

      <!-- Create Modal -->
      <Modal v-if="showCreateModal" @close="closeCreateModal">
        <template #title>Tambah Data Balita</template>
        <form @submit.prevent="handleCreateToddler">
          <Input v-model="form.name" label="Name" placeholder="Masukkan Nama Balita" required />
          <Input
            v-model="form.gender"
            label="Gender"
            placeholder="Masukkan Jenis Kelamin"
            required
          />
          <Input
            v-model="form.age_months"
            label="Age (months)"
            type="number"
            placeholder="Masukkan Umur (Bulan)"
            required
          />
          <Input
            v-model="form.weight_kg"
            label="Weight (kg)"
            type="number"
            placeholder="Masukkan Berat (Kg)"
            required
          />
          <Input
            v-model="form.height_cm"
            label="Height (cm)"
            type="number"
            placeholder="Masukkan Tinggi (Cm)"
            required
          />
          <Input v-model="form.user_id" label="Nama Ibu" type="text" required />

          <div class="flex justify-end space-x-2 mt-4">
            <Button @click="closeCreateModal" type="button">Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>

      <!-- Edit Modal -->
      <Modal v-if="showEditModal" @close="closeEditModal">
        <template #title>Edit Toddler</template>
        <form @submit.prevent="handleUpdateToddler">
          <Input v-model="editForm.name" label="Name" required />
          <Input v-model="editForm.gender" label="Gender" required />
          <Input v-model="editForm.age_months" label="Age (months)" type="number" required />
          <Input v-model="editForm.weight_kg" label="Weight (kg)" type="number" required />
          <Input v-model="editForm.height_cm" label="Height (cm)" type="number" required />

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
import type { ToddlerRead, ToddlerCreate, ToddlerUpdate } from '@/api/schemas/toddler_schema'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Button from '@/components/forms/FormElements/Button.vue'
// Table columns
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Anak', field: 'name' },
  { label: 'Jenis Kelamin', field: 'gender' },
  { label: 'Umur (Bulan)', field: 'age_months' },
  { label: 'Berat (kg)', field: 'weight_kg' },
  { label: 'Tinggi (cm)', field: 'height_cm' },
  { label: 'ID_Ibu', field: 'user_id' },
  { label: 'Kondisi Kesehatan', field: 'predicted' },
  { label: 'Tanggal Pemeriksaan', field: 'createdAt' },
]

// Toddler data
const toddlers = ref<ToddlerRead[]>([])

// Form & modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)

const form = ref<ToddlerCreate>({
  name: '',
  gender: '',
  age_months: 0,
  weight_kg: 0,
  height_cm: 0,
  user_id: 0,
})

const editForm = ref<{
  id: number
  name: string
  gender: string
  age_months: number
  weight_kg: number
  height_cm: number
}>({
  id: 0,
  name: '',
  gender: '',
  age_months: 0,
  weight_kg: 0,
  height_cm: 0,
})

// Fetch all toddlers
const fetchToddlers = async () => {
  try {
    const { data } = await getToddlers()
    toddlers.value = data
  } catch (error) {
    console.error('Failed to fetch toddlers:', error)
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
    name: toddler.name,
    gender: toddler.gender,
    age_months: toddler.age_months,
    weight_kg: toddler.weight_kg,
    height_cm: toddler.height_cm,
  }
  showEditModal.value = true
}

const handleUpdateToddler = async () => {
  try {
    const updateData: ToddlerUpdate = {
      name: editForm.value.name,
      age_months: editForm.value.age_months,
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
  if (confirm(`Are you sure you want to delete ${toddler.name}?`)) {
    try {
      await deleteToddler(toddler.id)
      fetchToddlers()
    } catch (error) {
      console.error('Failed to delete toddler:', error)
    }
  }
}

// Modal open/close
const openCreateModal = () => {
  form.value = {
    name: '',
    gender: '',
    age_months: 0,
    weight_kg: 0,
    height_cm: 0,
    user_id: 0, // <- get from store/auth
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
})
</script>

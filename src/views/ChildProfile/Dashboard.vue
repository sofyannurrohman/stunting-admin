<template>
  <admin-layout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">Data Diri Balita</h1>

      <button
        @click="openCreateModal"
        class="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Data Balita
      </button>

      <TableComponent
        :columns="columns"
        :data="profilesWithUserName"
        @edit="handleEditProfile"
        @delete="handleDeleteProfile"
      />

      <!-- Create Modal -->
      <Modal v-if="showCreateModal" @close="closeCreateModal">
        <template #title>Tambah Data Balita</template>
        <form @submit.prevent="handleCreateProfile">
          <Input v-model="form.nik" label="NIK" placeholder="Masukkan NIK" required />
          <Input
            v-model="form.name"
            label="Nama Anak"
            placeholder="Masukkan Nama Balita"
            required
          />
          <Input v-model="form.tanggal_lahir" label="Tanggal Lahir" type="date" required />
          <Input v-model="form.tempat_lahir" label="Tempat Lahir" required />
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih User (Ibu)</label>
            <select v-model="form.user_id" required class="w-full border p-2 rounded">
              <option disabled value="0">-- Pilih User --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <Button @click="closeCreateModal" type="button">Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>

      <!-- Edit Modal -->
      <Modal v-if="showEditModal" @close="closeEditModal">
        <template #title>Ubah Data Balita</template>
        <form @submit.prevent="handleUpdateProfile">
          <Input v-model="editForm.nik" label="NIK" required />
          <Input v-model="editForm.name" label="Nama Anak" required />
          <Input v-model="editForm.tanggal_lahir" label="Tanggal Lahir" type="date" required />
          <Input v-model="editForm.tempat_lahir" label="Tempat Lahir" required />
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih User (Ibu)</label>
            <select v-model="editForm.user_id" required class="w-full border p-2 rounded">
              <option disabled value="0">-- Pilih User --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

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
import childProfileService from '@/api/child_profile'
import { getUsers } from '@/api/user'
import type {
  ChildProfileRead,
  ChildProfileCreate,
  ChildProfileUpdate,
} from '@/api/schemas/child_profile_schema'
import TableComponent from '@/components/tables/basic-tables/BasicTableOne.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Button from '@/components/forms/FormElements/Button.vue'
import { computed } from 'vue'

const profilesWithUserName = computed(() => {
  return profiles.value.map(profile => {
    const user = users.value.find(u => u.id === profile.user_id)
    return {
      ...profile,
      user_name: user ? user.name : 'Unknown'
    }
  })
})


// Table columns
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'NIK', field: 'nik' },
  { label: 'Nama Anak', field: 'name' },
  { label: 'Tempat Lahir', field: 'tempat_lahir' },
  { label: 'Tanggal Lahir', field: 'tanggal_lahir' },
  { label: 'Nama Ortu', field: 'user_name' },
]

// State
const profiles = ref<ChildProfileRead[]>([])
const users = ref<{ id: number; name: string }[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)

const form = ref<ChildProfileCreate>({
  nik: '',
  name: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  user_id: 0,
})

const editForm = ref<{
  id: number
  nik:string
  name: string
  
  tanggal_lahir: string
  tempat_lahir: string
  user_id: number
}>({
  id: 0,
  nik:'',
  name: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  user_id: 0,
})

// Fetch data
const fetchProfiles = async () => {
  const { data } = await childProfileService.getAll()
  profiles.value = data
}
const fetchUsers = async () => {
  try {
    const { data } = await getUsers() // adjust this to your API
    users.value = data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// Create
const handleCreateProfile = async () => {
  try {
    await childProfileService.create(form.value)
    closeCreateModal()
    fetchProfiles()
  } catch (error) {
    console.error('Failed to create profile:', error)
  }
}

// Edit
const handleEditProfile = (profile: ChildProfileRead) => {
  editForm.value = {
    id: profile.id,
    name: profile.name,
    nik: profile.nik,
    tanggal_lahir: profile.tanggal_lahir.slice(0, 10),
    tempat_lahir: profile.tempat_lahir,
    user_id: profile.user_id,
  }
  showEditModal.value = true
}

const handleUpdateProfile = async () => {
  try {
    const updateData: ChildProfileUpdate = {
      nik: editForm.value.nik,
      name: editForm.value.name,
      tempat_lahir: editForm.value.tempat_lahir,
      tanggal_lahir: editForm.value.tanggal_lahir,
      user_id: editForm.value.user_id,
    }
    console.log(updateData);
    await childProfileService.update(editForm.value.id, updateData)
    closeEditModal()
    fetchProfiles()
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

// Delete
const handleDeleteProfile = async (profile: ChildProfileRead) => {
  if (confirm(`Are you sure you want to delete ${profile.name}?`)) {
    try {
      await childProfileService.delete(profile.id)
      fetchProfiles()
    } catch (error) {
      console.error('Failed to delete profile:', error)
    }
  }
}

// Modals
const openCreateModal = () => {
  form.value = {
    nik: '',
    name: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    user_id: 0,
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
  fetchProfiles()
  fetchUsers()
})
</script>

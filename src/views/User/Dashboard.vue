<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div class="p-6 flex-col">
      <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Data Peserta</h1>
      <!-- Add User Button -->
      <button
        @click="openCreateModal"
        class="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Peserta
      </button>

      <!-- User Table -->
      <TableComponent
        :columns="columns"
        :data="users"
        @edit="handleEditUser"
        @delete="handleDeleteUser"
      />

      <!-- Create User Modal -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-lg font-bold mb-4">Tambah User</h2>
          <form @submit.prevent="handleCreateUser">
            <div class="mb-4">
              <label class="block mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Masukkan Email"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Masukkan Nama"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">Role</label>
              <select v-model="form.role" class="w-full border p-2 rounded" required>
                <option disabled value="">Select a role</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Masukkan Password"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">RT</label>
              <input
                v-model="form.rt"
                type="text"
                placeholder="Masukkan RT"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">RW</label>
              <input
                v-model="form.rw"
                type="text"
                placeholder="Masukkan RW"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeCreateModal" class="px-4 py-2 border rounded">
                Abaikan
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-blue-600"
              >
                Buat
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- Edit User Modal -->
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-lg font-bold mb-4">Ubah User</h2>
          <form @submit.prevent="handleUpdateUser">
            <div class="mb-4">
              <label class="block mb-1">Email</label>
              <input
                v-model="editForm.email"
                type="email"
                class="w-full border p-2 rounded"
                disabled
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">Name</label>
              <input
                v-model="editForm.name"
                type="text"
                class="w-full border p-2 rounded"
                required
              />
            </div>
             <div class="mb-4">
              <label class="block mb-1">Role</label>
              <input v-model="editForm.role" type="text" class="w-full border p-2 rounded" required />
            </div>
            <div class="mb-4">
              <label class="block mb-1">RT</label>
              <input v-model="editForm.rt" type="text" class="w-full border p-2 rounded" required />
            </div>
            <div class="mb-4">
              <label class="block mb-1">RW</label>
              <input v-model="editForm.rw" type="text" class="w-full border p-2 rounded" required />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeEditModal" class="px-4 py-2 border rounded">
                Abaikan
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ubah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import TableComponent from '@/components/tables/basic-tables/BasicTableOne.vue'
import { getUsers, createUser, deleteUser, updateUser } from '@/api/user'
import type { UserRead, UserCreate, UserUpdate } from '@/api/schemas/user_schema'

// Columns (can be dynamic/flexible)
const columns: { label: string; field: string }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Email', field: 'email' },
  { label: 'Name', field: 'name' },
  { label: 'Role', field: 'role' },
  { label: 'RT', field: 'rt' },
  { label: 'RW', field: 'rw' },
]

// Users data
const users = ref<UserRead[]>([])
const roles = ['admin', 'user']
// Modal & form state
const showCreateModal = ref(false)
const form = ref<UserCreate>({
  email: '',
  name: '',
  password: '',
  role: '',
  rt: '',
  rw: '',
})
// Fetch users
const fetchUsers = async () => {
  try {
    const { data } = await getUsers()
    users.value = data ?? []
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// Handle create user
const handleCreateUser = async () => {
  try {
    await createUser(form.value)
    closeCreateModal()
    form.value = { email: '', name: '', password: '', role: '', rt: '', rw: '' } // ✅ reset
    fetchUsers()
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}

const showEditModal = ref(false)
const editForm = ref<{
  id: number
  email: string
  name: string
  role: string
  rt: string
  rw: string
}>({
  id: 0,
  email: '',
  name: '',
  role: '',
  rt: '',
  rw: '',
})

const handleEditUser = (user: UserRead) => {
  editForm.value = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    rt: user.rt,
    rw: user.rw,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleUpdateUser = async () => {
  try {
    const userUpdate: UserUpdate = {
      name: editForm.value.name,
      email: editForm.value.email,
      role: editForm.value.role,
      rt: editForm.value.rt,
      rw: editForm.value.rw,
    }
    await updateUser(editForm.value.id, userUpdate)
    closeEditModal()
    fetchUsers()
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}

const handleDeleteUser = async (user: UserRead) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      await deleteUser(user.id)
      fetchUsers() // Refresh
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

// Open/close modal
const openCreateModal = () => {
  form.value = { email: '', name: '', password: '', role: '', rt: '', rw: '' }
  showCreateModal.value = true
}
const closeCreateModal = () => {
  showCreateModal.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>

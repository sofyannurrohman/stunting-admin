<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div class="p-6 flex-col">
      <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Data Peserta</h1>
      <!-- Add User Button -->
      <button
        @click="openCreateModal"
        class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                placeholder="Masukkan Alamat Email"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Masukkan Nama User"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                id="role"
                v-model="form.role"
                class="block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option disabled value="">Select a role</option>
                <option v-for="role in roles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block mb-1">Password</label>
              <input
                v-model="form.password"
                placeholder="Masukkan Password Min 8 Karakter"
                type="password"
                class="w-full border p-2 rounded"
                min="8"
                required
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeCreateModal" class="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
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
          <h2 class="text-lg font-bold mb-4">Edit User</h2>
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
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeEditModal" class="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
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
]

// Users data
const users = ref<UserRead[]>([])
const roles = ['admin', 'user']
// Modal & form state
const showCreateModal = ref(false)
const form = ref<UserCreate>({
  email: '',
  name: '',
  role: '',
  password: '',
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
    form.value = { email: '', name: '', password: '', role: '' } // ✅ reset
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
}>({
  id: 0,
  email: '',
  name: '',
})

const handleEditUser = (user: UserRead) => {
  editForm.value = {
    id: user.id,
    email: user.email,
    name: user.name,
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
    }
    await updateUser(editForm.value.id, userUpdate)
    closeEditModal()
    fetchUsers() // Refresh
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
  form.value = { email: '', name: '', password: '', role:'' }
  showCreateModal.value = true
}
const closeCreateModal = () => {
  showCreateModal.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>

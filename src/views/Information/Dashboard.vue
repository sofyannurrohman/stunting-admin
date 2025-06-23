<template>
  <admin-layout>
    <div>
      <h1 class="text-2xl font-bold mb-4 dark:text-white">List Artikel Kesehatan</h1>

      <button @click="openCreateModal" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        + Artikel
      </button>

      <TableComponent
        :columns="columns"
        :data="information"
        @edit="openEditModal"
        @delete="handleDelete"
      />

      <!-- Modal -->
      <div
        v-if="isModalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
          <button
            @click="closeModal"
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
          <h2 class="text-xl font-bold mb-4">
            {{ isEditing ? 'Ubah' : 'Buat' }} Artikel Kesehatan
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label>Judul</label>
              <input
                v-model="form.title"
                placeholder="Masukkan Judul Artikel"
                type="text"
                required
                class="border p-2 w-full"
              />
            </div>
            <div>
              <label>Isi / Konten:</label>
              <textarea
                v-model="form.content"
                placeholder="Masukkan Isi Konten"
                required
                class="border p-2 w-full"
              ></textarea>
            </div>
            <div>
              <label>Ketegori</label>
              <input
                v-model="form.category"
                placeholder="Masukkan Kategori Artikel"
                type="text"
                class="border p-2 w-full"
              />
            </div>
            <div>
              <label>Sumber Artikel</label>
              <input
                v-model="form.source"
                placeholder="Masukkan Sumber Artikel"
                type="text"
                class="border p-2 w-full"
              />
            </div>
            <div v-if="!isEditing">
              <label>Foto Artikel</label>
              <input @change="handleFileChange" type="file" class="border p-2 w-full" />
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableComponent from '@/components/tables/basic-tables/InformationTable.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  getAllInformation,
  createInformation,
  updateInformation,
  deleteInformation,
} from '@/api/information'
import { type InformationRead, type InformationCreate } from '@/api/schemas/information_schema'

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Judul', field: 'title' },
  { label: 'Isi', field: 'content' },
  { label: 'Kategori', field: 'category' },
  { label: 'Sumber', field: 'source' },
  { label: 'Gambar', field: 'image_url' },
]

const information = ref<InformationRead[]>([])

const isModalVisible = ref(false)
const isEditing = ref(false)
const currentId = ref<number | null>(null)
const imageFile = ref<File | null>(null)

const form = reactive<InformationCreate>({
  title: '',
  content: '',
  category: '',
  source: '',
})

const fetchInformation = async () => {
  try {
    const { data } = await getAllInformation()
    information.value = data
  } catch (error) {
    console.error('Error fetching information:', error)
  }
}

const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  isModalVisible.value = true
}

const openEditModal = (row: InformationRead) => {
  form.title = row.title
  form.content = row.content
  form.source = row.source
  form.category = row.category ?? ''
  currentId.value = row.id
  isEditing.value = true
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
}

const resetForm = () => {
  form.title = ''
  form.content = ''
  form.category = ''
  form.source = ''
  imageFile.value = null
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    imageFile.value = target.files[0]
  }
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('content', form.content)
  formData.append('source', form.source)
  if (form.category) formData.append('category', form.category)
  if (imageFile.value) formData.append('image', imageFile.value)

  try {
    if (isEditing.value && currentId.value) {
      await updateInformation(currentId.value, formData) // pass the real data
      alert('Information updated!')
    } else {
      await createInformation(formData) // pass the real data
      alert('Information created!')
    }
    await fetchInformation()
    closeModal()
  } catch (error) {
    console.error('Error submitting information:', error)
  }
}

const handleDelete = async (row: InformationRead) => {
  if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
    try {
      await deleteInformation(row.id)
      information.value = information.value.filter((item) => item.id !== row.id)
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }
}

onMounted(fetchInformation)
</script>

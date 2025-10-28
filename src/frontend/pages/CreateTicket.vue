<template>
  <Navbar />
  <Toast v-if="toast" v-bind="toast" @close="toast = null" />
  <div class="max-w-2xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">Create New Ticket</h1>
      <p class="text-gray-500">Add a new ticket</p>
    </div>
    <div class="bg-white shadow-md border-[1px] rounded-lg p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block font-semibold mb-2">Title</label>
          <input
            v-model="form.title"
            type="text"
            name="title"
            required
            class="w-full border rounded-lg px-4 py-2 focus:outline-blue-600"
            :class="errors.title ? 'border-red-400' : 'border-gray-300'"
            placeholder="e.g., Payment Processing Issue"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>
        <div>
          <label class="block font-semibold mb-2">Description</label>
          <textarea
            v-model="form.description"
            name="description"
            required
            rows="6"
            class="w-full border rounded-lg px-4 py-2 focus:outline-blue-600"
            :class="errors.description ? 'border-red-400' : 'border-gray-300'"
            placeholder="Describe the issue in detail..."
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>
        <div>
          <label class="block font-semibold mb-2">Status</label>
          <select
            v-model="form.status"
            name="status"
            class="w-full border rounded-lg px-4 py-2 focus:outline-blue-600"
            :class="errors.status ? 'border-red-400' : 'border-gray-300'"
          >
            <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">{{ status }}</option>
          </select>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
        </div>
        <div class="flex gap-4">
          <button type="submit" class="text-[13px] md:text-[15px] flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Create Ticket
          </button>
          <router-link to="/tickets" class="text-[13px] md:text-[15px] flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-center font-semibold">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Toast from '../../components/Toast.vue'
import { createTicket } from '../../services/ticketService'

const STATUS_OPTIONS = ['open', 'in_progress', 'closed']

const router = useRouter()
const toast = ref(null)
const form = ref({ title: '', description: '', status: 'open' })
const errors = ref({})

const validate = (data) => {
  const next = {}
  if (!data.title || !data.title.trim()) next.title = 'Title is required'
  if (!STATUS_OPTIONS.includes(data.status)) next.status = 'Status must be open, in_progress, or closed'
  if (data.description && data.description.length > 1000) next.description = 'Description too long'
  return next
}

watch(
  form,
  (value) => {
    errors.value = validate(value)
  },
  { deep: true }
)

const handleSubmit = async () => {
  const validation = validate(form.value)
  errors.value = validation
  if (Object.keys(validation).length) return
  try {
    await createTicket(form.value)
    router.push({ path: '/tickets', query: { toast: 'created' } })
  } catch (err) {
    toast.value = { message: err.message || 'Failed to create ticket', type: 'error' }
  }
}

onMounted(() => {
  document.title = 'Create Ticket - Ticketa'
})
</script>

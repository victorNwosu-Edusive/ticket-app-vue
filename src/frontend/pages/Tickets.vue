<template>
  <Navbar />
  <Toast v-if="toast" v-bind="toast" @close="toast = null" />

  <div class="max-w-[1440px] mx-auto px-6 py-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
      <h1 class="text-2xl font-bold">Ticket Management</h1>
       <p className="text-gray-500">View and manage tickets</p>
       </div>
      <button @click="goToCreate" class="bg-blue-700 text-[12px] md:text-sm text-white px-4 py-2 rounded-md">+ Create Ticket</button>
    </div>

    <div v-if="loadingError" class="mb-4 text-red-600">
      {{ loadingError }} <button class="underline ml-3" @click="load">Retry</button>
    </div>

    <div class="grid gap-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white border-[1px] rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="flex-1">
          <div class="flex items-start gap-4">
            <div class="flex-1">
              <p class="font-semibold">{{ ticket.title }}</p>
              <p class="text-sm text-gray-500">{{ ticket.description }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span :class="['px-2 py-1 rounded-full text-xs', statusColor[ticket.status] || '']">{{ ticket.status }}</span>
                <span class="text-xs text-gray-400">Created: {{ new Date(ticket.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 md:mt-0 md:ml-6 flex items-center gap-2">
          <button @click="goToEdit(ticket.id)" class="px-3 py-1 text-[12px] md:text-[14px] border rounded-md flex items-center justify-center gap-2">
            <Edit :size="12" />
            Edit
          </button>
          <button @click="handleDelete(ticket.id)" class="px-3 py-1 text-[12px] md:text-[14px] bg-red-500 text-white rounded-md">Delete</button>
        </div>
      </div>

      <div v-if="tickets.length === 0" class="text-gray-500">No tickets yet.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Toast from '../../components/Toast.vue'
import { getAllTickets, deleteTicket } from '../../services/ticketService'
import { Edit } from 'lucide-vue-next'

const statusColor = {
  open: 'text-green-800 bg-green-100',
  in_progress: 'text-amber-800 bg-amber-100',
  closed: 'text-gray-700 bg-gray-100'
}

const tickets = ref([])
const loadingError = ref(null)
const toast = ref(null)

const router = useRouter()
const route = useRoute()

const load = async () => {
  try {
    loadingError.value = null
    const data = await getAllTickets()
    tickets.value = data
  } catch (err) {
    loadingError.value = err.message || 'Failed to load tickets. Please retry.'
    toast.value = { message: err.message || 'Failed to load tickets. Please retry.', type: 'error' }
  }
}

const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this ticket?')
  if (!confirmed) return
  try {
    await deleteTicket(id)
    tickets.value = tickets.value.filter((t) => t.id !== id)
    toast.value = { message: 'Ticket deleted', type: 'success' }
  } catch (err) {
    toast.value = { message: err.message || 'Failed to delete ticket', type: 'error' }
  }
}

const goToCreate = () => {
  router.push('/tickets/create')
}

const goToEdit = (id) => {
  router.push(`/tickets/${id}/edit`)
}

const clearToastQuery = () => {
  if (!route.query.toast) return
  const newQuery = { ...route.query }
  delete newQuery.toast
  router.replace({ query: newQuery })
}

const handleRouteToast = () => {
  const value = route.query.toast
  if (!value) return
  if (value === 'created') {
    toast.value = { message: 'Ticket created successfully', type: 'success' }
  } else if (value === 'updated') {
    toast.value = { message: 'Ticket updated', type: 'success' }
  }
  clearToastQuery()
}

onMounted(() => {
  document.title = 'Tickets - Ticketa'
  load()
  handleRouteToast()
})

watch(
  () => route.query.toast,
  () => {
    handleRouteToast()
  }
)
</script>

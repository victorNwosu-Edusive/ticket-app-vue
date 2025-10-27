<template>
  <div>
    <Navbar />
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />

    <div class="max-w-[1440px] mx-auto px-6 py-10">
      <h1 class="text-xl md:text-2xl font-bold mb-1">
        Welcome, {{ user?.name || 'Guest' }}
      </h1>
      <p class="text-gray-500 text-[13px] md:text-[15px] mb-6">You're now logged in 🎉</p>

      <h1 class="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>

      <div v-if="error" class="mb-4 text-red-600">
        {{ error }}
        <button class="ml-4 underline" @click="load">
          Retry
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-4 mb-8 *:cursor-pointer">
        <div class="bg-blue-700 border-[1px] rounded-2xl shadow p-10">
          <p class="text-sm mb-6 text-white">Total tickets</p>
          <p class="text-white text-6xl font-semibold">{{ totalTickets }}</p>
        </div>

        <div class="bg-green-100 border-[1px] border-green-400 rounded-2xl shadow p-10">
          <p class="text-sm mb-6 text-gray-500">Open tickets</p>
          <p class="text-6xl font-semibold">{{ openTickets }}</p>
        </div>

        <div class="bg-amber-100 border-[1px] border-amber-400 rounded-2xl shadow p-10">
          <p class="text-sm mb-6 text-gray-500">In Progress tickets</p>
          <p class="text-6xl font-semibold">{{ inProgressTickets }}</p>
        </div>

        <div class="bg-gray-100 border-[1px] border-gray-400 rounded-2xl shadow p-10">
          <p class="text-sm mb-6 text-gray-500">Resolved tickets</p>
          <p class="text-6xl font-semibold">{{ resolvedTickets }}</p>
        </div>
      </div>

      <div class="border-[1px] p-4 rounded-md bg-slate-50 shadow">
        <div class="flex items-center justify-between">
          <h2 class="text-sm md:text-xl font-semibold">Ticket Management</h2>
          <router-link
            to="/tickets"
            class="text-blue-600 hover:underline text-[12px]"
          >
            Go to Tickets →
          </router-link>
        </div>

        <div class="mt-4">
          <p class="text-[13px] md:text-[15px] text-gray-600">
            Quick view of the latest tickets:
          </p>
          <ul class="mt-4 space-y-3">
            <li
              v-for="ticket in latestTickets"
              :key="ticket.id"
              class="p-3 border bg-white rounded-md flex justify-between items-center"
            >
              <div>
                <p class="font-bold text-sm">{{ ticket.title }}</p>
                <p class="text-[13px] text-gray-500">
                  {{ ticket.description?.slice(0, 80) }}
                </p>
              </div>
              <div
                :class="[
                  'p-2 rounded-full text-[10px]',
                  statusColor[ticket.status] || ''
                ]"
              >
                {{ statusMap[ticket.status] || ticket.status }}
              </div>
            </li>
            <li v-if="tickets.length === 0" class="text-gray-500">
              No tickets yet.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Toast from '../../components/Toast.vue'
import { getAllTickets } from '../../services/ticketService'

const statusMap = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Resolved'
}

const statusColor = {
  open: 'text-green-800 bg-green-100',
  in_progress: 'text-amber-800 bg-amber-100',
  closed: 'text-gray-700 bg-gray-100'
}

const tickets = ref([])
const error = ref(null)
const toast = ref(null)
const user = ref(null)

// Computed properties
const totalTickets = computed(() => tickets.value.length)
const openTickets = computed(() => tickets.value.filter(t => t.status === 'open').length)
const inProgressTickets = computed(() => tickets.value.filter(t => t.status === 'in_progress').length)
const resolvedTickets = computed(() => tickets.value.filter(t => t.status === 'closed').length)
const latestTickets = computed(() => tickets.value.slice(0, 3))

const load = async () => {
  try {
    tickets.value = await getAllTickets()
  } catch (err) {
    error.value = err.message || 'Failed to load tickets. Please retry.'
    toast.value = {
      message: err.message || 'Failed to load tickets. Please retry.',
      type: 'error'
    }
  }
}

onMounted(() => {
  // Fetch logged-in user
  const session = JSON.parse(localStorage.getItem('ticketapp_session'))
  if (session && session.user) {
    user.value = session.user
  } else {
    user.value = { name: 'Guest' }
  }

  load()
})
</script>
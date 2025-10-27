import { ref } from 'vue'
import { getAllTickets, createTicket, updateTicket, deleteTicket } from '../services/ticketService'

export function useTickets() {
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load all tickets
  const loadTickets = async () => {
    loading.value = true
    error.value = null
    try {
      tickets.value = await getAllTickets()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Create a new ticket
  const addTicket = async (ticketData) => {
    loading.value = true
    error.value = null
    try {
      const newTicket = await createTicket(ticketData)
      tickets.value.unshift(newTicket)
      return newTicket
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update an existing ticket
  const editTicket = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedTicket = await updateTicket(id, updates)
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tickets.value[index] = updatedTicket
      }
      return updatedTicket
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Remove a ticket
  const removeTicket = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteTicket(id)
      tickets.value = tickets.value.filter(t => t.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed helpers
  const getTicketById = (id) => {
    return tickets.value.find(t => t.id === id)
  }

  return {
    tickets,
    loading,
    error,
    loadTickets,
    addTicket,
    editTicket,
    removeTicket,
    getTicketById
  }
}
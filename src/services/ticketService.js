/**
 * Storage key for tickets in localStorage
 */
const STORAGE_KEY = 'ticketapp_tickets'

/**
 * Helper to simulate API latency
 */
const wait = (ms) => new Promise((res) => setTimeout(res, ms))

/**
 * Default seed tickets (only used if none exist)
 */
const seedTickets = [
  {
    id: 1,
    title: 'Sample ticket: Fix login bug',
    status: 'open',
    description: "Users can't login with certain emails",
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Update docs',
    status: 'closed',
    description: 'Add usage examples',
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Read all tickets from localStorage
 * @returns {Array} Array of ticket objects
 */
function _readAll() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTickets))
    return seedTickets.slice()
  }
  try {
    return JSON.parse(raw)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    return []
  }
}

/**
 * Write all tickets to localStorage
 * @param {Array} tickets Array of ticket objects
 */
function _writeAll(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}

/**
 * Get all tickets
 * @returns {Promise<Array>} Promise resolving to array of tickets
 */
export async function getAllTickets() {
  await wait(250)
  try {
    return _readAll()
  } catch (err) {
    return Promise.reject(new Error('Failed to load tickets. Please retry.'))
  }
}

/**
 * Create a new ticket
 * @param {Object} ticket Ticket object without id
 * @returns {Promise<Object>} Promise resolving to created ticket
 */
export async function createTicket(ticket) {
  await wait(200)
  try {
    const all = _readAll()
    const id = all.length ? Math.max(...all.map((t) => t.id)) + 1 : 1
    const newTicket = {
      id,
      ...ticket,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    all.unshift(newTicket)
    _writeAll(all)
    return newTicket
  } catch {
    return Promise.reject(new Error('Failed to create ticket. Please retry.'))
  }
}

/**
 * Update an existing ticket
 * @param {number} id Ticket ID
 * @param {Object} updates Partial ticket object with updates
 * @returns {Promise<Object>} Promise resolving to updated ticket
 */
export async function updateTicket(id, updates) {
  await wait(200)
  try {
    const all = _readAll()
    const idx = all.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Ticket not found')
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
    _writeAll(all)
    return all[idx]
  } catch {
    return Promise.reject(new Error('Failed to update ticket. Please retry.'))
  }
}

/**
 * Delete a ticket
 * @param {number} id Ticket ID
 * @returns {Promise<boolean>} Promise resolving to true if successful
 */
export async function deleteTicket(id) {
  await wait(200)
  try {
    let all = _readAll()
    const exists = all.some((t) => t.id === id)
    if (!exists) throw new Error('Ticket not found')
    all = all.filter((t) => t.id !== id)
    _writeAll(all)
    return true
  } catch {
    return Promise.reject(new Error('Failed to delete ticket. Please retry.'))
  }
}
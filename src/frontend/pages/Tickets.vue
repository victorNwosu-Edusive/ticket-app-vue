<template>
  <Navbar />
  <Toast v-if="toast" v-bind="toast" @close="toast = null" />

  <div class="max-w-[1440px] mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Ticket Management</h1>

    <div v-if="loadingError" class="mb-4 text-red-600">
      {{ loadingError }} <button class="underline ml-3" @click="load">Retry</button>
    </div>

    <!-- Create Form -->
    <div class="bg-slate-50 rounded-2xl shadow p-6 mb-8">
      <h2 class="font-semibold mb-4">Create a new ticket</h2>
      <form @submit.prevent="handleCreate" class="grid gap-3 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Title *</label>
          <input
            v-model="form.title"
            name="title"
            :class="['w-full mt-1 border rounded-md px-3 py-2 focus:outline-blue-600', formErrors.title ? 'border-red-400' : 'border-gray-300']"
            placeholder="Short descriptive title"
          />
          <p v-if="formErrors.title" class="text-red-500 text-sm mt-1">{{ formErrors.title }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium">Status *</label>
          <select
            v-model="form.status"
            name="status"
            :class="['w-full mt-1 border rounded-md px-3 py-2', formErrors.status ? 'border-red-400' : 'border-gray-300']"
          >
            <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">{{ status }}</option>
          </select>
          <p v-if="formErrors.status" class="text-red-500 text-sm mt-1">{{ formErrors.status }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium">Priority</label>
          <input 
            v-model="form.priority"
            name="priority" 
            class="w-full mt-1 border border-gray-300 rounded-md px-3 py-2" 
            placeholder="low / medium / high" 
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Description</label>
          <textarea 
            v-model="form.description"
            name="description" 
            class="w-full mt-1 border border-gray-300 rounded-md px-3 py-2" 
            rows="4"
          ></textarea>
          <p v-if="formErrors.description" class="text-red-500 text-sm mt-1">{{ formErrors.description }}</p>
        </div>

        <div class="md:col-span-2 flex gap-3">
          <button type="submit" class="bg-blue-700 text-[12px] md:text-sm text-white px-4 py-2 rounded-md">Create Ticket</button>
          <button type="button" @click="resetForm" class="text-[12px] md:text-sm px-4 py-2 rounded-md border-[1px] border-black">Reset</button>
        </div>
      </form>
    </div>

    <!-- Tickets List -->
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
          <button @click="startEdit(ticket)" class="px-3 py-1 text-[12px] md:text-[14px] border rounded-md flex items-center justify-center gap-2"><Edit :size="12" /> Edit</button>
          <button @click="() => handleDelete(ticket.id)" class="px-3 py-1 text-[12px] md:text-[14px] bg-red-500 text-white rounded-md">Delete</button>
        </div>

        <!-- Edit panel (inline) -->
        <div v-if="editing && editing.id === ticket.id" class="w-full md:w-[60%] ml-0 md:ml-4 mt-4">
          <div class="bg-slate-50 p-4 rounded-md border">
            <div class="flex flex-col gap-2">
              <input 
                v-model="editing.form.title"
                name="title" 
                :class="['w-full border rounded px-2 py-1', editErrors.title ? 'border-red-400' : 'border-gray-300']"
              />
              <p v-if="editErrors.title" class="text-red-500 text-sm">{{ editErrors.title }}</p>

              <select 
                v-model="editing.form.status"
                name="status" 
                :class="['w-full border rounded px-2 py-1', editErrors.status ? 'border-red-400' : 'border-gray-300']"
              >
                <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">{{ status }}</option>
              </select>
              <p v-if="editErrors.status" class="text-red-500 text-sm">{{ editErrors.status }}</p>

              <textarea 
                v-model="editing.form.description"
                name="description" 
                class="w-full border rounded px-2 py-1" 
                rows="3"
              ></textarea>

              <div class="flex gap-2 justify-end mt-2">
                <button @click="editing = null" class="px-3 py-1 text-[12px] md:text-[14px] border rounded-md">Cancel</button>
                <button @click="handleSaveEdit" class="px-3 py-1 text-[12px] md:text-[14px] bg-blue-700 text-white rounded-md">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tickets.length === 0" class="text-gray-500">No tickets yet — create one above.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Toast from '../../components/Toast.vue';
import { getAllTickets, createTicket, updateTicket, deleteTicket } from '../../services/ticketService';

const STATUS_OPTIONS = ["open", "in_progress", "closed"];

const statusColor = {
  open: "text-green-800 bg-green-100",
  in_progress: "text-amber-800 bg-amber-100",
  closed: "text-gray-700 bg-gray-100",
};

const emptyForm = { title: "", status: "open", description: "", priority: "" };

// State
const tickets = ref([]);
const loadingError = ref(null);
const toast = ref(null);

// Create form
const form = ref({ ...emptyForm });
const formErrors = ref({});

// Edit state
const editing = ref(null);
const editErrors = ref({});

// Load tickets
const load = async () => {
  try {
    const data = await getAllTickets();
    tickets.value = data;
  } catch (err) {
    loadingError.value = err.message || "Failed to load tickets. Please retry.";
    toast.value = { message: err.message || "Failed to load tickets. Please retry.", type: "error" };
  }
};

onMounted(() => {
  load();
});

// Validation helpers
const validateTicket = (t) => {
  const err = {};
  if (!t.title || !t.title.trim()) err.title = "Title is required";
  if (!t.status || !STATUS_OPTIONS.includes(t.status)) err.status = "Status must be open, in_progress, or closed";
  if (t.description && t.description.length > 1000) err.description = "Description too long (max 1000 chars)";
  return err;
};

// Create
const handleCreate = async (e) => {
  const errs = validateTicket(form.value);
  formErrors.value = errs;
  if (Object.keys(errs).length) return;

  try {
    const created = await createTicket(form.value);
    tickets.value = [created, ...tickets.value];
    resetForm();
    toast.value = { message: "Ticket created successfully", type: "success" };
  } catch (err) {
    toast.value = { message: err.message || "Failed to create ticket", type: "error" };
  }
};

const resetForm = () => {
  form.value = { ...emptyForm };
  formErrors.value = {};
};

// Edit
const startEdit = (ticket) => {
  editing.value = {
    id: ticket.id,
    form: {
      title: ticket.title,
      status: ticket.status,
      description: ticket.description || "",
      priority: ticket.priority || ""
    }
  };
  editErrors.value = {};
};

const handleSaveEdit = async () => {
  const errs = validateTicket(editing.value.form);
  editErrors.value = errs;
  if (Object.keys(errs).length) return;

  try {
    const updated = await updateTicket(editing.value.id, editing.value.form);
    tickets.value = tickets.value.map((t) => (t.id === updated.id ? updated : t));
    editing.value = null;
    toast.value = { message: "Ticket updated", type: "success" };
  } catch (err) {
    toast.value = { message: err.message || "Failed to update ticket", type: "error" };
  }
};

// Delete
const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this ticket?");
  if (!confirmed) return;
  try {
    await deleteTicket(id);
    tickets.value = tickets.value.filter((t) => t.id !== id);
    toast.value = { message: "Ticket deleted", type: "success" };
  } catch (err) {
    toast.value = { message: err.message || "Failed to delete ticket", type: "error" };
  }
};
</script>
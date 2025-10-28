<template>
  <div class="flex justify-center items-center min-h-screen bg-white md:bg-gray-100">
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />

    <div class="bg-white shadow-none md:shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Sign Up</h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Name -->
        <div>
          <label class="block mb-1 font-medium">Name</label>
          <input
            type="text"
            v-model="form.name"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-600"
          />
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            type="email"
            v-model="form.email"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-600"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            type="password"
            v-model="form.password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-600"
          />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <p class="text-center text-sm mt-3">
          Already have an account?
          <router-link to="/auth/login" class="text-blue-600 hover:underline">
            Log in
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../../components/Toast.vue'

const router = useRouter()

onMounted(() => {
  document.title = 'Sign Up - Ticketa'
})
const form = reactive({
  name: '',
  email: '',
  password: ''
})
const errors = reactive({})
const toast = ref(null)

const handleSubmit = () => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  if (!form.password.trim()) errors.password = 'Password is required'
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'

  if (Object.keys(errors).length > 0) return

  const users = JSON.parse(localStorage.getItem('ticketapp_users')) || []
  const exists = users.some(u => u.email === form.email)

  if (exists) {
    toast.value = { message: '⚠ Email already exists!', type: 'error' }
    return
  }

  users.push({ ...form })
  localStorage.setItem('ticketapp_users', JSON.stringify(users))
  toast.value = { message: '☑ Signup successful! Redirecting to login...', type: 'success' }

  setTimeout(() => router.push('/auth/login'), 1500)
}
</script>
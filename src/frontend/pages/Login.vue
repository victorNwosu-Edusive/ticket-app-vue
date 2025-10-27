<template>
  <div class="flex justify-center items-center min-h-screen bg-white md:bg-gray-100">
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />

    <div class="bg-white shadow-none md:shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-600"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            type="password"
            v-model="password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-600"
          />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p class="text-center text-sm mt-3">
          Don't have an account?
          <router-link to="/auth/signup" class="text-blue-600 hover:underline">
            Sign up
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../../components/Toast.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const errors = reactive({})
const toast = ref(null)

const handleSubmit = () => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate
  if (!email.value.trim()) errors.email = 'Email is required'
  if (!password.value.trim()) errors.password = 'Password is required'

  if (Object.keys(errors).length > 0) return

  const storedUsers = JSON.parse(localStorage.getItem('ticketapp_users')) || []
  const user = storedUsers.find(u => u.email === email.value && u.password === password.value)

  if (!user) {
    toast.value = { message: '⚠ Invalid credentials. Try again.', type: 'error' }
    return
  }

  localStorage.setItem(
    'ticketapp_session',
    JSON.stringify({ token: 'fake-token', user })
  )
  toast.value = { message: '☑ Login successful!', type: 'success' }

  setTimeout(() => router.push('/dashboard'), 1000)
}
</script>
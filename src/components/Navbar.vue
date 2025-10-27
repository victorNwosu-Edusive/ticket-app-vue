<template>
  <nav class="w-full border-b bg-white relative z-50">
    <div class="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/">
        <img :src="logoblue" class="h-7 w-auto" alt="Ticketa logo" />
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-4">
        <router-link 
          to="/dashboard" 
          class="text-[12px] md:text-sm hover:underline"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/tickets" 
          class="text-[12px] md:text-sm hover:underline"
        >
          Tickets
        </router-link>
        <button
          @click="handleLogout"
          class="ml-4 flex items-center justify-center gap-3 bg-red-500 text-[12px] md:text-sm text-white px-3 py-2 rounded-md hover:bg-red-600"
        >
          Logout
          <LogOut :size="13" />
        </button>
      </div>

      <!-- Mobile Hamburger Button -->
      <button
        class="md:hidden focus:outline-none relative focus:bg-slate-300 hover:bg-slate-300 duration-100 ease-in w-6 h-6 z-50"
        @click="isOpen = !isOpen"
      >
        <span
          :class="[
            'block absolute w-6 h-0.5 bg-black transition-transform duration-300',
            isOpen ? 'rotate-45' : '-translate-y-1.5'
          ]"
        ></span>
        <span
          :class="[
            'block absolute w-6 h-0.5 bg-black transition-opacity duration-300',
            isOpen ? 'opacity-0' : 'opacity-100'
          ]"
        ></span>
        <span
          :class="[
            'block absolute w-6 h-0.5 bg-black transition-transform duration-300',
            isOpen ? '-rotate-45' : 'translate-y-1.5'
          ]"
        ></span>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen"
        class="md:hidden bg-white border-t shadow-md absolute top-full left-0 w-full"
      >
        <div class="flex flex-col items-center py-4 space-y-2">
          <router-link
            to="/dashboard"
            @click="isOpen = false"
            class="w-full p-3 text-center hover:bg-slate-50 text-sm"
          >
            Dashboard
          </router-link>
          <router-link
            to="/tickets"
            @click="isOpen = false"
            class="w-full p-3 text-center hover:bg-slate-50 text-sm"
          >
            Tickets
          </router-link>
          <button
            @click="handleLogoutAndClose"
            class="bg-red-500 flex items-center justify-center gap-3 text-sm text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
            <LogOut :size="13" />
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoblue from '../assets/images/ticketa-blue.png'
import { LogOut } from 'lucide-vue-next'

const router = useRouter()
const isOpen = ref(false)

const handleLogout = () => {
  localStorage.removeItem('ticketapp_session')
  router.push('/')
}

const handleLogoutAndClose = () => {
  handleLogout()
  isOpen.value = false
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './frontend/pages/Home.vue'
import Login from './frontend/pages/Login.vue'
import Signup from './frontend/pages/Signup.vue'
import Dashboard from './frontend/pages/Dashboard.vue'
import Tickets from './frontend/pages/Tickets.vue'
import './index.css'

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const session = localStorage.getItem('ticketapp_session')
        if (!session) {
          next('/auth/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/tickets',
      name: 'Tickets',
      component: Tickets,
      beforeEnter: (to, from, next) => {
        const session = localStorage.getItem('ticketapp_session')
        if (!session) {
          next('/auth/login')
        } else {
          next()
        }
      }
    }
  ]
})

// Create Vue app
const app = createApp(App)

// Use router
app.use(router)

// Mount app
app.mount('#root')
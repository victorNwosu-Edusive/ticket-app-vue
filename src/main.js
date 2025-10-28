import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './frontend/pages/Home.vue'
import Login from './frontend/pages/Login.vue'
import Signup from './frontend/pages/Signup.vue'
import Dashboard from './frontend/pages/Dashboard.vue'
import Tickets from './frontend/pages/Tickets.vue'
import CreateTicket from './frontend/pages/CreateTicket.vue'
import EditTicket from './frontend/pages/EditTicket.vue'
import './index.css'

const requireSession = (to, from, next) => {
  const session = localStorage.getItem('ticketapp_session')
  if (!session) {
    next('/auth/login')
  } else {
    next()
  }
}

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
      beforeEnter: requireSession
    },
    {
      path: '/tickets',
      name: 'Tickets',
      component: Tickets,
      beforeEnter: requireSession
    },
    {
      path: '/tickets/create',
      name: 'CreateTicket',
      component: CreateTicket,
      beforeEnter: requireSession
    },
    {
      path: '/tickets/:id/edit',
      name: 'EditTicket',
      component: EditTicket,
      beforeEnter: requireSession
    }
  ]
})

const app = createApp(App)

app.use(router)

app.mount('#root')

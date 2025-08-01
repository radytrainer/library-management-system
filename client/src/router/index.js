import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import components
import AppLayout from '@/layouts/AppLayout.vue'
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Dashboard from '@/views/DashboardView.vue'
import BorrowList from '@/views/borrows/BorrowList.vue'

import Website from '@/views/WebsiteView.vue'
import ListBook from '@/views/books/ListBook.vue'
import Aboutpage from '@/views/websites/Aboutpage.vue'

const routes = [
  // Public routes
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false } },

  // Redirect root based on role
  {
    path: '/',
    redirect: (to) => {
      const authStore = useAuthStore()
      const role = authStore.user?.role
      if (role === 'admin') return '/dashboard'
      if (role === 'librarian' || role === 'user') return '/books'
      return '/login'
    }
  },

  // Protected routes
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { roles: ['admin'] },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/User/UserListView.vue'),
        meta: { roles: ['admin', 'librarian'] },
      },
      // {
      //   path: 'donation',
      //   name: 'donation',
      //   component: () => import('@/views/Donation/DonationView.vue'),
      //   meta: { roles: ['admin', 'librarian'] },
      // },
      {
        path: 'books',
        name: 'books',
        component: ListBook,
        meta: { roles: ['admin', 'librarian', 'user'] },
      },
      {
        path: 'borrows',
        name: 'borrows',
        component: BorrowList,
        meta: { roles: ['admin', 'librarian', 'user'] },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/CategoryManagement/categorymanagementView.vue'),
        meta: { roles: ['admin', 'librarian', 'user'] },
      },
      {
        path: 'authors',
        name: 'authors',
        component: () => import('@/views/Author/AddauthorView.vue'),
        meta: { roles: ['admin', 'librarian', 'user'] },
      },
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'borrows', name: 'borrows', component: () => import('@/views/borrows/BorrowList.vue') },
      { path: 'authors', component: () => import('@/views/Author/AddauthorView.vue') },
      { path: 'users', component: () => import('@/views/User/UserListView.vue') },
      { path: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue') },
      { path: 'donations', name: 'donations', component: () => import('@/views/Donate/DonateView.vue') },
      { path: 'books/list', name: 'books/list', component: () => import('@/views/books/ListBook.vue') },
      { path: 'books/all', name: 'books/all', component: () => import('@/views/books/AllBook.vue') },
    ],
  },
  { path: '/website', name: 'website', component: Website },
  { path: '/aboutPage', name: 'aboutPage', component: Aboutpage },
   // ← Moved outside of AppLayout
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

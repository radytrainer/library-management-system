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
      { path: 'books', name: 'books', component: () => import('@/views/books/ListBook.vue') },
      { path: 'borrows', name: 'borrows', component: () => import('@/views/borrows/BorrowList.vue') },
      { path: 'authors', component: () => import('@/views/Author/AddauthorView.vue') },
      { path: 'users', component: () => import('@/views/User/UserListView.vue') },
      { path: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue') },
      { path: 'donations', name: 'doantions', component: () => import('@/views/Donate/DonateView.vue') },

      // Add more routes like books, members, etc.
      { path: 'history', name: 'history', component: () => import('@/views/history/HistoryView.vue') }, // <-- Added history route
    ],
  },
  { path: '/website', name: 'website', component: Website }, // ← Moved outside of AppLayout
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

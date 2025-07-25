import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Dashboard from '@/views/DashboardView.vue'
import Register from '@/views/RegisterView.vue'
import Login from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'books', name: 'books', component: () => import('@/views/books/BookListView.vue') },
      { path: 'borrows', name: 'borrows', component: () => import('@/views/borrows/BorrowList.vue') },
      { path: 'borrows/add', name: 'borrow-add', component: () => import('@/views/borrows/BorrowFormView.vue') },
      { path: 'authors', component: () => import('@/views/Author/AddauthorView.vue') },
      { path: 'users', component: () => import('@/views/User/UserListView.vue') },
      { path: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue') },
      { path: 'donations', name: 'doantions', component: () => import('@/views/Donate/DonateView.vue') },

      // Add more routes like books, members, etc.
    ],
  },
  { path: '/login', component: Login },      // Standalone Login page
  { path: '/register', component: Register } // Standalone Register page
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
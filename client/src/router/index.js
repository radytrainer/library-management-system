import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Dashboard from '@/views/DashboardView.vue'
import Register from '@/views/RegisterView.vue'
import Login from '@/views/LoginView.vue'
import Website from '@/views/WebsiteView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'borrows', name: 'borrows', component: () => import('@/views/borrows/BorrowList.vue') },
      { path: 'authors', component: () => import('@/views/Author/AddauthorView.vue') },
      { path: 'users', component: () => import('@/views/User/UserListView.vue') },
      { path: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue') },
      { path: 'donations', name: 'donations', component: () => import('@/views/Donate/DonateView.vue') },
      { path: 'books/list', name: 'books/list', component: () => import('@/views/books/ListBook.vue') },
      { path: 'books/all', name: 'books/all', component: () => import('@/views/books/AllBook.vue') },
      { path: 'history', name: 'history', component: () => import('@/views/history/HistoryView.vue') },
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

import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Dashboard from '@/views/DashboardView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'books', component: () => import('@/views/books/BookListView.vue') },
      // Add more routes like books, members, etc.
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

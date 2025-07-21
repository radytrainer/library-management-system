import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Dashboard from '@/views/DashboardView.vue'

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
      // Add more routes like books, members, etc.
    ],
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

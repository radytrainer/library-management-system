// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'

// Public Views
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'

// Shared Views
import BookFormView from '@/views/books/BookFormView.vue'
import Dashboard from '@/views/DashboardView.vue'

const routes = [
  // Public routes
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false },
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
        path: 'books',
        name: 'books',
        component: () => import('@/views/books/BookListView.vue'),
        meta: { roles: ['admin', 'librarian'] },
      },
      {
        path: 'borrows',
        name: 'borrows',
        component: BookFormView,
        meta: { roles: ['user', 'admin', 'librarian'] },
      },
      {
        path: 'authors',
        name: 'authors',
        component: () => import('@/views/Author/AddauthorView.vue'),
        meta: { roles: ['admin', 'librarian'] },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/User/UserListView.vue'),
        meta: { roles: ['admin'] },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/CategoryManagement/categorymanagementView.vue'),
        meta: { roles: ['admin', 'librarian'] },
      },
    ],
  },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!authStore.user
  const userRole = authStore.user?.role

  // Public route access
  if (!to.meta.requiresAuth) {
    if (isLoggedIn) {
      // Redirect based on role if already logged in
      if (userRole === 'admin') return next('/dashboard')
      if (userRole === 'user') return next('/borrows')
      return next('/dashboard')
    }
    return next()
  }

  // Protected route access
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // Role check
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next('/dashboard') // or a 403 page
  }

  next()
})

export default router

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import DefaultLayout from '@/views/website/MainWeb.vue'

// Public Views
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Website from '@/views/website/pages/HomeWebView.vue';
import AboutWebView from '@/views/website/pages/AboutWebView.vue';
import BookWebView from '@/views/website/pages/BookWebView.vue'

// Protected Views
import Dashboard from '@/views/DashboardView.vue'
import BorrowList from '@/views/borrows/BorrowList.vue'
import UserListView from '@/views/User/UserListView.vue'
import ListBook from '@/views/books/ListBook.vue'
import DonateView from '@/views/Donate/DonateView.vue'
import UserProfile from '@/components/Users/UserProfile.vue'

const routes = [
  // Public Auth Routes
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false } },

  // Public Website Pages (using DefaultLayout)
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'website', name: 'website', component: Website },
      { path: 'about-us', name: 'about', component: AboutWebView },
      { path: 'web-book', name: 'web-book', component: BookWebView },
    
      
    ]
  },

  // Role-based redirect
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      const role = authStore.user?.role
      if (role === 'admin') return '/dashboard'
      if (role === 'librarian' || role === 'user') return '/books'
      return '/login'
    }
  },


  // Protected Routes (AppLayout)
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { roles: ['admin'] } },
      { path: 'users', name: 'users', component: UserListView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'donations', name: 'donations', component: DonateView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'books', name: 'books', component: ListBook, meta: { roles: ['admin', 'librarian', 'user'] } },
      { path: 'borrows', name: 'borrows', component: BorrowList, meta: { roles: ['admin', 'librarian', 'user'] } },
      { path: 'categories', name: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'authors', name: 'authors', component: () => import('@/views/Author/AddauthorView.vue'), meta: { roles: ['admin', 'librarian','user'] } },
      { path: 'history', name: 'history', component: () => import('@/views/history/HistoryView.vue'), meta: { roles: ['admin', 'librarian', 'user'] } },
      {path:'profile',name:'profile',component:UserProfile}

    ],
  },

  // Fallback
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!authStore.user
  const userRole = authStore.user?.role

  if (to.meta.requiresAuth === false) {
    if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
      if (userRole === 'admin') return next('/dashboard')
      if (userRole === 'librarian' || userRole === 'user') return next('/books')
    }
    return next()
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    if (userRole === 'admin') return next('/dashboard')
    if (userRole === 'librarian' || userRole === 'user') return next('/books')
    return next('/login')
  }

  next()
})

export default router

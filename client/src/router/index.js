// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

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
      const authStore = useUserStore()
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
      {path:'profile',name:'profile',component:UserProfile, meta: { roles: ['admin', 'librarian', 'user'] }}

    ],
  },

  // Fallback
  // { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global Navigation Guard with logging
router.beforeEach(async (to, from, next) => {
  console.log('--- Navigation Attempt ---')
  console.log('From:', from.fullPath)
  console.log('To:', to.fullPath)

  const authStore = useUserStore()
  const token = localStorage.getItem('token')

  console.log('Token from localStorage:', token)

  if (!authStore.user && token) {
    console.log('No user in store but token exists, fetching profile...')
    const result = await authStore.fetchProfile()
    console.log('Profile fetch result:', result)
    if (!result.success) {
      console.log('Invalid token, clearing token and redirecting to login')
      localStorage.removeItem('token')
      return next('/login')
    }
  }

  const isLoggedIn = !!authStore.user
  const userRole = authStore.user?.role

  console.log('Is Logged In:', isLoggedIn)
  console.log('User Role:', userRole)
  console.log('Route requires auth:', to.meta.requiresAuth)
  console.log('Route roles:', to.meta.roles)

  // Public pages (login/register) when logged in redirect
  if (to.meta.requiresAuth === false) {
    if  (to.meta.requiresAuth === false) {
      console.log('User already logged in, redirecting based on role...')
      if (userRole === 'admin') return next('/dashboard')
      if (userRole === 'librarian' || userRole === 'user') return next('/books')
    }
    return next()
  }

  // Protected routes require login
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log('Not logged in but route requires auth, redirecting to login')
    return next('/login')
  }

  // Role-based access control
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    console.log('User role not authorized for this route.')
    if (userRole === 'admin') return next('/dashboard')
    if (userRole === 'librarian' || userRole === 'user') return next('/books')
    return next('/login')
  }

  console.log('Navigation allowed')
  next()
})





export default router

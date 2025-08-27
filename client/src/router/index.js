// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import DefaultLayout from '@/views/website/MainWeb.vue'

// Public Views
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Website from '@/views/website/pages/HomeWebView.vue'
import AboutWebView from '@/views/website/pages/AboutWebView.vue'
import BookWebView from '@/views/website/pages/BookWebView.vue'
import profileWeb from '@/views/website/pages/profile-web.vue'

// Protected Views
import Dashboard from '@/views/DashboardView.vue'
import BorrowList from '@/views/borrows/BorrowList.vue'
import UserListView from '@/views/User/UserListView.vue'
import ListBook from '@/views/books/BookList.vue'
import LanguageView from '@/views/Lang/LanguageView.vue'
import UserProfile from '@/components/Users/UserProfile.vue'

const routes = [
  // Redirect root to login
  { path: '/', redirect: '/login' },

  // Public Auth Routes
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false } },

  // Public Website Pages (DefaultLayout)
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'website', name: 'website', component: Website },
      { path: 'about-us', name: 'about', component: AboutWebView },
      { path: 'web-book', name: 'web-book', component: BookWebView },
      { path: 'profile-web', name: 'profile-web', component: profileWeb },
    ]
  },

  // Role-based redirect after login
  { path: '/', redirect: '/login' },

  // Protected Routes (AppLayout)
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { roles: ['admin'] } },
      { path: 'users', name: 'users', component: UserListView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'language', name: 'language', component: LanguageView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'books', name: 'books', component: ListBook, meta: { roles: ['admin', 'librarian'] } },
      { path: 'borrows', name: 'borrows', component: BorrowList, meta: { roles: ['admin', 'librarian'] } },
      { path: 'categories', name: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'authors', name: 'authors', component: () => import('@/views/Author/AddauthorView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'history', name: 'history', component: () => import('@/views/history/HistoryView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'profile', name: 'profile', component: UserProfile, meta: { roles: ['admin', 'librarian'] } },
    ],
  },

  // Fallback to login for unmatched routes
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useUserStore();

  // Fetch profile if token exists but no user in store
  if (!authStore.user && localStorage.getItem('token')) {
    try {
      await authStore.fetchUserProfile();
    } catch {
      authStore.resetAuth();
      return next('/login');
    }
  }

  const isLoggedIn = !!authStore.user;
  const userRole = authStore.user?.role;

  // Public pages
  if (to.meta.requiresAuth === false) {
    if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
      // Redirect logged-in users to their appropriate route
      if (userRole === 'admin' && to.path !== '/dashboard') return next('/dashboard');
      if (userRole === 'librarian' && to.path !== '/books') return next('/books');
      if ((userRole === 'user' || userRole === 'borrower') && to.path !== '/website') return next('/website');
    }
    return next();
  }

  // Protected pages - must login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login');
  }

  // Role-based restriction
  if (to.meta.roles && userRole && !to.meta.roles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'admin' && to.path !== '/dashboard') return next('/dashboard');
    if (userRole === 'librarian' && to.path !== '/books') return next('/books');
    if ((userRole === 'user' || userRole === 'borrower') && to.path !== '/website') return next('/website');
    return next('/login');
  }

  next();
});

export default router
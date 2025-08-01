<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'// ✅ import your Pinia store
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const language = ref('en')
const searchQuery = ref('')
const notifications = ref(3)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const isSidebarOpen = ref(true)
const isOpen = ref(false)

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' }, roles: ['admin'] },
  { path: '/books', icon: 'menu_book', label: { en: 'Books', kh: 'សៀវភៅ' }, roles: ['admin', 'librarian', 'user'] },
  { path: '/borrows', icon: 'autorenew', label: { en: 'Borrow', kh: 'ខ្ចី' }, roles: ['admin', 'librarian', 'user'] },
  { path: '/history', icon: 'history', label: { en: 'History', kh: 'ប្រវត្តិ' }, roles: ['admin', 'librarian', 'user'] },
  { path: '/categories', icon: 'category', label: { en: 'Categories', kh: 'ប្រភេទ' }, roles: ['admin', 'librarian', 'user'] },
  { path: '/authors', icon: 'person', label: { en: 'Authors', kh: 'អ្នកនិពន្ធ' }, roles: ['admin', 'librarian', 'user'] },
  { path: '/donations', icon: 'volunteer_activism', label: { en: 'Donations', kh: 'ការបរិច្ចាគ' }, roles: ['admin', 'librarian'] },
  { path: '/users', icon: 'people', label: { en: 'Users', kh: 'អ្នកប្រើប្រាស់' }, roles: ['admin'] }
]

// ✅ Filter navigation by role
const filteredNav = computed(() => {
  return navItems.filter(item => item.roles.includes(authStore.user?.role || ''))
})


// ✅ Language switch
function selectLanguage(lang) {
  language.value = lang
  localStorage.setItem('language', language.value)
  isOpen.value = false
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showProfileDropdown.value = false
}

function clearNotifications() {
  notifications.value = 0
  showNotifications.value = false
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
const user = ref({
  name: '',
  email: '',
  role: '',
  profile_image: ''
})

function logout() {
  authStore.reset()
  user.value = { name: '', email: '', role: '', profile_image: '' }
  router.push('/login')
}




const profileInitial = computed(() => {
  if (user.value.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return '?'
})


onMounted(() => {
  language.value = localStorage.getItem('language') || 'en'
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser)
    user.value = parsedUser
    authStore.user = parsedUser // ✅ Sync Pinia store
  }
})



// ✅ Dynamic Page Title
const pageTitle = computed(() => {
  const map = {
    dashboard: { en: 'Library Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រងបណ្ណាល័យ' },
    borrows: { en: 'Borrow Management', kh: 'គ្រប់គ្រងការខ្ចីសៀវភៅ' },
    books: { en: 'Book Management', kh: 'គ្រប់គ្រងសៀវភៅ' },
    users: { en: 'User Management', kh: 'គ្រប់គ្រងអ្នកប្រើ' },
    authors: { en: 'Author Management', kh: 'គ្រប់គ្រងអ្នកនិពន្ធ' },
    categories: { en: 'Category Management', kh: 'គ្រប់គ្រងប្រភេទសៀវភៅ' },
    donations: { en: 'Donations', kh: 'ការបរិច្ចាគ' },
    history: { en: 'History', kh: 'ប្រវត្តិការខ្ចីសៀវភៅ' }
  }
  const key = route.name
  return map[key]?.[language.value] || (language.value === 'en' ? 'Library System' : 'ប្រព័ន្ធបណ្ណាល័យ')
})
</script>

<template>
  <div class="flex min-h-screen bg-custom-gray text-gray-900 font-inter">
    <!-- ✅ Sidebar -->
    <aside
      :class="['bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-r-lg text-gray-100 flex flex-col h-screen fixed left-0 transition-all duration-300 shadow-lg', isSidebarOpen ? 'w-64' : 'w-20']">
      <div v-if="isSidebarOpen" class="p-6 flex flex-col items-center border-b border-indigo-600">
        <img src="/logo.png" alt="Library Logo" class="h-20 w-23" />
        <h2 class="text-2xl font-bold tracking-tight" :class="{ 'font-khmer': language === 'kh' }">
          {{ language === 'en' ? 'Library System' : 'ប្រព័ន្ធបណ្ណាល័យ' }}
        </h2>
      </div>

      <nav class="flex-1 overflow-y-auto">
        <ul class="space-y-1 p-4" :class="{ 'font-khmer': language === 'kh' }">
          <li v-for="item in filteredNav" :key="item.path">
            <RouterLink :to="item.path" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">{{ item.icon }}</span>
              <span v-if="isSidebarOpen">{{ item.label[language] }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/website" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">public</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Website' : 'គេហទំព័រ' }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- ✅ Main Content -->
    <div class="flex-1 flex flex-col transition-all duration-300"
      :class="{ 'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen }">
      <!-- ✅ Header -->
      <!-- Top Navbar -->
      <header class="sticky top-0 z-40 bg-white shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <!-- Sidebar Toggle Button -->
          <button
            @click="toggleSidebar"
            class="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <span class="material-icons text-2xl">{{ isSidebarOpen ? 'menu_open' : 'menu' }}</span>
          </button>
          <h1 class="text-2xl font-semibold tracking-tight" :class="{ 'font-khmer': language === 'kh' }">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="language === 'en' ? 'Search books...' : 'ស្វែងរកសៀវភៅ...'"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
              :class="{ 'font-khmer': language === 'kh' }"
              aria-label="Search"
            />
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
          </div>

          <!-- Language Switch -->
          <div class="relative inline-block text-left">
            <button
              @click="isOpen = !isOpen"
              class="border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
              :class="{ 'font-khmer': language === 'kh' }"
              aria-haspopup="true"
              :aria-expanded="isOpen.toString()"
              aria-label="Select language"
              type="button"
            >
              <img
                :src="language === 'en' ? 'https://flagcdn.com/w40/us.png' : 'https://flagcdn.com/w40/kh.png'"
                class="w-5 h-4 mr-2"
                :alt="language === 'en' ? 'US Flag' : 'Cambodia Flag'"
              />
              {{ language === 'en' ? 'English' : 'ភាសាខ្មែរ' }}
              <span class="ml-2 material-icons">arrow_drop_down</span>
            </button>
            <div
              v-if="isOpen"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              role="menu"
              aria-orientation="vertical"
              tabindex="-1"
            >
              <a
                href="#"
                @click.prevent="selectLanguage('en')"
                class="flex items-center p-2 hover:bg-gray-100 text-sm"
                role="menuitem"
                tabindex="0"
              >
                <img src="https://flagcdn.com/w40/us.png" class="w-5 h-4 mr-2" alt="US Flag" />
                English
              </a>
              <a
                href="#"
                @click.prevent="selectLanguage('kh')"
                class="flex items-center p-2 hover:bg-gray-100 text-sm"
                role="menuitem"
                tabindex="0"
              >
                <img src="https://flagcdn.com/w40/kh.png" class="w-5 h-4 mr-2" alt="Cambodia Flag" />
                ភាសាខ្មែរ
              </a>
            </div>
          </div>

          <!-- Notification -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="material-icons text-gray-600 cursor-pointer hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle notifications"
              aria-expanded="showNotifications.toString()"
            >
              notifications
            </button>
            <span
              v-if="notifications > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-label="You have new notifications"
            >
              {{ notifications }}
            </span>
            <!-- Notification Dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-100"
              role="region"
              aria-live="polite"
            >
              <p class="text-sm text-gray-600" :class="{ 'font-khmer': language === 'kh' }">
                {{ language === 'en' ? 'You have' : 'អ្នកមាន' }} {{ notifications }}
                {{ language === 'en' ? 'new notifications' : 'ការជូនដំណឹងថ្មី' }}
              </p>
              <button
                class="mt-3 text-sm text-indigo-600 hover:underline"
                @click="clearNotifications"
                aria-label="Clear all notifications"
              >
                {{ language === 'en' ? 'Clear All' : 'លុបទាំងអស់' }}
              </button>
            </div>
          </div>

          <!-- Profile -->
          <div class="relative">
            <div v-if="user.profile_image">
              <img :src="user.profile_image" alt="Profile"
                class="h-10 w-10 rounded-full cursor-pointer border border-gray-200 hover:border-indigo-400"
                @click="toggleProfileDropdown" />
            </div>

            <!-- Fallback if no profile image -->
            <div v-else
              class="h-10 w-10 rounded-full cursor-pointer bg-indigo-600 text-white flex items-center justify-center font-bold border border-gray-200 hover:border-indigo-400"
              @click="toggleProfileDropdown">
              {{ profileInitial }}
            </div>

            <div v-if="showProfileDropdown"
              class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-100">
              <p class="text-sm font-semibold">{{ user.username }}</p>
              <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
              <button
                class="mt-3 w-full text-left text-sm text-red-600 hover:bg-red-50 rounded px-2 py-1"
                @click="logout"
                role="menuitem"
              >
                {{ language === 'en' ? 'Logout' : 'ចាកចេញ' }}
              </button>


            </div>
          </div>
        </div>
      </header>

      <!-- ✅ Page Content -->
      <main class="p-2">
        <RouterView />
      </main>
    </div>
  </div>
</template>

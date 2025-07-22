<template>
  <div class="flex min-h-screen bg-custom-gray text-gray-900 font-inter ">
    <!-- Sidebar (Left-aligned, Collapsible) -->
    <aside :class="[
      'bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-r-lg text-gray-100 flex flex-col h-screen fixed left-0 transition-all duration-300 shadow-lg',
      isSidebarOpen ? 'w-64' : 'w-20'
    ]">
      <!-- Logo and Title (Shown only when open) -->
      <div v-if="isSidebarOpen" class="p-6 flex flex-col items-center border-b border-indigo-600 ">
        <img src="/logo.png" alt="Library Logo" class="h-20 w-23" />
        <h2 class="text-2xl font-bold tracking-tight" :class="{ 'font-khmer': language === 'kh' }">
          {{ language === 'en' ? 'Library System' : 'ប្រព័ន្ធបណ្ណាល័យ' }}
        </h2>
      </div>
      <!-- Navigation -->
      <nav class="flex-1">
        <ul class="space-y-1 p-4" :class="{ 'font-khmer': language === 'kh' }">
          <li>
            <RouterLink to="/dashboard" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/dashboard' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">dashboard</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/books" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/books' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">menu_book</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Books' : 'សៀវភៅ' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/borrows" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/borrows' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">autorenew</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Borrow' : 'ខ្ចី' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/categories" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/categories' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">category</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Categories' : 'ប្រភេទ' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/authors" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/authors' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">person</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Authors' : 'អ្នកនិពន្ធ' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/donations" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/donations' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">volunteer_activism</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Donations' : 'ការបរិច្ចាគ' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/history" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/history' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">history</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'History' : 'ប្រវត្តិ' }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/users" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
              $route.path === '/users' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">people</span>
              <span v-if="isSidebarOpen">
                {{ language === 'en' ? 'Users' : 'អ្នកប្រើប្រាស់' }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col transition-all duration-300"
      :class="{ 'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen }">
      <!-- Top Navbar -->
      <header class=" shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <!-- Sidebar Toggle Button -->
          <button @click="toggleSidebar"
            class="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100">
            <span class="material-icons text-2xl">
              {{
                isSidebarOpen ? 'menu_open' : 'menu'
              }}</span>
          </button>
          <h1 class="text-2xl font-semibold tracking-tight" :class="{ 'font-khmer': language === 'kh' }">
            {{ pageTitle }}
          </h1>

        </div>
        <div class="flex items-center space-x-3">
          <!-- Search Bar -->
          <div class="relative">
            <input type="text" v-model="searchQuery"
              :placeholder="language === 'en' ? 'Search books...' : 'ស្វែងរកសៀវភៅ...'"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
              :class="{ 'font-khmer': language === 'kh' }" />
            <span
              class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">search</span>
          </div>
          <!-- Language Switcher -->
          <div class="relative inline-block text-left">
            <button @click="isOpen = !isOpen"
              class="border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
              :class="{ 'font-khmer': language === 'kh' }">
              <img :src="language === 'en' ? 'https://flagcdn.com/w40/us.png' : 'https://flagcdn.com/w40/kh.png'"
                class="w-5 h-4 mr-2" :alt="language === 'en' ? 'US Flag' : 'Cambodia Flag'" />
              {{ language === 'en' ? 'English' : 'ភាសាខ្មែរ' }}
              <span class="ml-2 material-icons">arrow_drop_down</span>
            </button>
            <div v-if="isOpen"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <a href="#" @click.prevent="selectLanguage('en')" class="flex items-center p-2 hover:bg-gray-100 text-sm">
                <img src="https://flagcdn.com/w40/us.png" class="w-5 h-4 mr-2" alt="US Flag" />
                English
              </a>
              <a href="#" @click.prevent="selectLanguage('kh')" class="flex items-center p-2 hover:bg-gray-100 text-sm">
                <img src="https://flagcdn.com/w40/kh.png" class="w-5 h-4 mr-2" alt="Cambodia Flag" />
                ភាសាខ្មែរ
              </a>
            </div>
          </div>
          <!-- Notification Icon -->
          <div class="relative">
            <span
              class="material-icons text-gray-600 cursor-pointer hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
              @click="toggleNotifications">notifications</span>
            <span v-if="notifications > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ notifications }}
            </span>
            <!-- Notification Dropdown -->
            <div v-if="showNotifications"
              class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-100">
              <p class="text-sm text-gray-600" :class="{ 'font-khmer': language === 'kh' }">
                {{ language === 'en' ? 'You have' : 'អ្នកមាន' }} {{ notifications }}
                {{ language === 'en' ? 'new notifications' : 'ការជូនដំណឹងថ្មី' }}
              </p>
              <button class="mt-3 text-sm text-indigo-600 hover:underline" @click="clearNotifications">
                {{ language === 'en' ? 'Clear All' : 'លុបទាំងអស់' }}
              </button>
            </div>
          </div>
          <!-- Profile Dropdown -->
          <div class="relative">
            <img src="https://i.pinimg.com/736x/4c/86/d3/4c86d30bd3fcfb2940545982b74ee2d4.jpg" alt="Profile"
              class="h-10 w-10 rounded-full cursor-pointer border border-gray-200 hover:border-indigo-400"
              @click="toggleProfileDropdown" />
            <div v-if="showProfileDropdown"
              class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-100">
              <p class="text-sm font-semibold">{{ user.name }}</p>
              <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
              <button class="mt-3 w-full text-left text-sm text-red-600 hover:bg-red-50 rounded px-2 py-1"
                @click="logout">
                {{ language === 'en' ? 'Logout' : 'ចាកចេញ' }}
              </button>
            </div>
          </div>
        </div>
      </header>
      <!-- Page Content -->
      <main class="p-6 ">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const language = ref('en')
const searchQuery = ref('')
const notifications = ref(3)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const isSidebarOpen = ref(true)
const isOpen = ref(false)

const user = ref({
  name: 'Admin User',
  email: 'admin@library.com',
})

function switchLanguage() {
  localStorage.setItem('language', language.value)
  isOpen.value = false
}

function selectLanguage(lang) {
  language.value = lang
  switchLanguage()
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

function logout() {
  console.log('Logged out')
  router.push('/login')
}

onMounted(() => {
  language.value = localStorage.getItem('language') || 'en'
})

// ✅ Computed Page Title
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

<style scoped>
/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Khmer&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.font-khmer {
  font-family: 'Khmer', sans-serif;
}
</style>
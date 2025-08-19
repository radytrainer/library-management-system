<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { debounce } from 'lodash';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Swal from 'sweetalert2';

// Stores, router, and i18n
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

// State
const searchQuery = ref('');
const notifications = ref(3);
const showNotifications = ref(false);
const showProfileDropdown = ref(false);
const isSidebarOpen = ref(true);
const isOpen = ref(false); // Language dropdown
const isLoading = ref(false);

// Supported languages
const supportedLanguages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'kh', name: 'Khmer', flag: 'https://flagcdn.com/w40/kh.png' },
];

// Navigation items with role-based access
const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'nav.dashboard', roles: ['admin'] },
  { path: '/books', icon: 'menu_book', label: 'nav.books', roles: ['admin', 'librarian', 'user'] },
  { path: '/borrows', icon: 'autorenew', label: 'nav.borrow', roles: ['admin', 'librarian', 'user'] },
  { path: '/categories', icon: 'category', label: 'nav.categories', roles: ['admin', 'librarian', 'user'] },
  { path: '/authors', icon: 'person', label: 'nav.authors', roles: ['admin', 'librarian', 'user'] },
  { path: '/languages', icon: 'language', label: 'nav.languages', roles: ['admin', 'librarian'] },
  { path: '/users', icon: 'people', label: 'nav.users', roles: ['admin', 'librarian'] },
  { path: '/history', icon: 'history', label: 'nav.history', roles: ['admin', 'librarian'] },
  { path: '/profile', icon: 'account_circle', label: 'nav.account', roles: ['admin', 'librarian', 'user'] },
];

// Filter nav based on user role
const filteredNav = computed(() => {
  const role = userStore.user?.role;
  if (!role) return [];
  return role === 'admin' ? navItems : navItems.filter(item => item.roles.includes(role));
});

const profileInitial = computed(() => userStore.user?.email?.charAt(0)?.toUpperCase() || '?');

const profileImageUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  let image = userStore.user?.profile_image || userStore.profileImage || '';
  if (image && !image.startsWith('http') && !image.startsWith('data:image')) {
    image = `${baseUrl}/uploads/profile/${image}`;
  }
  const isValidUrl = image && (image.startsWith('http') || image.startsWith('data:image'));
  return isValidUrl ? `${image}?t=${new Date().getTime()}` : '/default-profile.png';
});

const pageTitle = computed(() => {
  const map = {
    dashboard: 'page.dashboard',
    borrows: 'page.borrowManagement',
    books: 'page.bookManagement',
    users: 'page.userManagement',
    authors: 'page.authorManagement',
    categories: 'page.categoryManagement',
    languages: 'page.languages',
    history: 'page.history',
    profile: 'page.profile',
  };
  const key = route.name || route.path.split('/')[1] || 'dashboard';
  return t(map[key] || 'page.default');
});

// Language switcher
async function selectLanguage(lang) { // Line ~97
  if (!supportedLanguages.some(l => l.code === lang)) {
    Swal.fire({
      icon: 'error',
      title: t('error.title'),
      text: t('error.unsupportedLanguage', { lang }),
    });
    return;
  }
  try {
    isLoading.value = true;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/languages/toggle`,
      { locale: lang },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );

    if (response.data.success) {
      locale.value = response.data.data.locale;
      userStore.setLanguage(response.data.data.locale);
      document.documentElement.setAttribute('lang', response.data.data.locale);
      isOpen.value = false;
      Swal.fire({
        icon: 'success',
        title: t('success.title'),
        text: t('success.languageSwitched', { lang: t(`language.${response.data.data.locale}`) }),
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error switching language:', error); // Line ~112
    Swal.fire({
      icon: 'error',
      title: t('error.title'),
      text: t('error.languageSwitchFailed', { message: error.response?.data?.message || error.message }),
    });
    // Fallback to local storage
    locale.value = lang;
    userStore.setLanguage(lang);
    document.documentElement.setAttribute('lang', lang);
  } finally {
    isLoading.value = false;
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  showProfileDropdown.value = false;
  isOpen.value = false;
}

function clearNotifications() {
  notifications.value = 0;
  showNotifications.value = false;
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value;
  showNotifications.value = false;
  isOpen.value = false;
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const performSearch = debounce(async () => {
  if (searchQuery.value) console.log(`Searching for: ${searchQuery.value}`);
}, 300);

async function fetchTranslations() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/language`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    if (response.data.success) {
      locale.value = response.data.data.locale;
      userStore.setLanguage(response.data.data.locale);
      document.documentElement.setAttribute('lang', response.data.data.locale);
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = supportedLanguages.some(l => l.code === browserLang) ? browserLang : 'en';
    locale.value = userStore.language || defaultLang;
    userStore.setLanguage(defaultLang);
    document.documentElement.setAttribute('lang', defaultLang);
  }
}

function logout() {
  userStore.logout();
  showProfileDropdown.value = false;
  router.push('/login');
}

function handleClickOutside(event) {
  const dropdowns = [
    { button: '.profile-button', menu: '.profile-menu', state: showProfileDropdown },
    { button: '.notifications-button', menu: '.notifications-menu', state: showNotifications },
    { button: '.language-button', menu: '.language-menu', state: isOpen },
  ];

  dropdowns.forEach((d) => {
    const btn = document.querySelector(d.button);
    const menu = document.querySelector(d.menu);
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
      d.state.value = false;
    }
  });
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  if (userStore.profileImage && !userStore.user?.profile_image) {
    userStore.user = { ...userStore.user, profile_image: userStore.profileImage };
  }
  await userStore.fetchUserProfile();
  await fetchTranslations();
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div class="flex min-h-screen bg-custom-gray text-gray-900 font-inter" :dir="locale.value === 'kh' ? 'ltr' : 'ltr'">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-r-lg text-gray-100 flex flex-col h-screen fixed left-0 transition-all duration-300 shadow-lg',
        isSidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <div v-if="isSidebarOpen" class="p-6 flex flex-col items-center border-b border-indigo-600">
        <img src="/logo.png" alt="Library Logo" class="h-20 w-30" />
        <h2 class="text-2xl font-bold tracking-tight" :class="{ 'font-khmer': locale.value === 'kh' }">
          {{ t('sidebar.title') }}
        </h2>
      </div>
      <nav class="flex-1 overflow-y-auto no-scrollbar">
        <ul class="space-y-1 p-4" :class="{ 'font-khmer': locale.value === 'kh' }">
          <li v-for="item in filteredNav" :key="item.path">
            <RouterLink
              :to="item.path"
              :class="[
                'flex items-center p-3 rounded-lg transition-colors duration-200',
                isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
                $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : '',
              ]"
              :aria-label="t(item.label)"
            >
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">{{ item.icon }}</span>
              <span v-if="isSidebarOpen">{{ t(item.label) }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/website"
              :class="[
                'flex items-center p-3 rounded-lg transition-colors duration-200',
                isSidebarOpen ? 'hover:bg-custom-hover-page' : 'justify-center hover:bg-custom-hover-page',
                $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : '',
              ]"
              :aria-label="t('nav.website')"
            >
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">public</span>
              <span v-if="isSidebarOpen">{{ t('nav.website') }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="{ 'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen }"
    >
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            :aria-label="t('aria.toggleSidebar')"
          >
            <span class="material-icons text-2xl">{{ isSidebarOpen ? 'menu_open' : 'menu' }}</span>
          </button>
          <h1 class="text-2xl font-semibold tracking-tight" :class="{ 'font-khmer': locale.value === 'kh' }">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="t('search.placeholder')"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
              :class="{ 'font-khmer': locale.value === 'kh' }"
              :aria-label="t('aria.searchBooks')"
            />
            <span
              class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
            >
              search
            </span>
          </div>

          <!-- Language Switch -->
          <div class="relative">
            <button
              @click="isOpen = !isOpen"
              class="language-button border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
              :class="{ 'font-khmer': locale.value === 'kh' }"
              aria-haspopup="true"
              :aria-expanded="isOpen.toString()"
              :aria-label="t('aria.selectLanguage')"
            >
              <img
                :src="supportedLanguages.find(l => l.code === locale)?.flag || 'https://flagcdn.com/w40/us.png'"
                class="w-5 h-4 mr-2"
                :alt="t(`language.${locale}.flagAlt`)"
              />
              {{ t(`${locale}`) }}
              <span class="ml-2 material-icons">arrow_drop_down</span>
            </button>
            <div
              v-if="isOpen"
              class="language-menu absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-200"
              role="menu"
              aria-orientation="vertical"
              tabindex="-1"
            >
              <a
                v-for="lang in supportedLanguages"
                :key="lang.code"
                href="#"
                @click.prevent="selectLanguage(lang.code)"
                class="flex items-center p-2 hover:bg-gray-100 text-sm"
                :class="{ 'font-khmer': lang.code === 'kh' }"
                role="menuitem"
                tabindex="0"
                :aria-label="t(`language.${lang.code}`)"
              >
                <img :src="lang.flag" class="w-5 h-4 mr-2" :alt="t(`language.${lang.code}.flagAlt`)" />
                {{ t(`language.${lang.code}`) }}
              </a>
            </div>
          </div>

          <!-- Notifications -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="notifications-button material-icons text-gray-600 cursor-pointer hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
              :aria-label="t('aria.toggleNotifications')"
              :aria-expanded="showNotifications.toString()"
            >
              notifications
            </button>
            <span
              v-if="notifications > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              :aria-label="t('aria.notificationCount', { count: notifications })"
            >
              {{ notifications }}
            </span>
            <div
              v-if="showNotifications"
              class="notifications-menu absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-100 transition-opacity duration-200"
              role="region"
              aria-live="polite"
            >
              <p class="text-sm text-gray-600" :class="{ 'font-khmer': locale.value === 'kh' }">
                {{ t('notifications.youHave', { count: notifications }) }}
              </p>
              <button
                class="mt-3 text-sm text-indigo-600 hover:underline"
                @click="clearNotifications"
                :aria-label="t('aria.clearNotifications')"
              >
                {{ t('notifications.clearAll') }}
              </button>
            </div>
          </div>

          <!-- Profile -->
          <div class="relative">
            <div
              class="profile-button h-10 w-10 rounded-full cursor-pointer border border-gray-200 hover:border-indigo-400"
              @click="toggleProfileDropdown"
              role="button"
              :aria-label="t('aria.toggleProfile')"
            >
              <img
                :src="profileImageUrl"
                alt="Profile"
                class="h-full w-full rounded-full object-cover"
                @error="() => userStore.profileImage = '/default-profile.png'"
              />
            </div>
            <div
              v-if="showProfileDropdown"
              class="profile-menu absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-100 transition-opacity duration-200"
              role="menu"
            >
              <div class="border-b border-gray-200 pb-2 mb-2">
                <p class="text-sm font-medium" :class="{ 'font-khmer': locale.value === 'kh' }">
                  {{ userStore.user?.username || t('profile.unknown') }}
                </p>
                <p class="text-xs text-gray-500" :class="{ 'font-khmer': locale.value === 'kh' }">
                  {{ userStore.user?.email || t('profile.noEmail') }}
                </p>
              </div>
              <router-link
                to="/profile"
                class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                role="menuitem"
                @click="showProfileDropdown = false"
                :aria-label="t('profile.view')"
              >
                <span class="material-symbols-outlined text-blue-600 mr-2">person</span>
                {{ t('profile.view') }}
              </router-link>
              <button
                @click="logout"
                class="w-full text-left flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded"
                role="menuitem"
                :aria-label="t('profile.logout')"
              >
                <span class="material-symbols-outlined mr-2">logout</span>
                {{ t('profile.logout') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main>
        <RouterView v-if="!isLoading" />
        <div v-else class="flex justify-center items-center h-full">
          <p class="text-gray-600" :class="{ 'font-khmer': locale.value === 'kh' }">
            {{ t('loading') }}
          </p>
        </div>
      </main>
    </div>
  </div>
</template>
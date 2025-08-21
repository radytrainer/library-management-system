<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { debounce } from "lodash";
import { defineEmits } from "vue";

// Stores and router
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// State
const language = ref(localStorage.getItem("language") || "en");
const searchQuery = ref("");
const notifications = ref(0);
const showNotifications = ref(false);
const showProfileDropdown = ref(false);
const isSidebarOpen = ref(true);
const isOpen = ref(false);
const isLoading = ref(false);
const emit = defineEmits(["profileClicked"]);

// Navigation items with role-based access
const navItems = [
  {
    path: "/dashboard",
    icon: "dashboard",
    label: { en: "Dashboard", kh: "ផ្ទាំងគ្រប់គ្រង" },
    roles: ["admin"],
  },
  {
    path: "/books",
    icon: "menu_book",
    label: { en: "Books", kh: "សៀវភៅ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/borrows",
    icon: "autorenew",
    label: { en: "Borrow", kh: "ខ្ចី" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/categories",
    icon: "category",
    label: { en: "Categories", kh: "ប្រភេទ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/authors",
    icon: "person",
    label: { en: "Authors", kh: "អ្នកនิពន្ធ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/Language",
    icon: "language",
    label: { en: "Languages", kh: "ភាសា" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/users",
    icon: "people",
    label: { en: "Users", kh: "អ្នកប្រើប្រាស់" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/history",
    icon: "history",
    label: { en: "History", kh: "ប្រវត្តិ" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/profile",
    icon: "account_circle",
    label: { en: "Account", kh: "ប្រវត្តិរូប" },
    roles: ["admin", "librarian", "user"],
  },
];

// Filter nav based on user role
const filteredNav = computed(() => {
  const role = userStore.user?.role;
  if (!role) return [];
  return role === "admin"
    ? navItems
    : navItems.filter((item) => item.roles.includes(role));
});

const profileInitial = computed(
  () => userStore.user?.email?.charAt(0)?.toUpperCase() || "?"
);

const profileImageUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  let image =
    userStore.user?.profile_image || localStorage.getItem("profile_image") || "";
  if (image && !image.startsWith("http") && !image.startsWith("data:image"))
    image = `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const isValidUrl =
    image && (image.startsWith("http") || image.startsWith("data:image"));
  const finalImage = isValidUrl ? image : "/default-profile.png";
  return finalImage.startsWith("http")
    ? `${finalImage}?t=${new Date().getTime()}`
    : finalImage;
});

const pageTitle = computed(() => {
  const map = {
    dashboard: { en: "Library Dashboard", kh: "ផ្ទាំងគ្រប់គ្រងបណ្ចាល័យ" },
    borrows: { en: "Borrow Management", kh: "គ្រប់គ្រងការខ្ចីសៀវភៅ" },
    books: { en: "Book Management", kh: "គ្រប់គ្រងសៀវភៅ" },
    users: { en: "User Management", kh: "គ្រប់គ្រងអ្នកប្រើ" },
    authors: { en: "Author Management", kh: "គ្រប់គ្រងអ្នកនិពន្ធ" },
    categories: { en: "Category Management", kh: "គ្រប់គ្រងប្រភេទសៀវភៅ" },
    Language: { en: "Language", kh: "ភាសា" },
    history: { en: "History", kh: "ប្រវត្តិការខ្ចី" },
    profile: { en: "Profile", kh: "ប្រវត្តិរូប" },
  };
  const key = route.name;
  return (
    map[key]?.[language.value] ||
    (language.value === "en" ? "Library System" : "ប្រព័ន្ធបណ្ចាល័យ")
  );
});

// Dropdown functions
function selectLanguage(lang) {
  language.value = lang;
  localStorage.setItem("language", lang);
  isOpen.value = false;
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

async function fetchUserProfile() {
  if (!userStore.token) return false;
  userStore.loading = true;
  try {
    const { success } = await userStore.fetchUserProfile();
    if (!success) userStore.userProfile = null;
    return success;
  } catch (error) {
    userStore.userProfile = null;
    return false;
  } finally {
    userStore.loading = false;
  }
}

function logout() {
  userStore.logout();
  showProfileDropdown.value = false;
}

// Close dropdowns when clicking outside
function handleClickOutside(event) {
  const dropdowns = [
    { button: ".profile-button", menu: ".profile-menu", state: showProfileDropdown },
    {
      button: ".notifications-button",
      menu: ".notifications-menu",
      state: showNotifications,
    },
    { button: ".language-button", menu: ".language-menu", state: isOpen },
  ];

  dropdowns.forEach((d) => {
    const btn = document.querySelector(d.button);
    const menu = document.querySelector(d.menu);
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target))
      d.state.value = false;
  });
}

// Method to check overdue borrows
async function checkOverdueBorrows() {
  try {
    await userStore.fetchBorrows();
    notifications.value = userStore.overdueBorrows.length;
  } catch (error) {
    notifications.value = 0;
  }
}

// Manual trigger for debugging
function manualCheck() {
  checkOverdueBorrows();
  console.log("Manual check triggered");
}

// Function to navigate to borrow details
function goToBorrowDetails() {
  router.push(`/borrows`);
  showNotifications.value = false; 
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  const cachedImage = localStorage.getItem("profile_image");
  if (cachedImage && !userStore.user?.profile_image)
    userStore.user = { ...userStore.user, profile_image: cachedImage };
  fetchUserProfile();
  checkOverdueBorrows();
  const interval = setInterval(checkOverdueBorrows, 300000);
  onUnmounted(() => clearInterval(interval)); 
});
</script>

<template>
  <div class="flex min-h-screen bg-custom-gray text-gray-900 font-inter">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-r-lg text-gray-100 flex flex-col h-screen fixed left-0 transition-all duration-300 shadow-lg',
        isSidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <div
        v-if="isSidebarOpen"
        class="p-6 flex flex-col items-center border-b border-indigo-600"
      >
        <img src="/logo.png" alt="Library Logo" class="h-20 w-30" />
        <h2
          class="text-2xl font-bold tracking-tight"
          :class="{ 'font-khmer': language === 'kh' }"
        >
          {{ language === "en" ? "PNC LIBRARY" : "ប្រព័ន្ធបណ្ចាល័យ" }}
        </h2>
      </div>
      <nav class="flex-1 overflow-y-auto no-scrollbar">
        <ul class="space-y-1 p-4" :class="{ 'font-khmer': language === 'kh' }">
          <li v-for="item in filteredNav" :key="item.path">
            <RouterLink
              :to="item.path"
              :class="[
                'flex items-center p-3 rounded-lg transition-colors duration-200',
                isSidebarOpen
                  ? 'hover:bg-custom-hover-page'
                  : 'justify-center hover:bg-custom-hover-page',
                $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : '',
              ]"
            >
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }">{{
                item.icon
              }}</span>
              <span v-if="isSidebarOpen">{{ item.label[language] }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/website"
              :class="[
                'flex items-center p-3 rounded-lg transition-colors duration-200',
                isSidebarOpen
                  ? 'hover:bg-custom-hover-page'
                  : 'justify-center hover:bg-custom-hover-page',
                $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : '',
              ]"
            >
              <span class="material-icons text-xl" :class="{ 'mr-3': isSidebarOpen }"
                >public</span
              >
              <span v-if="isSidebarOpen">{{
                language === "en" ? "Website" : "គេហទំព័រ"
              }}</span>
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
      <header
        class="sticky top-0 z-40 bg-white shadow-sm p-4 flex justify-between items-center"
      >
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <span class="material-icons text-2xl">{{
              isSidebarOpen ? "menu_open" : "menu"
            }}</span>
          </button>
          <h1
            class="text-2xl font-semibold tracking-tight"
            :class="{ 'font-khmer': language === 'kh' }"
          >
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
              aria-label="Search books"
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
              :class="{ 'font-khmer': language === 'kh' }"
              aria-haspopup="true"
              :aria-expanded="isOpen.toString()"
              aria-label="Select language"
            >
              <img
                :src="
                  language === 'en'
                    ? 'https://flagcdn.com/w40/us.png'
                    : 'https://flagcdn.com/w40/kh.png'
                "
                class="w-5 h-4 mr-2"
                :alt="language === 'en' ? 'US Flag' : 'Cambodia Flag'"
              />
              {{ language === "en" ? "English" : "ភាសាខ្មែរ" }}
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
                href="#"
                @click.prevent="selectLanguage('en')"
                class="flex items-center p-2 hover:bg-gray-100 text-sm"
                role="menuitem"
                tabindex="0"
              >
                <img
                  src="https://flagcdn.com/w40/us.png"
                  class="w-5 h-4 mr-2"
                  alt="US Flag"
                />
                English
              </a>
              <a
                href="#"
                @click.prevent="selectLanguage('kh')"
                class="flex items-center p-2 hover:bg-gray-100 text-sm"
                role="menuitem"
                tabindex="0"
              >
                <img
                  src="https://flagcdn.com/w40/kh.png"
                  class="w-5 h-4 mr-2"
                  alt="Cambodia Flag"
                />
                ភាសាខ្មែរ
              </a>
            </div>
          </div>
          <!-- Notifications -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="notifications-button material-icons text-gray-700 cursor-pointer hover:text-indigo-700 p-2.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Toggle notifications"
              :aria-expanded="showNotifications.toString()"
            >
              notifications
            </button>
            <span
              v-if="notifications > 0"
              class="absolute -top-0 -right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-sm"
              aria-label="Notification count"
            >
              {{ notifications }}
            </span>
            <div
              v-if="showNotifications"
              class="notifications-menu absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl p-3 z-50 border border-gray-100 transform transition-all duration-300 ease-in-out max-h-72 overflow-y-auto no-scrollbar"
              role="region"
              aria-live="polite"
            >
              <p
                class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2.5"
                :class="{ 'font-khmer': language === 'kh' }"
              >
                {{ language === "en" ? "You have" : "អ្នកមាន" }} {{ notifications }}
                {{
                  notifications === 1
                    ? language === "en"
                      ? "new notification"
                      : "ការជូនដំណឹងថ្មី"
                    : language === "en"
                    ? "new notifications"
                    : "ការជូនដំណឹងថ្មី"
                }}
              </p>
              <div v-if="userStore.loading" class="flex justify-center items-center py-4">
                <span
                  class="text-gray-600 text-sm"
                  :class="{ 'font-khmer': language === 'kh' }"
                >
                  {{ language === "en" ? "Loading..." : "កំពុងផ្ទុក..." }}
                </span>
              </div>
              <div v-else-if="notifications > 0" class="mt-2 space-y-3">
                <div
                  v-for="borrow in userStore.overdueBorrows"
                  :key="borrow.id"
                  :class="[
                    'notification-item rounded-xl p-4 transition-all duration-300 ease-in-out cursor-pointer flex items-center',
                    new Date(borrow.dueDate) <= new Date()
                      ? 'bg-red-50 border-l-4 border-red-600 hover:bg-red-100'
                      : 'bg-gray-50 hover:bg-gray-200',
                  ]"
                  @click="goToBorrowDetails(borrow.id)"
                  role="button"
                  tabindex="0"
                  @keydown.enter="goToBorrowDetails(borrow.id)"
                  :aria-label="`View details for overdue book ${borrow.bookTitle.title}`"
                >
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
                  >
                    <span class="material-icons text-indigo-700 text-lg">book</span>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-semibold text-gray-900">{{
                        borrow.bookTitle.title
                      }}</span>
                      <span class="text-xs text-gray-600">{{
                        new Date(borrow.dueDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-1.5">
                      <span class="text-xs text-gray-700">{{
                        borrow.userBorrow || "Unknown User"
                      }}</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-xs text-red-600 font-medium"
                        >Due: {{ new Date(borrow.dueDate).toLocaleDateString() }}</span
                      >
                      <span
                        v-if="new Date(borrow.dueDate) <= new Date()"
                        class="text-xs text-red-600 font-semibold"
                      >
                        (Overdue)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else-if="userStore.error"
                class="mt-2 text-sm text-red-600 text-center"
                :class="{ 'font-khmer': language === 'kh' }"
              >
                {{
                  language === "en"
                    ? "Error loading notifications"
                    : "កំហុសក្នុងការផ្ទុកការជូនដំណឹង"
                }}
              </div>
              <button
                v-if="notifications > 0"
                class="mt-4 w-full text-sm font-semibold text-indigo-700 hover:text-indigo-900 text-center underline underline-offset-4 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                @click="clearNotifications"
                aria-label="Clear all notifications"
              >
                {{ language === "en" ? "Clear All" : "លុបទាំងអស់" }}
              </button>
              <p
                v-else-if="!userStore.loading && !userStore.error"
                class="mt-4 text-sm text-gray-600 text-center font-medium"
                :class="{ 'font-khmer': language === 'kh' }"
              >
                {{ language === "en" ? "No new notifications" : "គ្មានការជូនដំណឹងថ្មី" }}
              </p>
            </div>
          </div>
          <!-- Profile -->
          <div class="relative">
            <div
              class="profile-button h-10 w-10 rounded-full cursor-pointer border border-gray-200 hover:border-indigo-400"
              @click="toggleProfileDropdown"
              role="button"
              aria-label="Toggle profile dropdown"
            >
              <img
                :src="profileImageUrl"
                alt="Profile"
                class="h-full w-full rounded-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div
              v-if="showProfileDropdown"
              class="profile-menu absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-100 transition-opacity duration-200"
              role="menu"
            >
              <div class="border-b border-gray-200 pb-2 mb-2">
                <p
                  class="text-sm font-medium"
                  :class="{ 'font-khmer': language === 'kh' }"
                >
                  {{ userStore.user?.username || "Unknown" }}
                </p>
                <p
                  class="text-xs text-gray-500"
                  :class="{ 'font-khmer': language === 'kh' }"
                >
                  {{ userStore.user?.email || "No email" }}
                </p>
              </div>
              <router-link
                to="/profile"
                class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                role="menuitem"
                @click="showProfileDropdown = false"
              >
                <span class="material-symbols-outlined text-blue-600 mr-2">person</span>
                {{ language === "en" ? "View Profile" : "មើលប្រវត្តិរូប" }}
              </router-link>
              <button
                @click="logout"
                class="w-full text-left flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded"
                role="menuitem"
              >
                <span class="material-symbols-outlined mr-2">logout</span>
                {{ language === "en" ? "Logout" : "ចាកចេញ" }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="">
        <RouterView v-if="!isLoading" />
        <div v-else class="flex justify-center items-center h-full">
          <p class="text-gray-600" :class="{ 'font-khmer': language === 'kh' }">
            {{ language === "en" ? "Loading..." : "កំពុងផ្ទុក..." }}
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

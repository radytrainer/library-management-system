<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  show: Boolean,
  user: Object,
});

const emits = defineEmits(['close']);

const userStore = useUserStore();
const isLoadingLoans = ref(false);
const isLoadingInterests = ref(false);

onMounted(async () => {
  if (props.user?.id) {
    isLoadingLoans.value = true;
    isLoadingInterests.value = true;
    await Promise.all([
      userStore.fetchBorrowingHistory(props.user.id),
      userStore.fetchBookInterests(props.user.id),
    ]);
    isLoadingLoans.value = false;
    isLoadingInterests.value = false;
  }
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300"
  >
    <!-- Large Modal Container - With Scrolling -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4"
    >
      <!-- Header - Fixed -->
      <div
        class="flex-shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl relative"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 rounded-t-2xl"
        ></div>
        <div class="relative flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-white mb-1">User Details</h2>
            <p class="text-blue-100 text-sm opacity-90">Complete user information</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full hover:rotate-90 transform"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-50/30 to-white">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-12 gap-8 min-h-full">
          <!-- Left Column - Profile Section -->
          <div class="col-span-4 flex flex-col space-y-6">
            <!-- Profile Header -->
            <div class="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div class="flex flex-col items-center text-center">
                <div
                  class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-xl mb-4"
                >
                  <img
                    v-if="user.profile_image"
                    :src="user.profile_image"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ user.username }}</h3>
                <p class="text-gray-600 break-all">{{ user.email || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Right Column - Information Sections -->
          <div class="col-span-8 flex flex-col space-y-6">
            <!-- Basic Information -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Username</span>
                    <span class="text-base text-gray-900 font-semibold bg-gray-50 px-3 py-2 rounded-lg">{{
                      user.username
                    }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Phone</span>
                    <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{{
                      user.phone || '-'
                    }}</span>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Email</span>
                    <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg break-all">{{
                      user.email || 'N/A'
                    }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Role</span>
                    <span
                      class="text-base text-gray-900 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-medium"
                      >{{ user.role || user.Role?.name || 'User' }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-medium text-gray-600">Date of Birth</span>
                  <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg inline-block w-fit">{{
                    user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-'
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Book Interest Section -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Book Interests
              </h4>
              <div v-if="isLoadingInterests" class="text-gray-600 mt-2">Loading book interests...</div>
              <div v-else-if="user.bookInterests && user.bookInterests.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="book in user.bookInterests"
                  :key="book.id"
                  class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    v-if="book.coverImage"
                    :src="book.coverImage"
                    alt="Book Cover"
                    class="w-16 h-24 object-cover rounded-md border border-gray-200"
                  />
                  <div v-else class="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-base font-semibold text-gray-900">{{ book.title }}</p>
                    <p class="text-sm text-gray-600">by {{ book.author || 'Unknown' }}</p>
                    <p class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full inline-block mt-1">{{
                      book.genre || 'N/A'
                    }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-600 mt-2">No book interests available.</p>
            </div>

            <!-- Borrowing History -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Borrowing History
              </h4>
              <div v-if="isLoadingLoans" class="text-gray-600 mt-2">Loading borrowing history...</div>
              <div v-else-if="user.loans && user.loans.length" class="mt-2">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">Book Title</th>
                      <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">Borrow Date</th>
                      <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">Return Date</th>
                      <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="loan in user.loans" :key="loan.id" class="border-t">
                      <td class="px-4 py-2">{{ loan.bookTitle }}</td>
                      <td class="px-4 py-2">{{ new Date(loan.borrowDate).toLocaleDateString() }}</td>
                      <td class="px-4 py-2">
                        {{ loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Not Returned' }}
                      </td>
                      <td class="px-4 py-2">
                        <span
                          :class="{
                            'px-2 py-1 rounded-full text-xs': true,
                            'bg-green-100 text-green-800': loan.status === 'borrowed',
                            'bg-gray-100 text-gray-800': loan.status === 'returned',
                            'bg-red-100 text-red-800': loan.status === 'overdue',
                          }"
                        >
                          {{ loan.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-gray-600 mt-2">No borrowing history available.</p>
            </div>

            <!-- Additional Information Section -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Additional Details
              </h4>
              <div class="grid grid-cols-1 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Account Status</p>
                  <p
                    class="text-base font-medium"
                    :class="user.isActive ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Last Login</p>
                  <p class="text-base text-gray-900">{{ user.lastLogin || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Member Since</p>
                  <p class="text-base text-gray-900">{{
                    user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
                  }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
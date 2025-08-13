<template>
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Most Active Borrowers</h3>
            <button v-if="topBorrowers.length > 4" @click="showModal = true"
                class="text-blue-600 text-sm font-medium hover:text-blue-700">
                View All
            </button>
        </div>

        <!-- Main card showing 4 borrowers -->
        <div class="space-y-4">
            <div v-for="member in topBorrowers.slice(0, 4)" :key="member.id"
                class="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="relative">
                    <img :src="member.avatar" :alt="member.name" class="w-14 h-14 rounded-full object-cover" />
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                    <p class="text-sm text-gray-500">{{ member.books }} books this month</p>
                </div>
                <div class="text-right">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="modal">
            <div v-if="showModal"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="showModal = false">
                <div
                    class="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl border border-gray-300 flex flex-col">
                    <!-- Header -->
                    <header
                        class="flex items-center justify-between p-6 border-b border-gray-300 bg-white rounded-t-xl">
                        <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 4.354a4 4 0 110 5.292"></path>
                                <path d="M15 21H3v-1a6 6 0 0112 0v1z"></path>
                                <path d="M15 21h6v-1a6 6 0 00-9-5.197"></path>
                                <path d="M19.5 6.803a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                            Top Borrowers
                        </h3>
                        <button @click="showModal = false" aria-label="Close modal"
                            class="p-2 rounded-full group focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </header>

                    <!-- Content -->
                    <section class="flex-1 overflow-y-auto p-10 space-y-4 no-scrollbar">
                        <div v-for="(member, index) in topBorrowers" :key="member.id"
                            class="group flex items-center gap-5 p-4 rounded-xl bg-white border border-gray-300">
                            <!-- Rank Badge -->
                            <div
                                class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-base select-none">
                                {{ index + 1 }}
                            </div>

                            <!-- Avatar -->
                            <div class="relative flex-shrink-0">
                                <img :src="member.avatar" :alt="member.name"
                                    class="w-14 h-14 rounded-full object-cover ring-2 ring-blue-300 group-hover:ring-blue-500 transition-all duration-200" />
                                <div
                                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Member Info -->
                            <div class="flex-1 min-w-0">
                                <h4
                                    class="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200 truncate">
                                    {{ member.name }}
                                </h4>
                                <div class="flex items-center gap-2 mt-1">
                                    <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-sm font-medium text-gray-600">
                                        {{ member.books }} books this month
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTopBorrowers } from "@/services/Api/dashboard"; // Adjust path as needed

const topBorrowers = ref([]);
const showModal = ref(false);
const error = ref(null);

const loadTopBorrowers = async () => {
    try {
        const response = await getTopBorrowers();
        topBorrowers.value = response.data.map((user) => ({
            id: user.id,
            name: user.username || user.name,
            avatar:
                user.profile_image ||
                user.avatar ||
                `${process.env.BASE_URL || "http://localhost:5000"}/uploads/default-avatar.png`,
            books: user.books || 0,
        }));
    } catch (err) {
        error.value = "Failed to load top borrowers";
        console.error("Failed to load top borrowers", err);
    }
};

onMounted(() => {
    loadTopBorrowers();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hide scrollbar for WebKit */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for Firefox */
.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
</style>

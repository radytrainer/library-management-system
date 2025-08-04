<!-- src/components/borrows/BorrowTable.vue -->
<template>
    <div class="bg-white rounded-xl border border-gray-100 shadow-md">
        <div class="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex flex-wrap items-center gap-3">
                    <select :value="selectedStatus" @change="$emit('update:selectedStatus', $event.target.value)"
                        class="min-w-[120px] sm:min-w-[140px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                        <option value="">All Status</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="returned">Returned</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <select :value="selectedCategory" @change="$emit('update:selectedCategory', $event.target.value)"
                        class="min-w-[140px] sm:min-w-[160px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                        <option value="">All Categories</option>
                        <option v-for="category in categories" :key="category.id" :value="category.name">{{
                            category.name }}</option>
                    </select>
                    <select :value="limit" @change="$emit('update:limit', Number($event.target.value))"
                        class="min-w-[100px] sm:min-w-[120px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                        <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
                    </select>
                </div>
                <div class="flex items-center gap-3">
                    <button disabled
                        class="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>
                    <button @click="() => { console.log('clicked'); $emit('add-borrow') }"
                        class="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Borrow
                    </button>
                </div>
            </div>
        </div>
        <div>
            <table class="w-full table-auto">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            #</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Book</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Category</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Borrower</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Qty</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Status</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Borrow Date</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Return Date</th>
                        <th
                            class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in filteredBorrowData" :key="item.id"
                        class="hover:bg-gray-50 transition-all">
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                            {{ index + 1 + (currentPage - 1) * limit }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <img :src="item.book.cover_image" alt="cover"
                                    class="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-sm border border-gray-200" />
                                <button
                                    class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all text-sm sm:text-base"
                                    @click="$emit('show-book', item)" aria-label="View book details">
                                    {{ item.book.title }}
                                </button>
                            </div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                {{ item.book.category }}
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">
                            {{ item.user.name }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                            {{ item.borrowed_quantity || 0 }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span v-if="getItemStatus(item) === 'overdue'"
                                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-red-100 text-red-800">
                                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Overdue
                            </span>
                            <button v-else-if="getItemStatus(item) === 'borrowed'"
                                @click="$emit('confirm-return', item.id)"
                                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                                aria-label="Mark as returned">
                                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4" />
                                </svg>
                                Return
                            </button>
                            <span v-else
                                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-green-100 text-green-800">
                                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                Returned
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                            {{ formatDate(item.borrow_date) }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                            {{ formatDate(item.return_date) }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-500 relative">
                            <button @click.stop="$emit('toggle-dropdown', item.id)"
                                class="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                aria-label="Toggle actions menu">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                            <div v-if="openDropdown === item.id"
                                class="absolute right-4 sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                <div class="py-1">
                                    <button @click="$emit('show-book', item)"
                                        class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Details
                                    </button>
                                    <button @click="$emit('update-record', item)"
                                        class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Record
                                    </button>
                                    <button @click="$emit('delete-record', item.id)"
                                        class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-red-600 hover:bg-red-50 transition-all">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Record
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="text-sm sm:text-base text-gray-700">
                    Showing
                    <span class="font-medium">{{ (currentPage - 1) * limit + 1 }}</span> to
                    <span class="font-medium">{{ Math.min(currentPage * limit, totalFilteredItems) }}</span> of
                    <span class="font-medium">{{ totalFilteredItems }}</span> results
                </div>
                <div class="flex items-center gap-2">
                    <button :disabled="currentPage === 1" @click="$emit('update:currentPage', currentPage - 1)"
                        class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <template v-for="page in Math.min(totalPages, 5)" :key="page">
                        <button @click="$emit('update:currentPage', page)" :class="[
                            'px-3 py-2 border rounded-lg transition-all text-sm sm:text-base',
                            currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-100',
                        ]">
                            {{ page }}
                        </button>
                    </template>
                    <button :disabled="currentPage === totalPages" @click="$emit('update:currentPage', currentPage + 1)"
                        class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    filteredBorrowData: Array,
    categories: Array,
    currentPage: Number,
    limit: Number,
    selectedStatus: String,
    selectedCategory: String,
    totalFilteredItems: Number,
    totalPages: Number,
    openDropdown: [String, Number, null],
    getItemStatus: Function,
    formatDate: Function,
});

defineEmits([
    "update:currentPage",
    "update:limit",
    "update:selectedStatus",
    "update:selectedCategory",
    "toggle-dropdown",
    "show-book",
    "confirm-return",
    "update-record",
    "delete-record",
    "add-borrow",
]);
</script>

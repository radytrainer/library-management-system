<template>
  <div class="">
    <div class="p-6">
      <HeaderSection v-model:search="search" />
      <StatsCards :borrow-data="borrowData" :get-item-status="getItemStatus" />
      <BorrowTable :filtered-borrow-data="filteredBorrowData" :categories="categories" :current-page="currentPage"
        :limit="limit" :selected-status="selectedStatus" :selected-category="selectedCategory"
        :total-filtered-items="totalFilteredItems" :total-pages="totalPages" :open-dropdown="openDropdown"
        :get-item-status="getItemStatus" :format-date="formatDate" @update:current-page="currentPage = $event"
        @update:limit="limit = $event" @update:selected-status="selectedStatus = $event"
        @update:selected-category="selectedCategory = $event" @toggle-dropdown="toggleDropdown" @show-book="handleShow"
        @confirm-return="confirmReturn" @update-record="openUpdateModal" @delete-record="handleDelete"
        @add-borrow="showModal = true" />

      <BookDetailModal v-if="showBookDetail" :book="selectedBook" :get-item-status="getItemStatus"
        :get-days-left="getDaysLeft" :format-date="formatDate" @close="showBookDetail = false" />

      <AddBorrowModal v-if="showModal" v-model="addForm" @submit="submitAddBorrow" @close="showModal = false" />

      <UpdateBorrowModal v-if="showUpdateModal" :form="updateForm" :statusOptions="statusOptions" :formError="formError"
        @submit="submitUpdate" @close="closeUpdateModal" />

      <ConfirmModal v-if="showConfirmModal" @confirm="handleConfirmReturn" @close="showConfirmModal = false" />

      <ToastNotification v-if="message" :message="message" :message-type="messageType" @close="message = ''" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import HeaderSection from "./HeaderSection.vue";
import StatsCards from "./StatsCards.vue";
import BorrowTable from "./BorrowTable.vue";
import BookDetailModal from "./BookDetailModal.vue";
import AddBorrowModal from "./AddBorrowModal.vue";
import UpdateBorrowModal from "./UpdateBorrowModal.vue";
import ConfirmModal from "./ConfirmModal.vue";
import ToastNotification from "./ToastNotification.vue";

import { useBorrowManagement } from "@/composables/useBorrowManagement";

const {
  borrowData,
  booksData,
  search,
  limit,
  currentPage,
  selectedStatus,
  selectedCategory,
  showModal,
  showBookDetail,
  showUpdateModal,
  showConfirmModal,
  openDropdown,
  selectedBook,
  addForm,
  updateForm,
  statusOptions,
  formError,
  message,
  messageType,
  returnId,
  categories,
  filteredBorrowData,
  totalFilteredItems,
  totalPages,
  fetchBorrowData,
  fetchBooksData,
  getItemStatus,
  getDaysLeft,
  formatDate,
  toggleDropdown,
  handleShow,
  openUpdateModal,
  closeUpdateModal,
  submitUpdate,
  submitAddBorrow,
  handleDelete,
  confirmReturn,
  handleConfirmReturn,
} = useBorrowManagement();

onMounted(async () => {
  await Promise.all([fetchBorrowData(), fetchBooksData()]);
  console.log("Initial booksData:", booksData.value); // Debug log
});

watch(booksData, (newBooksData) => {
  console.log("booksData updated:", newBooksData); // Debug log
});

watch([selectedCategory, selectedStatus, search, limit], () => {
  currentPage.value = 1;
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) currentPage.value = newTotal;
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
</style>
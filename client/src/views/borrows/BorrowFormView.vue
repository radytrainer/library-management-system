<template>
  <div class="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h3 class="text-2xl font-semibold mb-8 text-blue-600">Borrow Book Form</h3>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Title -->
      <input
        v-model="title"
        type="text"
        placeholder="Book Title..."
        class="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />

      <!-- Category and ISBN -->
      <div class="flex gap-4">
        <select
          v-model="category"
          class="flex-1 border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        >
          <option value="" disabled>Category...</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <input
          v-model="isbn"
          type="text"
          placeholder="ISBN 0123-3434-2323"
          class="flex-1 border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>

      <!-- Quantity -->
      <input
        v-model="quantity"
        type="number"
        min="1"
        placeholder="Quantity"
        class="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />

      <!-- Borrower Name -->
      <input
        v-model="borrower"
        type="text"
        placeholder="Borrower Name"
        class="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />

      <!-- Borrow and Return Date -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="borrow-date" class="block mb-1 text-sm font-medium text-gray-400">Borrow Date</label>
          <input
            id="borrow-date"
            v-model="borrowDate"
            type="date"
            class="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div class="flex-1">
          <label for="return-date" class="block mb-1 text-sm font-medium text-gray-400">Return Date</label>
          <input
            id="return-date"
            v-model="returnDate"
            type="date"
            class="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
      </div>

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Borrower's Email"
        class="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />

      <!-- Buttons -->
      <div class="flex justify-end gap-4 pt-4">
        <button
          type="button"
          @click="cancelForm"
          class="bg-red-100 text-red-600 rounded-md px-6 py-3 hover:bg-red-200 transition"
        >
          Cancel
        </button>

        <button
          type="reset"
          @click="resetForm"
          class="bg-gray-200 text-gray-700 rounded-md px-6 py-3 hover:bg-gray-300 transition"
        >
          Discard
        </button>

        <button
          type="submit"
          class="bg-blue-600 text-white rounded-md px-6 py-3 hover:bg-blue-700 transition"
        >
          Borrow
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'  // <-- add this
const router = useRouter()             

const categories = ['Khmer', 'English', 'French', 'Science', 'History']

const title = ref('')
const category = ref('')
const isbn = ref('')
const quantity = ref(1)
const borrower = ref('')
const borrowDate = ref('')
const returnDate = ref('')
const email = ref('')

function resetForm() {
  title.value = ''
  category.value = ''
  isbn.value = ''
  quantity.value = 1
  borrower.value = ''
  borrowDate.value = ''
  returnDate.value = ''
  email.value = ''
}

function cancelForm() {
  router.push('/borrows')
}

function submitForm() {
  alert(`
    Borrow request submitted:
    Title: ${title.value}
    Category: ${category.value}
    ISBN: ${isbn.value}
    Quantity: ${quantity.value}
    Borrower: ${borrower.value}
    Borrow Date: ${borrowDate.value}
    Return Date: ${returnDate.value}
    Email: ${email.value}
  `)

  resetForm()
}
</script>

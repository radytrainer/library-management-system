<!-- src/views/BooksView.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-700">📚 Book List</h2>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Add Book
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded shadow">
        <thead class="bg-gray-100 text-left text-sm text-gray-600">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">Title</th>
            <th class="px-6 py-3">Author</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr v-for="(book, index) in books" :key="book.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-3">{{ index + 1 }}</td>
            <td class="px-6 py-3 font-medium">{{ book.title }}</td>
            <td class="px-6 py-3">{{ book.author }}</td>
            <td class="px-6 py-3">{{ book.category }}</td>
            <td class="px-6 py-3">
              <span
                :class="book.available ? 'text-green-600' : 'text-red-600'"
                class="font-semibold"
              >
                {{ book.available ? 'Available' : 'Borrowed' }}
              </span>
            </td>
            <td class="px-6 py-3 text-right space-x-2">
              <button class="text-blue-600 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const books = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    available: true,
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt & Dave Thomas',
    category: 'Programming',
    available: false,
  },
  {
    id: 3,
    title: 'You Don’t Know JS',
    author: 'Kyle Simpson',
    category: 'JavaScript',
    available: true,
  },
]
</script>

<template>
  <div class="space-y-4">
    <!-- FORM TITLE -->
    <h2 class="text-xl font-bold text-gray-700">{{ isEdit ? 'Edit Book' : 'Add New Book' }}</h2>

    <!-- FORM -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- TITLE -->
      <div>
        <label class="block mb-1 font-semibold">Title</label>
        <input v-model="form.title" type="text" required class="w-full border p-2 rounded" />
      </div>

      <!-- ISBN -->
      <div>
        <label class="block mb-1 font-semibold">ISBN</label>
        <input v-model="form.isbn" type="text" class="w-full border p-2 rounded" />
      </div>

      <!-- Quantity -->
      <div>
        <label class="block mb-1 font-semibold">Quantity</label>
        <input v-model="form.quantity" type="number" min="0" class="w-full border p-2 rounded" />
      </div>

      <!-- Donated By -->
      <div>
        <label class="block mb-1 font-semibold">Donated By</label>
        <input v-model="form.donated_by" type="text" class="w-full border p-2 rounded" />
      </div>

      <!-- Publish Year -->
      <div>
        <label class="block mb-1 font-semibold">Publish Year</label>
        <input v-model="form.public_year" type="number" class="w-full border p-2 rounded" />
      </div>

      <!-- Description -->
      <div>
        <label class="block mb-1 font-semibold">Description</label>
        <textarea v-model="form.description" class="w-full border p-2 rounded"></textarea>
      </div>

      <!-- Available -->
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.available" />
        <label class="font-semibold">Available</label>
      </div>

      <!-- Category -->
      <div>
        <label class="block mb-1 font-semibold">Category</label>
        <select v-model="form.CategoryId" class="w-full border p-2 rounded">
          <option v-for="cat in categories" :value="cat.id" :key="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Author -->
      <div>
        <label class="block mb-1 font-semibold">Author</label>
        <select v-model="form.AuthorId" class="w-full border p-2 rounded">
          <option v-for="auth in authors" :value="auth.id" :key="auth.id">{{ auth.name }}</option>
        </select>
      </div>

      <!-- Language -->
      <div>
        <label class="block mb-1 font-semibold">Language</label>
        <select v-model="form.language_id" class="w-full border p-2 rounded">
          <option v-for="lang in languages" :value="lang.id" :key="lang.id">{{ lang.name }}</option>
        </select>
      </div>

      <!-- Cover Image -->
      <div>
        <label class="block mb-1 font-semibold">Cover Image</label>
        <input type="file" @change="handleFileChange" />
        <div v-if="form.cover_image_preview" class="mt-2">
          <img :src="form.cover_image_preview" class="w-20 h-20 rounded object-cover" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {{ isEdit ? 'Update Book' : 'Create Book' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getCategories,
  getAuthors,
  getLanguages,
  createBook,
  updateBook,
  getBookById
} from '@/services/Api/book';

const props = defineProps({
  bookId: {
    type: Number,
    default: null,
  }
});

const isEdit = ref(!!props.bookId);
const form = ref({
  title: '',
  isbn: '',
  quantity: 0,
  donated_by: '',
  public_year: '',
  description: '',
  available: true,
  CategoryId: '',
  AuthorId: '',
  language_id: '',
  cover_image: null,
  cover_image_preview: null,
});

const authors = ref([]);
const categories = ref([]);
const languages = ref([]);

// LOAD dropdown options
const loadDropdowns = async () => {
  authors.value = (await getAuthors()).data;
  categories.value = (await getCategories()).data;
  languages.value = (await getLanguages()).data;
};

// HANDLE FILE
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.cover_image = file;
    form.value.cover_image_preview = URL.createObjectURL(file);
  }
};

// LOAD book if edit
const loadBook = async () => {
  if (!props.bookId) return;

  const response = await getBookById(props.bookId);
  const book = response.data.book;

  form.value = {
    ...form.value,
    ...book,
    language_id: book.language?.id || book.language_id,
    cover_image_preview: book.cover_image_url,
  };
};

// SUBMIT
const handleSubmit = async () => {
  const formData = new FormData();

  for (const key in form.value) {
    if (key !== 'cover_image_preview') {
      formData.append(key, form.value[key]);
    }
  }

  try {
    if (isEdit.value) {
      await updateBook(props.bookId, formData);
      alert('Book updated successfully!');
    } else {
      await createBook(formData);
      alert('Book created successfully!');
    }
  } catch (err) {
    console.error('Error saving book:', err);
    alert('Something went wrong.');
  }
};

// On mount
onMounted(async () => {
  await loadDropdowns();
  if (isEdit.value) await loadBook();
});
</script>

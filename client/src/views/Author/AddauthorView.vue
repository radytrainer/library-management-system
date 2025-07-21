<template>
  <form @submit.prevent="addAuthor" class="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md space-y-4">
    <h2 class="text-xl font-semibold text-gray-700">Add New Author</h2>

    <div>
      <label class="block text-sm text-gray-600 mb-1">Author Name</label>
      <input v-model="author.name" type="text" required
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
      <label class="block text-sm text-gray-600 mb-1">Author Bio</label>
      <textarea v-model="author.bio" rows="4"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
    </div>

    <button type="submit"
      class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
      Add Author
    </button>

    <p v-if="message" class="text-green-600 text-center">{{ message }}</p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      author: {
        name: '',
        bio: ''
      },
      message: ''
    };
  },
  methods: {
    async addAuthor() {
      try {
        const response = await fetch('/api/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.author)
        });

        if (!response.ok) throw new Error('Failed to add author');

        this.message = 'Author added successfully!';
        this.author.name = '';
        this.author.bio = '';
      } catch (error) {
        console.error(error);
        this.message = 'Error adding author.';
      }
    }
  }
};
</script>


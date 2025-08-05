<template>
    <!-- Hero Section: Showcase main book and call-to-action -->
    <section class="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 py-20 md:py-28 shadow-xl">
        <div class="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div class="md:w-1/3 flex justify-center">
                <img :src="books[0]?.coverUrl || 'https://i.pinimg.com/736x/5a/f4/0e/5af40ef711e4f422c9e1bfc0a7f4cbe5.jpg'"
                    alt="Book Cover"
                    class="rounded-2xl shadow-2xl max-w-[250px] md:max-w-[320px] h-auto border border-gray-200 transition-transform duration-300" />
            </div>
            <div class="md:w-2/3 text-center md:text-left space-y-6 max-w-2xl">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Discover Your Next Read
                </h1>
                <p class="text-xl text-gray-700 font-medium">
                    Explore our vast collection of books, available for borrowing.
                </p>
                <p class="text-base text-gray-600 leading-relaxed">
                    Dive into captivating stories, expand your knowledge, and find new adventures. Whether you're
                    looking for fiction, non-fiction, or academic resources—our catalog has something for everyone.
                </p>
                <div class="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-6">
                    <button
                        class="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-full shadow-sm hover:bg-gray-100 hover:border-gray-400 text-base font-semibold transition-all duration-300 transform hover:scale-105">
                        How to Borrow
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Book Details Section: Highlight author details -->
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div class="relative px-6 py-12 lg:px-12">
            <div class="mx-auto max-w-7xl">
                <div class="grid gap-8 lg:grid-cols-2 lg:gap-16">
                    <!-- Author Image -->
                    <div class="flex justify-center lg:justify-start">
                        <div class="relative">
                            <img :src="selectedAuthorDetails?.profile_image_url || 'https://i.pinimg.com/736x/6e/48/83/6e488361d07c19e8ae2b885afce6ba4f.jpg'"
                                :alt="selectedAuthor || 'Author'"
                                class="w-80 h-[24rem] rounded-2xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    <!-- Author Content -->
                    <div class="flex flex-col justify-center space-y-6 text-white">
                        <div>
                            <div class="mt-4 flex items-center space-x-4">
                                <div class="flex items-center space-x-2">
                                    <img :src="selectedAuthorDetails?.profile_image_url || 'https://i.pinimg.com/736x/6e/48/83/6e488361d07c19e8ae2b885afce6ba4f.jpg'"
                                        :alt="selectedAuthor || 'Author'"
                                        class="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                                    <div>
                                        <p class="font-semibold text-lg">{{ selectedAuthor || 'Book Writer' }}</p>
                                        <p class="text-sm text-gray-300">
                                            {{ filteredAuthorBooks.length }} Books | {{ selectedAuthorDetails?.readers
                                                || 0 }} Readers
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 flex items-center space-x-2">
                                <div class="flex items-center">
                                    <Star v-for="star in 5" :key="star"
                                        class="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                </div>
                                <span class="text-lg font-semibold">{{ selectedBook?.reviews || 0 }} reviews</span>
                            </div>
                        </div>
                        <div class="text-gray-300 leading-relaxed">
                            <p>
                                {{ selectedAuthorDetails?.biography || 'This author has not provided a biography yet.'
                                }}
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-4">
                            <button
                                class="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-full shadow-sm transition-all duration-300 transform hover:scale-105"
                                :disabled="!selectedBook">
                                Read Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Section: About the author and books by selected author -->
        <div class="bg-white px-6 py-12 lg:px-12">
            <div class="mx-auto max-w-7xl">
                <div class="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 tracking-tight">About the Author</h2>
                        <div class="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                {{ selectedAuthorDetails?.biography }}
                            </p>
                            <p>
                                Learn more about their journey, the inspiration behind their books, and the impact
                                they've made on readers around the world.
                            </p>
                            <p>
                                Discover how their stories continue to inspire, educate, and bring joy to people of all
                                ages.
                            </p>
                        </div>
                        <div class="mt-6 flex flex-wrap gap-2">
                            <span
                                v-for="category in selectedAuthorDetails?.categories || ['Fiction', 'Adventure', 'Inspiration']"
                                :key="category"
                                class="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition-colors duration-200">
                                {{ category }}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">More by Author</h2>
                            <div class="flex items-center gap-4">
                                <select v-model="selectedAuthor" @change="filterBooksByAuthor"
                                    class="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                    <option value="">All Authors</option>
                                    <option v-for="author in authors" :key="author.id" :value="author.name">
                                        {{ author.name }}
                                    </option>
                                </select>
                                <button @click="showAll = true"
                                    class="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div v-for="book in filteredAuthorBooks.slice(0, 4)" :key="book.id"
                                class="cursor-pointer border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                                @click="openBookModal(book)">
                                <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                                    :alt="`Cover of ${book.title}`" class="w-full h-38 object-cover" />
                                <div class="p-4 text-center">
                                    <h3 class="text-sm font-semibold text-gray-900 truncate">{{ book.title }}</h3>
                                </div>
                            </div>
                        </div>
                        <div v-if="showAll"
                            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
                            <div
                                class="bg-white rounded-2xl p-16 w-[90%] md:w-[70%] h-[90%] overflow-y-auto relative shadow-2xl animate-slide-in">
                                <button
                                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
                                    @click="showAll = false">
                                    &times;
                                </button>
                                <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">All Books by {{
                                    selectedAuthor || 'Our Author' }}</h3>
                                <div v-if="filteredAuthorBooks.length > 0"
                                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-10">
                                    <div v-for="book in filteredAuthorBooks" :key="book.id"
                                        class="cursor-pointer border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                                        @click="openBookModal(book)">
                                        <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                                            :alt="`Cover of ${book.title}`" class="w-full h-auto object-cover" />
                                        <div class="p-4 text-center">
                                            <h2 class="text-sm font-semibold text-gray-900 truncate">{{ book.title }}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-gray-500 text-lg">
                                    No books found for this author.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Books Section: Display up to 4 popular books with category filter -->
    <section class="bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Type of Books</h2>
                <div class="flex items-center gap-4">
                    <select v-model="selectedCategory" @change="filterBooksByCategory"
                        class="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                        <option value="">All Categories</option>
                        <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>
                    <button @click="showFeaturedAll = true"
                        class="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200">
                        View All
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="book in filteredBooks.slice(0, 4)" :key="book.id"
                    class="cursor-pointer rounded-xl bg-white border border-gray-100 p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                    @click="openBookModal(book)">
                    <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                        :alt="`Cover of ${book.title}`" loading="lazy"
                        class="rounded-md shadow-sm w-full h-auto object-cover mb-3 transform hover:scale-105 transition-transform duration-300" />
                    <h3 class="text-2xl font-semibold text-gray-900 mb-1 line-clamp-2">{{ book.title }}</h3>
                    <p class="text-gray-500 text-lg italic line-clamp-1">
                        {{ book.author?.name || book.authorName || 'Unknown' }}
                    </p>
                </div>
            </div>
            <!-- Modal for All Featured Books -->
            <div v-if="showFeaturedAll"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
                <div
                    class="bg-white rounded-2xl p-16 w-[90%] md:w-[70%] h-[90%] overflow-y-auto relative shadow-2xl animate-slide-in">
                    <button
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
                        @click="showFeaturedAll = false">
                        &times;
                    </button>
                    <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">Category Books</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-10">
                        <div v-for="book in filteredBooks" :key="book.id"
                            class="cursor-pointer border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                            @click="openBookModal(book)">
                            <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                                :alt="`Cover of ${book.title}`" class="w-full h-auto object-cover" />
                            <div class="p-4 text-center">
                                <h4 class="text-sm font-semibold text-gray-900 truncate">{{ book.title }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Book Details Modal -->
    <div v-if="showBookModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
        <div
            class="bg-white rounded-3xl p-6 md:p-10 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-slide-in">
            <!-- Close Button -->
            <button
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full w-10 h-10 flex items-center justify-center"
                @click="showBookModal = false">
                &times;
            </button>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Book Cover Section -->
                <div class="md:w-1/2 p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                    <div class="relative group">
                        <img :src="selectedBookForModal?.cover_image_url || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yCpJAvOCWSplM9qtANjM0PW1I0Qe1v.png'"
                            :alt="`${selectedBookForModal?.title || 'Book'} Cover`"
                            class="w-full max-w-[300px] mx-auto rounded-xl shadow-lg transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 object-cover" />
                    </div>
                </div>

                <!-- Product Details Section -->
                <div class="md:w-1/2 p-4 md:p-6 space-y-5">
                    <!-- ISBN -->
                    <div class="text-sm text-gray-600 font-medium">
                        <span class="font-semibold text-gray-800">ISBN:</span> {{ selectedBookForModal?.isbn ||
                            'Unknown' }}
                    </div>

                    <!-- Title -->
                    <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {{ selectedBookForModal?.title || 'Book Title' }}
                    </h1>

                    <!-- Donor -->
                    <p class="text-lg text-orange-600 font-semibold">
                        Donated by: {{ selectedBookForModal?.donated_by || 'Unknown' }}
                    </p>

                    <!-- Author -->
                    <p class="text-lg text-orange-600 font-semibold">
                        Written by: {{ selectedBookForModal?.author?.name || selectedBookForModal?.authorName ||
                            'Unknown' }}
                    </p>

                    <!-- Quantity -->
                    <div class="flex items-center space-x-3">
                        <span class="text-sm font-semibold text-gray-700">Quantity:</span>
                        <span class="px-4 py-1 bg-gray-100 rounded-md text-gray-800 font-medium">
                            {{ selectedBookForModal?.quantity || 'N/A' }}
                        </span>
                    </div>

                    <!-- Publish Year -->
                    <div class="flex items-center space-x-3">
                        <span class="text-sm font-semibold text-gray-700">Published:</span>
                        <span class="px-4 py-1 bg-gray-100 rounded-md text-gray-800 font-medium">
                            {{ selectedBookForModal?.public_year || 'Unknown' }}
                        </span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                        <button
                            class="flex-1 bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors duration-200">
                            <span>{{ selectedBookForModal?.language?.name || 'Language' }}</span>
                        </button>
                        <button
                            class="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200">
                            <span>{{ selectedBookForModal?.category?.name || 'Category' }}</span>
                        </button>
                    </div>

                    <!-- Description -->
                    <div class="pt-6 border-t border-gray-200">
                        <p
                            class="text-gray-700 text-base leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {{ selectedBookForModal?.description || 'No description available for this book.' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Star } from 'lucide-vue-next';
import { getBooks, getAuthors, getCategories, getLanguages } from '@/services/Api/book';
import Swal from 'sweetalert2';

// Reactive state for modals and filters
const showAll = ref(false);
const showFeaturedAll = ref(false);
const showBookModal = ref(false);
const selectedCategory = ref('');
const selectedAuthor = ref('');
const selectedBook = ref(null);
const selectedBookForModal = ref(null);
const quantity = ref(1);

// Reactive state for data fetching
const books = ref([]);
const authors = ref([]);
const categories = ref([]);
const languages = ref([]);
const author = ref({ name: '', biography: '', profile_image_url: '' });
const reviews = ref([]);
const bookInventory = ref([]);
const featuredBooks = ref([]);

// Normalize author names to handle inconsistencies
const normalizeAuthorName = (name) => {
    if (!name) return '';
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
};

// Computed property for filtered books by category
const filteredBooks = computed(() => {
    if (!selectedCategory.value) {
        return featuredBooks.value;
    }
    return featuredBooks.value.filter(book =>
        book.category?.name?.toLowerCase() === selectedCategory.value.toLowerCase()
    );
});

// Computed property for filtered books by author
const filteredAuthorBooks = computed(() => {
    if (!selectedAuthor.value) {
        console.log('No author selected, returning all books');
        return books.value;
    }
    const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
    const filtered = books.value.filter(book => {
        const authorName = normalizeAuthorName(book.author?.name || book.authorName || '');
        console.log(`Checking book: ${book.title}, Author: ${authorName}, Selected: ${normalizedSelectedAuthor}`);
        return authorName === normalizedSelectedAuthor;
    });
    console.log('Filtered books:', filtered);
    return filtered;
});

// Computed property for selected author details
const selectedAuthorDetails = computed(() => {
    if (!selectedAuthor.value) return { name: '', profile_image_url: '', readers: 0, biography: '', categories: [] };
    const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
    const author = authors.value.find(a => normalizeAuthorName(a.name) === normalizedSelectedAuthor);
    return author || { name: selectedAuthor.value, profile_image_url: '', readers: 0, biography: '', categories: [] };
});

// Computed property for rating (simulated)
const rating = computed(() => {
    return Math.min(Math.floor(Math.random() * 5) + 1, 5); // Replace with selectedBookForModal.rating if available
});

// Fetch all necessary data from the API
const fetchBooks = async () => {
    try {
        const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
            getBooks(),
            getAuthors(),
            getCategories(),
            getLanguages(),
        ]);

        books.value = (booksRes.data.books || []).map(book => ({
            ...book,
            authorName: normalizeAuthorName(book.author?.name || book.authorName),
            author: book.author ? { ...book.author, name: normalizeAuthorName(book.author.name) } : book.author,
            cover_image_url: book.bookUrl || book.cover_image_url || '/placeholder.svg?height=400&width=300',
            description: book.description || 'No description available.',
            categories: book.categories || ['Unknown'],
            reviews: book.reviews || 0,
            isbn: book.isbn || 'Unknown',
            price: book.price || 14.99,
            tags: book.tags || ['Unknown'],
        }));
        authors.value = (authorsRes.data || []).map(author => ({
            ...author,
            name: normalizeAuthorName(author.name),
            profile_image_url: author.profile_image_url || '/placeholder.svg?height=40&width=40',
            readers: author.readers || 0,
            biography: author.biography || 'This author has not provided a biography yet.',
            categories: author.categories || ['Fiction', 'Adventure', 'Inspiration'],
        }));
        categories.value = categoriesRes.data || [];
        languages.value = languagesRes.data || [];

        localStorage.setItem('books', JSON.stringify(books.value));
        localStorage.setItem('authors', JSON.stringify(authors.value));
        localStorage.setItem('categories', JSON.stringify(categories.value));

        if (authors.value.length > 0) {
            author.value = authors.value[0];
            selectedAuthor.value = author.value.name;
            selectedBook.value = books.value.find(book =>
                normalizeAuthorName(book.author?.name || book.authorName) === normalizeAuthorName(author.value.name)
            ) || null;
        }

        featuredBooks.value = books.value.slice(0, 10).map(book => ({
            ...book,
            category: categories.value.find(cat => cat.id === book.CategoryId) || { name: 'Unknown' },
        }));

        bookInventory.value = books.value.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author || { name: book.authorName || 'Unknown' },
            qty: book.quantity || 0,
            lang: book.language || { name: 'Unknown' },
            available: book.available !== undefined ? book.available : true,
            coverUrl: book.cover_image_url,
        }));

        console.log('Fetched books:', books.value);
        console.log('Fetched authors:', authors.value);
    } catch (err) {
        console.error('Failed to fetch data:', err);
        const cachedBooks = localStorage.getItem('books');
        const cachedAuthors = localStorage.getItem('authors');
        const cachedCategories = localStorage.getItem('categories');
        if (cachedBooks) books.value = JSON.parse(cachedBooks);
        if (cachedAuthors) authors.value = JSON.parse(cachedAuthors);
        if (cachedCategories) categories.value = JSON.parse(cachedCategories);

        if (selectedAuthor.value && books.value.length > 0) {
            selectedBook.value = books.value.find(book =>
                normalizeAuthorName(book.author?.name || book.authorName) === normalizeAuthorName(selectedAuthor.value)
            ) || null;
        }

        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: 'Failed to fetch data',
            text: 'Please try again later.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }
};

// Open book details modal
const openBookModal = (book) => {
    selectedBookForModal.value = book;
    showBookModal.value = true;
    quantity.value = 1; // Reset quantity
};

// Quantity controls
const increaseQuantity = () => {
    quantity.value++;
};

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// Action buttons
const addToCart = () => {
    alert(`Added ${quantity.value} item(s) of "${selectedBookForModal.value?.title || 'Book'}" to cart!`);
};

const addToWishlist = () => {
    alert(`Added "${selectedBookForModal.value?.title || 'Book'}" to wishlist!`);
};

// Filter books by selected category
const filterBooksByCategory = () => {
    // Filtering is handled by the computed filteredBooks property
};

// Filter books by selected author
const filterBooksByAuthor = () => {
    if (selectedAuthor.value) {
        const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
        selectedBook.value = books.value.find(book =>
            normalizeAuthorName(book.author?.name || book.authorName) === normalizedSelectedAuthor
        ) || null;
    } else {
        selectedBook.value = books.value[0] || null;
    }
};

// Lifecycle hooks
onMounted(() => {
    fetchBooks();
});
</script>

<style scoped>
/* Fade transition for modals */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Slide-in animation for modals */
.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Line clamp for text truncation */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom scrollbar for modals */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Disabled button styles */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

/* Enhanced typography and spacing */
h1,
h2,
h3,
h4 {
    font-family: 'Inter', sans-serif;
}

/* Responsive image sizing */
@media (max-width: 768px) {
    .w-80 {
        width: 100%;
        max-width: 260px;
    }

    .h-\[24rem\] {
        height: 320px;
    }

    .max-w-sm {
        max-width: 100%;
    }
}

@keyframes slide-in {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slide-in 0.3s ease-out;
}

/* Custom Scrollbar Styling */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 9999px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background-color: #f3f4f6;
    border-radius: 9999px;
}
</style>
<template>
    <!-- Hero Section (Banner) -->
    <section class="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 py-20 md:py-28 shadow-lg">
        <div class="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
            <div class="md:w-1/3 flex justify-center">
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&h=400&q=80"
                    alt="Book Cover" class="rounded-2xl shadow-xl max-w-full h-auto border border-gray-300"
                    style="box-shadow: 0 10px 15px rgba(0,0,0,0.1);" />
            </div>
            <div class="md:w-2/3 text-center md:text-left space-y-8 max-w-xl">
                <h1 class="text-4xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Discover Your Next Read
                </h1>
                <p class="text-2xl text-gray-800 font-semibold">
                    Explore our vast collection of books, available for borrowing.
                </p>
                <p class="text-lg text-gray-700 leading-relaxed">
                    Dive into captivating stories, expand your knowledge, and find new adventures within the pages of
                    our library. Whether you're looking for fiction, non-fiction, or academic resources, our catalog has
                    something for everyone.
                </p>
                <div class="flex justify-center md:justify-start gap-8 pt-8">
                    <button
                        class="bg-gray-900 text-white px-12 py-4 rounded-xl shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-2xl text-lg font-semibold">
                        Browse All Books
                    </button>
                    <button
                        class="border border-gray-300 text-gray-900 px-12 py-4 rounded-xl shadow hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-300 ease-in-out transform hover:-translate-y-0.5">
                        How to Borrow
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- About the Author Section (Example for a specific book) -->
    <section class="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div class="container mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-12">
            <div class="md:w-1/4 flex justify-center">
                <img src="https://covers.openlibrary.org/b/id/10523365-L.jpg" alt="Book Cover"
                    class="rounded-3xl shadow-2xl max-w-full h-auto border border-gray-300"
                    style="box-shadow: 0 8px 20px rgba(0,0,0,0.12);" />
            </div>
            <div class="md:w-3/4 text-center md:text-left space-y-8 max-w-4xl">
                <h2 class="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Featured Author: {{ author.name }}
                </h2>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium max-w-3xl">
                    {{ author.bio }}
                </p>
                <a href="#"
                    class="inline-block text-indigo-600 hover:text-indigo-900 font-semibold relative transition-colors duration-300">
                    View all books by {{ author.name }}
                    <span
                        class="absolute left-0 bottom-0 w-full h-0.5 bg-indigo-600 rounded transition-all duration-300 ease-in-out scale-x-0 hover:scale-x-100 origin-left">
                    </span>
                </a>
            </div>
        </div>
    </section>

    <!-- Customer Reviews Section -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-6 md:px-12">
            <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 tracking-tight">
                What Our Readers Say
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div v-for="review in reviews" :key="review.id"
                    class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-5 cursor-pointer">
                    <div class="flex items-center gap-1 text-yellow-400">
                        <svg v-for="n in review.rating" :key="`star-filled-${n}`" class="w-6 h-6" fill="currentColor"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg v-for="n in 5 - review.rating" :key="`star-empty-${n}`" class="w-6 h-6 text-gray-300"
                            fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </div>
                    <p class="text-xl font-semibold text-gray-900 leading-snug">{{ review.title }}</p>
                    <p class="text-gray-700 leading-relaxed text-justify">{{ review.content }}</p>
                    <p class="text-sm text-gray-500 italic">— {{ review.author }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Books Section (4 cards in a row) -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-6 md:px-12">
            <h2
                class="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16 tracking-wide underline decoration-indigo-500 decoration-4 underline-offset-8">
                Popular Books This Month
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                <div v-for="book in displayedBooks" :key="book.id"
                    class="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center text-center">
                    <img :src="book.cover || 'https://via.placeholder.com/300x400.png?text=Book+Cover'" alt="Book Cover"
                        loading="lazy" class="rounded-xl shadow-md max-w-full h-auto mb-6 object-cover w-full"
                        style="aspect-ratio: 3 / 4;" />
                    <h3 class="text-xl font-semibold text-gray-900 mb-2 tracking-tight leading-snug">
                        {{ book.title }}
                    </h3>
                    <p class="text-gray-600 text-sm mb-6 italic font-medium tracking-wide">
                        {{ book.author }}
                    </p>
                    <button
                        class="mt-auto bg-indigo-600 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-colors duration-300 w-full">
                        View Book
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Book Inventory Table -->
    <section class="py-12 md:py-16 bg-gray-100">
        <div class="container mx-auto px-6 md:px-10">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 tracking-wide">
                Full Library Catalog
            </h2>
            <div class="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Author
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Genre
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Availability
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="item in bookInventory" :key="item.id"
                            class="hover:bg-gray-50 transition-colors cursor-default">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ item.title }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {{ item.author }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {{ item.genre }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span :class="{
                                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold': true,
                                    'bg-green-100 text-green-800': item.available,
                                    'bg-red-100 text-red-800': !item.available,
                                }">
                                    {{ item.available ? 'Available' : 'Borrowed' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Data for the main hero section (conceptually, this would be dynamic)
const book = ref({
    title: 'The Enigmatic Echoes', // This specific book title is less relevant for the main banner, but kept for consistency if a single book is highlighted.
    author: 'Eleanor Vance',
    description: 'In a world where memories are currency, a young archivist uncovers a forgotten melody that holds the key to a hidden past and a perilous future. "The Enigmatic Echoes" is a captivating journey through a dystopian society, blending mystery, adventure, and a touch of romance.',
});

const author = ref({
    name: 'Eleanor Vance',
    bio: 'Eleanor Vance is a critically acclaimed author known for her intricate world-building and compelling characters. With a background in historical linguistics and speculative fiction, she weaves narratives that challenge perceptions and explore the depths of human experience. Her previous works include "Whispers of the Forgotten Star" and "The Chronos Paradox".',
});

const reviews = ref([
    {
        id: 1,
        rating: 5,
        title: 'Absolutely captivating!',
        content: 'I couldn\'t put this book down. The plot twists kept me on the edge of my seat, and the characters felt so real. A must-read for any fantasy and sci-fi lover!',
        author: 'A delighted reader',
    },
    {
        id: 2,
        rating: 4,
        title: 'A unique and thought-provoking read',
        content: 'The concept of memories as currency is brilliant. Eleanor Vance has created a truly original world. Some parts were a bit slow, but overall a fantastic book.',
        author: 'Bookworm_22',
    },
    {
        id: 3,
        rating: 5,
        title: 'Masterpiece of storytelling',
        content: 'From the first page to the last, I was completely immersed. The prose is beautiful, and the story is deeply moving. Highly recommend!',
        author: 'Literary Critic',
    },
]);


const featuredBooks = ref([
    { id: 1, title: 'The Star Weaver', author: 'Anya Sharma', cover: 'https://covers.openlibrary.org/b/id/10523365-L.jpg' },
    { id: 2, title: 'City of Whispers', author: 'Marcus Thorne', cover: 'https://covers.openlibrary.org/b/id/10523366-L.jpg' },
    { id: 3, title: 'Beyond the Horizon', author: 'Lena Petrova', cover: 'https://covers.openlibrary.org/b/id/10523367-L.jpg' },
    { id: 4, title: 'The Silent Garden', author: 'David Chen', cover: 'https://covers.openlibrary.org/b/id/10523368-L.jpg' },
    { id: 5, title: 'Echoes of Time', author: 'Sofia Martinez', cover: 'https://covers.openlibrary.org/b/id/10523369-L.jpg' },
    { id: 6, title: 'Mystic Rivers', author: 'Ethan Brooks', cover: 'https://covers.openlibrary.org/b/id/10523370-L.jpg' },
    { id: 7, title: 'Lost in Shadows', author: 'Maya Patel', cover: 'https://covers.openlibrary.org/b/id/10523371-L.jpg' },
    { id: 8, title: 'Celestial Dreams', author: 'Lucas Zhang', cover: 'https://covers.openlibrary.org/b/id/10523372-L.jpg' },
    { id: 9, title: 'Whispers in the Wind', author: 'Amara Davis', cover: 'https://covers.openlibrary.org/b/id/10523373-L.jpg' },
    { id: 10, title: 'Fragments of Light', author: 'Noah Campbell', cover: 'https://covers.openlibrary.org/b/id/10523374-L.jpg' },
]);

const visibleCount = 4;
const currentIndex = ref(0);
let intervalId = null;

const total = featuredBooks.value.length;

// This computes the 4 cards to show, handling wrap-around using modulo logic
const displayedBooks = computed(() => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
        const idx = (currentIndex.value + i) % total;
        result.push(featuredBooks.value[idx]);
    }
    return result;
});

onMounted(() => {
    intervalId = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % total;
    }, 3000); // slide every 3 seconds
});

onUnmounted(() => {
    clearInterval(intervalId);
});


const bookInventory = ref([
    { id: 1, title: 'The Enigmatic Echoes', author: 'Eleanor Vance', genre: 'Sci-Fi/Mystery', available: true, cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&h=400&q=80' },
    { id: 2, title: 'Whispers of the Forgotten Star', author: 'Eleanor Vance', genre: 'Fantasy', available: false, cover: 'https://covers.openlibrary.org/b/id/10523369-L.jpg' },
    { id: 3, title: 'The Chronos Paradox', author: 'Eleanor Vance', genre: 'Sci-Fi', available: true, cover: 'https://covers.openlibrary.org/b/id/10523370-L.jpg' },
    { id: 4, title: 'The Star Weaver', author: 'Anya Sharma', genre: 'Fantasy', available: true, cover: 'https://covers.openlibrary.org/b/id/10523365-L.jpg' },
    { id: 5, title: 'City of Whispers', author: 'Marcus Thorne', genre: 'Mystery', available: false, cover: 'https://covers.openlibrary.org/b/id/10523366-L.jpg' },
    { id: 6, title: 'Beyond the Horizon', author: 'Lena Petrova', genre: 'Sci-Fi', available: true, cover: 'https://covers.openlibrary.org/b/id/10523367-L.jpg' },
    { id: 7, title: 'The Silent Garden', author: 'David Chen', genre: 'Historical Fiction', available: true, cover: 'https://covers.openlibrary.org/b/id/10523368-L.jpg' },
    { id: 8, title: 'Echoes of the Past', author: 'Sophia Lee', genre: 'Thriller', available: true, cover: 'https://covers.openlibrary.org/b/id/10523371-L.jpg' },
    { id: 9, title: 'The Last Alchemist', author: 'Arthur Pendelton', genre: 'Fantasy', available: false, cover: 'https://covers.openlibrary.org/b/id/10523372-L.jpg' },
    { id: 10, title: 'Quantum Leaps', author: 'Dr. Evelyn Reed', genre: 'Science', available: true, cover: 'https://covers.openlibrary.org/b/id/10523373-L.jpg' },
]);

</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
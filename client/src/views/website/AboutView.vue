<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Sticky Navbar -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Left Navigation Links -->
                    <div class="flex space-x-8">
                        <router-link to="/website"
                            class="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            HOME
                        </router-link>
                        <router-link to="/aboutpage"
                            class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            ABOUT
                        </router-link>
                        <router-link to="/book" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            BOOK
                        </router-link>
                        <router-link to="/donate"
                            class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            DONATE
                        </router-link>
                        <router-link to="/history"
                            class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            HISTORY
                        </router-link>
                    </div>
                    <!-- Right Buttons -->
                    <div class="flex space-x-4 items-center">
                        <router-link to="/login"
                            class="text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200">
                            Login
                        </router-link>
                        <router-link to="/register"
                            class="text-green-600 hover:text-green-800 border border-green-600 hover:border-green-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200">
                            Register
                        </router-link>
                        <router-link to="/dashboard"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Admin Dashboard
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative text-white py-10">
            <!-- Background Image -->
            <div class="absolute inset-0 bg-cover bg-center"
                style="background-image: url('https://www.passerellesnumeriques.org/wp-content/uploads/2024/07/About-us-banner.png');">
            </div>

            <!-- Sky Blue Half Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-sky-400/100 via-sky-800/40 to-transparent"></div>

            <!-- Additional Dark Overlay for Better Text Readability -->
            <div class="absolute inset-0 bg-black/10"></div>

            <!-- Decorative Floating Icons -->
            <div class="absolute top-10 left-10 animate-bounce">
                <BookOpenIcon class="w-8 h-8 text-white/80" />
            </div>
            <div class="absolute bottom-12 right-12 animate-bounce" style="animation-delay: 1s;">
                <HeartIcon class="w-8 h-8 text-white/80" />
            </div>

            <!-- Content -->
            <div class="relative container mx-auto py-10 md:py-20 text-center mb-20">
                <h1 class="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in text-white drop-shadow-lg">
                    Discover More About Our Library
                </h1>
                <p class="text-xl md:text-2xl mb-10 text-white/90 animate-fade-in-delay drop-shadow-md">
                    A digital library inspiring readers for over 20 years
                </p>
                <!-- Stats -->
                <div class="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-delay-2">
                    <div
                        class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
                        <BookMarkedIcon class="w-5 h-5" />
                        <span class="text-lg font-medium">5000+ Books</span>
                    </div>
                    <div
                        class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
                        <UsersIcon class="w-5 h-5" />
                        <span class="text-lg font-medium">1500+ Members</span>
                    </div>
                    <div
                        class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
                        <HeartIcon class="w-5 h-5" />
                        <span class="text-lg font-medium">Community Focused</span>
                    </div>
                </div>
                <!-- CTA Button -->
                <a href="#services"
                    class="bg-white text-sky-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-sky-50 hover:shadow-xl transition-all animate-fade-in-delay-3 inline-block">
                    Explore Our Library
                </a>
            </div>
        </section>
        

    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    BookOpen as BookOpenIcon,
    Clock as ClockIcon,
    MapPin as MapPinIcon,
    Phone as PhoneIcon,
    Mail as MailIcon,
    Users as UsersIcon,
    Calendar as CalendarIcon,
    Wifi as WifiIcon,
    Coffee as CoffeeIcon,
    Computer as ComputerIcon,
    BookMarked as BookMarkedIcon,
    GraduationCap as GraduationCapIcon,
    Heart as HeartIcon,
} from 'lucide-vue-next'



const services = ref([
    {
        icon: BookOpenIcon,
        title: "Book Collection",
        description: "Over 5000 books across all genres and subjects",
    },
    {
        icon: ComputerIcon,
        title: "Digital Resources",
        description: "Access and read all our e-books online anytime through our digital library.",
    },
    {
        icon: WifiIcon,
        title: "Free WiFi",
        description: "High-speed internet access throughout the library",
    },
    {
        icon: GraduationCapIcon,
        title: "Study Spaces",
        description: "Quiet study areas and group collaboration rooms",
    },
    {
        icon: CalendarIcon,
        title: "Study Time",
        description: "Spend time with your friends and study together",
    },
])

const staff = ref([
    {
        name: "Sor Chhin",
        role: "Head Librarian",
        bio: "Sor has been with the library for over 15 years and holds a Master's in Library Science.",
        image: "https://i.pinimg.com/736x/ce/48/c4/ce48c4929e4dc5fa635673a154ad365f.jpg",
    },
    {
        name: "Bopha Khat",
        role: "Digital Resources Manager",
        bio: "Bopha specializes in digital collections and helps patrons navigate online resources.",
        image: "https://i.pinimg.com/1200x/4f/b8/41/4fb841055ded6e714bdeeb03557170c5.jpg",
    },
    {
        name: "Horth Heng",
        role: "Children's Librarian",
        bio: "Horth creates engaging programs for young readers and manages our children's collection.",
        image: "https://i.pinimg.com/736x/15/91/d0/1591d0197e06d97a43a66c172171c2d7.jpg",
    },
    {
        name: "Sophean Pouk",
        role: "Reference Librarian",
        bio: "Sophean assists with research questions and provides reference services to our community.",
        image: "https://i.pinimg.com/736x/4e/e3/5e/4ee35e12d182b4f68e0fa5a4f5343af9.jpg",
    },
])

const hours = ref([
    { day: "Monday - Thursday", hours: "7:00 AM - 5:00 PM" },
    { day: "Friday - Saturday", hours: "8:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 5:00 PM" },
])
</script>

<style scoped>
/* Additional custom styles */
.container {
    max-width: 1200px;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
    animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
    animation: fade-in 0.8s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
    animation: fade-in 0.8s ease-out 0.6s both;
}

.animate-bounce {
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
        transform: translate3d(0, -15px, 0);
    }

    70% {
        transform: translate3d(0, -7px, 0);
    }

    90% {
        transform: translate3d(0, -2px, 0);
    }
}
</style>

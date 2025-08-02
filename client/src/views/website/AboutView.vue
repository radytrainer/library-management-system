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
        <div class="container mx-auto px-4 py-16">
            <!-- Mission Section -->
            <section class="mb-16">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-3xl font-bold mb-8 text-gray-800">Our Mission</h2>
                    <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                        Our mission is to make reading and learning easy and enjoyable for everyone. We provide
                        access to books, resources, and programs that inspire curiosity and support lifelong
                        education in a welcoming community.
                    </p>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div
                            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-sky-400">
                            <BookOpenIcon class="w-12 h-12 text-sky-600 mx-auto mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Knowledge</h3>
                            <p class="text-gray-600">
                                Providing access to vast collections of books, digital resources, and information
                            </p>
                        </div>
                        <div
                            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-400">
                            <UsersIcon class="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Community</h3>
                            <p class="text-gray-600">
                                Creating spaces for connection, collaboration, and cultural exchange
                            </p>
                        </div>
                        <div
                            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-400">


                            <GraduationCapIcon class="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Learning</h3>
                            <p class="text-gray-600">
                                Supporting education and personal growth through programs and resources
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Divider -->

            <div class="border-t border-gray-200 my-16"></div>

            <!-- Services Section -->
            <section id="services" class="mb-16">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="service in services" :key="service.title"
                        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow hover:border-sky-200 border border-transparent">
                        <component :is="service.icon" class="w-10 h-10 text-sky-600 mb-4" />
                        <h3 class="text-xl font-semibold mb-2">{{ service.title }}</h3>
                        <p class="text-gray-600">{{ service.description }}</p>
                    </div>
                </div>
            </section>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-16"></div>

            <!-- Staff Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div v-for="member in staff" :key="member.name"
                        class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow hover:border-sky-200 border border-transparent">
                        <img :src="member.image" :alt="member.name"
                            class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-sky-100" />
                        <h3 class="text-xl font-semibold mb-1">{{ member.name }}</h3>
                        <p class="text-sky-600 font-medium mb-3">{{ member.role }}</p>
                        <p class="text-sm text-gray-600">{{ member.bio }}</p>
                    </div>
                </div>
            </section>
            <!-- Divider -->
            <div class="border-t border-gray-200 my-16"></div>



            <!-- Contact & Hours Section -->
            <section>
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Contact Us</h2>
                <div class="grid md:grid-cols-2 gap-12">
                    <!-- Contact Information -->
                    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-sky-400">
                        <h3 class="text-xl font-semibold mb-6 flex items-center gap-2">
                            <MapPinIcon class="w-5 h-5 text-sky-600" />
                            Contact Information
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <MapPinIcon class="w-5 h-5 text-sky-500 mt-0.5" />
                                <div>
                                    <p class="font-medium">Address</p>
                                    <p class="text-gray-600">
                                        St. 371 Phum Tropeang Chhuk (Borey Sorla),<br> Sangkat Tek Thla, Khan Sen
                                        Sok
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <PhoneIcon class="w-5 h-5 text-sky-500" />
                                <div>
                                    <p class="font-medium">Phone</p>
                                    <p class="text-gray-600">0973893597</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <MailIcon class="w-5 h-5 text-sky-500" />
                                <div>
                                    <p class="font-medium">Email</p>
                                    <p class="text-gray-600">library@passerellesnumeriques.org</p>
                                </div>
                            </div>


                        </div>
                    </div>
                    <!-- Hours -->
                    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-sky-400">
                        <h3 class="text-xl font-semibold mb-6 flex items-center gap-2">
                            <ClockIcon class="w-5 h-5 text-sky-600" />
                            Hours of Operation
                        </h3>
                        <div class="space-y-3">
                            <div v-for="schedule in hours" :key="schedule.day"
                                class="flex justify-between items-center">
                                <span class="font-medium">{{ schedule.day }}</span>
                                <span class="text-gray-600">{{ schedule.hours }}</span>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 my-4"></div>
                        <p class="text-sm text-gray-600">
                            Closed on major holidays. Special hours may apply during holiday seasons.
                        </p>
                    </div>
                </div>
            </section>
        </div>

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

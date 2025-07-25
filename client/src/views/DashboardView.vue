<template>
  <div>
    <div class="max-w-7xl mx-auto px-5 py-5 bg-[#F8F8F8]">
      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-3xl mb-8">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>

        <!-- Floating Elements -->
        <div class="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-10 right-40 w-20 h-20 bg-blue-400/20 rounded-full blur-lg"></div>

        <div class="relative z-10 px-5 py-10 md:px-10 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="text-white">
              <div class="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                System Online
              </div>
              <h2 class="text-3xl font-bold mb-3 leading-tight">
                Your Digital <span
                  class="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Library
                  Hub</span>
              </h2>
              <p class="text-l text-blue-100 mb-5 leading-relaxed">
                Streamline your library operations with our intelligent management system.
                Track inventory, manage members, and analyze trends effortlessly.
              </p>
              <div class="flex sm:flex-row gap-1">
                <button
                  class="bg-white text-blue-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  View Books
                </button>
              </div>
            </div>

            <div class="">
              <img src="../../public/image.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="(stat, index) in modernStats" :key="index"
          class="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
            :class="stat.gradient"></div>

          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-2xl" :class="stat.iconBg">
              <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath"></path>
              </svg>
            </div>
            <div class="text-right">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" :class="stat.trendColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.trendIcon"></path>
                </svg>
                <span class="text-sm font-semibold" :class="stat.trendColor">{{ stat.change }}</span>
              </div>
            </div>
          </div>

          <div class="mb-2">
            <h3 class="text-gray-600 font-medium text-sm">{{ stat.title }}</h3>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ stat.subtitle }}</span>
            <button class="text-xs font-medium px-3 py-1 rounded-full" :class="stat.buttonStyle">
              Details
            </button>
          </div>
        </div>
      </div>
      <!-- Popular Books (Moved Here) -->
<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-bold text-gray-900">Trending Now</h3>
    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">See More</button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <div v-for="(book, index) in trendingBooks.slice(0, 5)" :key="book.id"
      class="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-xl shadow-sm flex flex-col items-center text-center cursor-pointer">
      
      <div class="relative w-full flex justify-center mb-3">
        <img :src="book.cover" alt="Book cover"
          class="w-20 h-28 object-cover rounded-lg shadow-md" />
        <div class="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
          <span class="text-xs text-white font-bold">{{ index + 1 }}</span>
        </div>
      </div>

      <div class="flex-1">
        <h4 class="font-semibold text-blue-700 text-sm truncate w-full">{{ book.title }}</h4>
        <p class="text-xs text-gray-500 mb-2">{{ book.author }}</p>
        <div class="flex justify-center items-center space-x-1 text-yellow-400 mb-1">
          <svg v-for="i in 5" :key="i" class="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span class="text-xs text-green-500">{{ book.borrowed }} borrowed</span>
      </div>
    </div>
  </div>
</div>
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Activity Chart -->
        <div class="xl:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Library Activity</h3>
              <p class="text-gray-500 mt-1">Books borrowed over the past year</p>
            </div>
            <div class="flex items-center space-x-2">
              <button class="px-4 py-2 bg-purple-100 text-blue-700 rounded-xl text-sm font-medium">
                2024
              </button>
            </div>
          </div>

          <div class="relative h-80">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-8">
          <!-- Top Members -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Top Members</h3>
              <button class="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>

            <div class="space-y-4">
              <div v-for="(member) in topMembers" :key="member.id"
                class="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div class="relative">
                  <img :src="member.avatar" :alt="member.name" class="w-16 h-16 rounded-full object-cover">
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                  <p class="text-sm text-gray-500">{{ member.books }} books this month</p>
                </div>
                <div class="text-right">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { ref, computed } from 'vue'

const modernStats = ref([
  {
    title: 'Total Collection',
    value: '12,847',
    change: '+12.5%',
    subtitle: 'vs last month',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-blue-500 to-cyan-500',
    buttonStyle: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  },
  {
    title: 'Active Members',
    value: '3,429',
    change: '+8.2%',
    subtitle: 'this week',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-emerald-500 to-teal-500',
    buttonStyle: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
  },
  {
    title: 'Books Borrowed',
    value: '1,847',
    change: '+23.1%',
    subtitle: 'today',
    iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-purple-500 to-pink-500',
    buttonStyle: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
  },
  {
    title: 'Overdue Items',
    value: '47',
    change: '-15.3%',
    subtitle: 'improvement',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
    gradient: 'from-red-500 to-pink-500',
    buttonStyle: 'bg-red-50 text-red-600 hover:bg-red-100'
  }
])

const topMembers = ref([
  { id: 1, name: 'Alexandra Chen', avatar: 'https://i.pinimg.com/736x/39/ac/16/39ac16c3b8495d92d40cc200fd61f079.jpg', books: 28 },
  { id: 2, name: 'Marcus Johnson', avatar: 'https://i.pinimg.com/736x/56/8a/bf/568abff8277c86f056b3d9fe57844b01.jpg', books: 24 },
  { id: 3, name: 'Sofia Rodriguez', avatar: 'https://i.pinimg.com/736x/83/ec/04/83ec04538a5d3cc061684a569172ca60.jpg', books: 19 },
  { id: 4, name: 'Sofia Rodriguez', avatar: 'https://i.pinimg.com/736x/83/ec/04/83ec04538a5d3cc061684a569172ca60.jpg', books: 19 },
])


const trendingBooks = ref([
  {
    id: 1,
    title: 'The Secret Gaden',
    author: 'F. Scott Fitzgerald',
    borrowed: 124,
    cover: 'https://i.pinimg.com/736x/63/88/27/6388271e73230de7dd4fad90287fa36b.jpg'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    borrowed: 98,
    cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' 
  },
  {
    id: 3,
    title: 'Cambodia',
    author: 'Harper Lee',
    borrowed: 76,
    cover: 'https://i.pinimg.com/736x/35/dd/d6/35ddd6b04c0df0a4cafb3e5b5c5e5ee0.jpg'
  },
  {
    id: 4,
    title: 'Avatar the way of water',
    author: 'Harper Lee',
    borrowed: 76,
    cover: 'https://i.pinimg.com/1200x/67/4e/b6/674eb674005d93f4d683cee78b7751ce.jpg'
  },
  {
    id: 5,
    title: 'ស្ត្រីដែកថែប',
    author: 'Harper Lee',
    borrowed: 76,
    cover: 'https://content-asset.phsar121.com/products/J1fnJ4donqnfDFL1VcLBPNxND0NjOZZlE7k63WOO.jpg'
  },
])




// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Sample borrow data
const activityData = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 50 },
  { month: 'Jun', value: 30 },
  { month: 'Jul', value: 20 },
  { month: 'Aug', value: 45 },
  { month: 'Sep', value: 60 },
  { month: 'Oct', value: 55 },
  { month: 'Nov', value: 65 },
  { month: 'Dec', value: 70 }
]

// Convert to Chart.js data format
const chartData = computed(() => ({
  labels: activityData.map(item => item.month),
  datasets: [
    {
      label: 'Books Borrowed',
      data: activityData.map(item => item.value),
      backgroundColor: 'rgba(139, 92, 246, 0.8)', // Tailwind purple-600
      borderRadius: 10,
      barThickness: 30
    }
  ]
}))

// Chart display options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 8,
      cornerRadius: 6
    }
  },
  scales: {
    x: {
      ticks: { color: '#6b7280' },
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 10, color: '#6b7280' },
      grid: { color: '#e5e7eb' } // Tailwind gray-200
    }
  }
}
</script>
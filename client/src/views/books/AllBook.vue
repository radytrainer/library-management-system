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
              <h1 class="text-3xl font-bold mb-4">
                Why is it important to read books?
              </h1>
              <p class="text-base text-blue-100 mb-5 leading-relaxed w-full">
                Reading books helps us gain knowledge, improve focus, and grow our imagination. It’s a simple way to learn and succeed in life.
              </p>

              <div class="flex sm:flex-row gap-1">
                <button
                  class="bg-white text-blue-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  Read Books
                </button>
              </div>
            </div>

            <div>
              <img src="../../../public/image.png" alt="Reading illustration" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <!-- Left Section -->
        <div class="xl:col-span-2 bg-white rounded-2xl p-10 shadow-sm border border-gray-100">

          <!-- Popular Section -->
          <div class="mb-10">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Popular</h3>
              <a href="#" class="text-blue-600 text-sm font-medium hover:underline">All</a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
                  class="w-16 h-16 mx-auto mb-2" />
                <h4 class="font-bold">Laravel <span class="text-yellow-400">★★★</span></h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/2995/2995471.png"
                  class="w-16 h-16 mx-auto mb-2" />
                <h4 class="font-bold">Vue.js <span class="text-yellow-400">★★★</span></h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/3198/3198573.png"
                  class="w-16 h-16 mx-auto mb-2" />
                <h4 class="font-bold">React <span class="text-yellow-400">★★★</span></h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/2942/2942861.png"
                  class="w-16 h-16 mx-auto mb-2" />
                <h4 class="font-bold">Tailwind <span class="text-yellow-400">★★★</span></h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
            </div>
          </div>

          <!-- Ongoing Section -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Ongoing</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://covers.openlibrary.org/b/id/10569870-L.jpg"
                  class="w-full h-32 object-cover rounded-md mb-2" />
                <h4 class="font-bold">Book Title 1</h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://covers.openlibrary.org/b/id/10569682-L.jpg"
                  class="w-full h-32 object-cover rounded-md mb-2" />
                <h4 class="font-bold">Book Title 2</h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://covers.openlibrary.org/b/id/10569888-L.jpg"
                  class="w-full h-32 object-cover rounded-md mb-2" />
                <h4 class="font-bold">Book Title 3</h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
                <img src="https://covers.openlibrary.org/b/id/10569704-L.jpg"
                  class="w-full h-32 object-cover rounded-md mb-2" />
                <h4 class="font-bold">Book Title 4</h4>
                <p class="text-sm text-gray-500">Books teach you how to think deeper, ask...</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Section -->
        <div class="space-y-8">

          <!-- Book Donor -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Book Donor</h3>
              <button class="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Sophean</span>
                  <span>9 books</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 90%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Bopha</span>
                  <span>8 books</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 80%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Linna</span>
                  <span>6 books</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Horth</span>
                  <span>5 books</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 50%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Sophean</span>
                  <span>2 books</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 20%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Book Category -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Book Category</h3>
              <button class="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center text-sm">
                <span>English</span>
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition">
                  Borrow
                </button>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Khmer</span>
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition">
                  Borrow
                </button>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Science</span>
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition">
                  Borrow
                </button>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>History</span>
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition">
                  Borrow
                </button>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Technology</span>
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition">
                  Borrow
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<template>
  <section
    class="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-slow">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow"
        style="animation-delay: 2s;"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-float">
      </div>
    </div>

    <div class="container -mt-20 px-20 relative">
      <div class="grid lg:grid-cols-2 gap-5 items-center">
        <!-- Enhanced text content -->
        <div class="space-y-7 text-center lg:text-left">
          <!-- Organization badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-teal-200/50 shadow-sm animate-fade-in">
            <div class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span class="text-teal-700 font-semibold text-sm tracking-wide uppercase">
              Passerelles Numériques Cambodia
            </span>
          </div>

          <!-- Main heading with enhanced typography -->
          <div class="space-y-4">
            <h1
              class="md:text-3xl lg:text-3xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DISCOVER THE FUTURE OF LEARNING
            </h1>
            <div class="flex justify-center lg:justify-start">
              <div class="w-40 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-slide-in-right">
              </div>
            </div>
          </div>

          <!-- Enhanced description -->
          <p class="text-lg animate-fade-in-delayed">
            Unlock unlimited potential with our cutting-edge digital library. Access premium academic resources,
            collaborative learning tools, and innovative research platforms designed to accelerate your educational
            journey.
          </p>
          <!-- Enhanced statistics -->
          <div class="grid grid-cols-3 gap-6 py-6 animate-fade-in-delayed" style="animation-delay: 0.4s;">
            <div class="text-center">
              <div class="text-xl md:text-3xl font-bold text-slate-900">10K+</div>
              <div class="text-sm text-slate-600 font-medium">Digital Resources</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-slate-900">500+</div>
              <div class="text-sm text-slate-600 font-medium">Research Papers</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-slate-900">24/7</div>
              <div class="text-sm text-slate-600 font-medium">Access</div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button @click="$emit('scroll-to-section', '#catalog')"
              class="group relative inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25 animate-slide-in-up"
              style="animation-delay: 0.5s;">
              <span class="relative">Explore Resources</span>
              <svg class="ml-2 w-8 h-8 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6">
                </path>
              </svg>
              <div class="absolute inset-0 bg-gradient-to-r from-teal-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
            </button>
            <button @click="$emit('scroll-to-section', '#membership')"
              class="group inline-flex items-center justify-center px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-700 font-semibold text-sm rounded-xl border-2 border-slate-200 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-slide-in-up"
              style="animation-delay: 0.6s;">
              Join the Library
              <svg class="ml-1.5 w-8 h-8 transition-transform group-hover:translate-x-1" fill="none"
                stroke="currentColor" viewBox="-3 -3 30 30">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Enhanced image section -->
        <div class="flex justify-center lg:justify-end relative">
          <div class="relative animate-fade-in-delayed" style="animation-delay: 0.3s;">
            <!-- Main image container -->
            <div class="relative backdrop-blur-sm p-8 border border-white/20">
              <img src="/bookhome.png" alt="PNC Library Digital Resources - Empowering Academic Excellence"
                class="w-full max-w-sm object-contain relative z-10 drop-shadow-2xl">

              <!-- Enhanced decorative elements -->
              <div
                class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-teal-400/30 to-blue-400/30 rounded-2xl blur-xl animate-pulse-slow rotate-12">
              </div>
              <div
                class="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-2xl blur-xl animate-pulse-slow -rotate-12"
                style="animation-delay: 1s;"></div>
            </div>

            <!-- Enhanced floating cards -->
            <div
              class="absolute top-16 -left-20 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow max-w-xs">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">Research Hub</div>
                  <div class="text-xs text-slate-500">Advanced AI Tools</div>
                </div>
              </div>
            </div>

            <div
              class="absolute top-20 -right-16 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow max-w-xs"
              style="animation-delay: 1.5s;">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">Smart Learning</div>
                  <div class="text-xs text-slate-500">Personalized Experience</div>
                </div>
              </div>
            </div>

            <div
              class="absolute bottom-12 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow"
              style="animation-delay: 2.5s;">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">Digital Library</div>
                  <div class="text-xs text-slate-500">Unlimited Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delayed {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float-slow {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-10px) rotate(0.5deg);
  }

  66% {
    transform: translateY(-5px) rotate(-0.5deg);
  }
}

@keyframes pulse-slow {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.animate-slide-in-up {
  animation: slide-in-up 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out forwards;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>
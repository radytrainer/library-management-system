<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
    <!-- 3D Background Scene -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div class="scene-3d">
        <div class="library-scene">
          <!-- Floating Books -->
          <div class="floating-book book-1"></div>
          <div class="floating-book book-2"></div>
          <div class="floating-book book-3"></div>
          <div class="floating-book book-4"></div>
          <div class="floating-book book-5"></div>
          <div class="floating-book book-6"></div>
          <div class="floating-book book-7"></div>
          <div class="floating-book book-8"></div>
          
          <!-- Book Shelves -->
          <div class="bookshelf shelf-1">
            <div class="shelf-board"></div>
            <div class="shelf-book sb-1"></div>
            <div class="shelf-book sb-2"></div>
            <div class="shelf-book sb-3"></div>
            <div class="shelf-book sb-4"></div>
            <div class="shelf-book sb-5"></div>
          </div>
          
          <div class="bookshelf shelf-2">
            <div class="shelf-board"></div>
            <div class="shelf-book sb-6"></div>
            <div class="shelf-book sb-7"></div>
            <div class="shelf-book sb-8"></div>
            <div class="shelf-book sb-9"></div>
            <div class="shelf-book sb-10"></div>
          </div>
          
          <!-- Floating Particles -->
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
          <div class="particle particle-6"></div>
          <div class="particle particle-7"></div>
          <div class="particle particle-8"></div>
          
          <!-- Knowledge Symbols -->
          <div class="knowledge-symbol symbol-1">📚</div>
          <div class="knowledge-symbol symbol-2">💡</div>
          <div class="knowledge-symbol symbol-3">🎓</div>
          <div class="knowledge-symbol symbol-4">✨</div>
          <div class="knowledge-symbol symbol-5">📖</div>
          <div class="knowledge-symbol symbol-6">🔍</div>
        </div>
      </div>
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>

    <!-- Registration Form -->
    <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8">
      <h2 class="text-2xl font-bold text-white text-center mb-6">Create Your Account</h2>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Profile Upload -->
        <div class="flex flex-col items-center space-y-2">
          <div
            class="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 bg-white flex items-center justify-center cursor-pointer shadow-lg
                    hover:scale-105 transition-transform duration-300"
            @click="triggerFileInput"
            title="Click to upload profile image"
          >
            <img
              v-if="previewImage"
              :src="previewImage"
              alt="Profile Preview"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-blue-500 font-semibold text-sm">Upload</span>
          </div>
          <input type="file" accept="image/*" ref="fileInput" @change="onFileChange" class="hidden" />
          <label class="text-sm font-semibold text-white">Profile Image</label>
        </div>
        <!-- Full Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-white mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            placeholder="Your Full Name"
            class="w-full px-4 py-2 bg-transparent text-white placeholder-white border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="example@mail.com"
            class="w-full px-4 py-2 bg-transparent text-white placeholder-white border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>
        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            required
            placeholder="Enter your password"
            class="w-full px-4 py-2 bg-transparent text-white placeholder-white border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>
        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-white mb-1">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            required
            placeholder="Re-enter your password"
            class="w-full px-4 py-2 bg-transparent text-white placeholder-white border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>
        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
      <p class="text-xs text-center text-white mt-4">
        Already have an account?
        <a href="#" class="text-blue-300 hover:underline">Sign In</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  profileImage: null,
})

const previewImage = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.profileImage = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const handleSubmit = () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  console.log('Form submitted:', {
    name: form.name,
    email: form.email,
    password: form.password,
    profileImage: form.profileImage,
  })
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.profileImage = null
  previewImage.value = null
  if (fileInput.value) fileInput.value.value = ''
  router.push('/dashboard')
}
</script>

<style scoped>
/* 3D Scene Setup */
.scene-3d {
  perspective: 1500px;
  perspective-origin: center center;
  width: 100%;
  height: 100%;
}

.library-scene {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: sceneRotate 60s linear infinite;
}

@keyframes sceneRotate {
  0% { transform: rotateY(0deg) rotateX(0deg); }
  25% { transform: rotateY(90deg) rotateX(5deg); }
  50% { transform: rotateY(180deg) rotateX(0deg); }
  75% { transform: rotateY(270deg) rotateX(-5deg); }
  100% { transform: rotateY(360deg) rotateX(0deg); }
}

/* Floating Books */
.floating-book {
  position: absolute;
  width: 40px;
  height: 30px;
  border-radius: 3px;
  transform-style: preserve-3d;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.floating-book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  transform: translateZ(-8px);
  filter: brightness(0.7);
  border-radius: inherit;
}

.floating-book::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: inherit;
  transform: rotateY(90deg) translateZ(4px);
  transform-origin: right;
  filter: brightness(0.8);
  border-radius: 0 3px 3px 0;
}

.book-1 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  top: 10%;
  left: 10%;
  transform: translateZ(100px) rotateZ(15deg);
  animation: floatBook1 8s ease-in-out infinite;
}

.book-2 {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  top: 20%;
  right: 15%;
  transform: translateZ(80px) rotateZ(-20deg);
  animation: floatBook2 10s ease-in-out infinite 1s;
}

.book-3 {
  background: linear-gradient(135deg, #16a34a, #15803d);
  top: 60%;
  left: 5%;
  transform: translateZ(120px) rotateZ(25deg);
  animation: floatBook3 7s ease-in-out infinite 2s;
}

.book-4 {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  top: 70%;
  right: 10%;
  transform: translateZ(90px) rotateZ(-15deg);
  animation: floatBook4 9s ease-in-out infinite 3s;
}

.book-5 {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  top: 40%;
  left: 80%;
  transform: translateZ(110px) rotateZ(30deg);
  animation: floatBook5 6s ease-in-out infinite 4s;
}

.book-6 {
  background: linear-gradient(135deg, #f97316, #ea580c);
  top: 15%;
  left: 50%;
  transform: translateZ(70px) rotateZ(-10deg);
  animation: floatBook6 11s ease-in-out infinite 5s;
}

.book-7 {
  background: linear-gradient(135deg, #ec4899, #db2777);
  top: 80%;
  left: 40%;
  transform: translateZ(130px) rotateZ(20deg);
  animation: floatBook7 8s ease-in-out infinite 6s;
}

.book-8 {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  top: 50%;
  right: 30%;
  transform: translateZ(60px) rotateZ(-25deg);
  animation: floatBook8 10s ease-in-out infinite 7s;
}

/* Book Shelves */
.bookshelf {
  position: absolute;
  transform-style: preserve-3d;
}

.shelf-1 {
  top: 30%;
  left: -20%;
  transform: translateZ(50px) rotateY(45deg);
}

.shelf-2 {
  top: 60%;
  right: -20%;
  transform: translateZ(40px) rotateY(-45deg);
}

.shelf-board {
  width: 200px;
  height: 20px;
  background: linear-gradient(135deg, #8b4513, #654321);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.shelf-book {
  position: absolute;
  width: 25px;
  height: 35px;
  border-radius: 2px;
  top: -35px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.sb-1 { left: 10px; background: #ef4444; }
.sb-2 { left: 40px; background: #3b82f6; }
.sb-3 { left: 70px; background: #16a34a; }
.sb-4 { left: 100px; background: #eab308; }
.sb-5 { left: 130px; background: #8b5cf6; }
.sb-6 { left: 10px; background: #f97316; }
.sb-7 { left: 40px; background: #ec4899; }
.sb-8 { left: 70px; background: #06b6d4; }
.sb-9 { left: 100px; background: #84cc16; }
.sb-10 { left: 130px; background: #f59e0b; }

/* Floating Particles */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  transform-style: preserve-3d;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
}

.particle-1 { top: 15%; left: 20%; transform: translateZ(150px); animation: particleFloat1 5s ease-in-out infinite; }
.particle-2 { top: 25%; right: 25%; transform: translateZ(140px); animation: particleFloat2 6s ease-in-out infinite 1s; }
.particle-3 { top: 45%; left: 15%; transform: translateZ(160px); animation: particleFloat3 4s ease-in-out infinite 2s; }
.particle-4 { top: 65%; right: 20%; transform: translateZ(130px); animation: particleFloat4 7s ease-in-out infinite 3s; }
.particle-5 { top: 35%; left: 70%; transform: translateZ(170px); animation: particleFloat5 5.5s ease-in-out infinite 4s; }
.particle-6 { top: 75%; left: 60%; transform: translateZ(120px); animation: particleFloat6 6.5s ease-in-out infinite 5s; }
.particle-7 { top: 55%; right: 40%; transform: translateZ(180px); animation: particleFloat7 4.5s ease-in-out infinite 6s; }
.particle-8 { top: 85%; left: 30%; transform: translateZ(110px); animation: particleFloat8 8s ease-in-out infinite 7s; }

/* Knowledge Symbols */
.knowledge-symbol {
  position: absolute;
  font-size: 24px;
  transform-style: preserve-3d;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
}

.symbol-1 { top: 20%; left: 30%; transform: translateZ(200px); animation: symbolFloat1 6s ease-in-out infinite; }
.symbol-2 { top: 40%; right: 35%; transform: translateZ(180px); animation: symbolFloat2 7s ease-in-out infinite 1s; }
.symbol-3 { top: 60%; left: 25%; transform: translateZ(190px); animation: symbolFloat3 5s ease-in-out infinite 2s; }
.symbol-4 { top: 80%; right: 30%; transform: translateZ(170px); animation: symbolFloat4 8s ease-in-out infinite 3s; }
.symbol-5 { top: 30%; left: 60%; transform: translateZ(160px); animation: symbolFloat5 6.5s ease-in-out infinite 4s; }
.symbol-6 { top: 70%; left: 70%; transform: translateZ(210px); animation: symbolFloat6 5.5s ease-in-out infinite 5s; }

/* Animations */
@keyframes floatBook1 {
  0%, 100% { transform: translateZ(100px) rotateZ(15deg) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(100px) rotateZ(15deg) translateY(-20px) rotateX(10deg); }
}

@keyframes floatBook2 {
  0%, 100% { transform: translateZ(80px) rotateZ(-20deg) translateY(0px) rotateY(0deg); }
  50% { transform: translateZ(80px) rotateZ(-20deg) translateY(-15px) rotateY(15deg); }
}

@keyframes floatBook3 {
  0%, 100% { transform: translateZ(120px) rotateZ(25deg) translateY(0px) rotateZ(25deg); }
  50% { transform: translateZ(120px) rotateZ(25deg) translateY(-25px) rotateZ(40deg); }
}

@keyframes floatBook4 {
  0%, 100% { transform: translateZ(90px) rotateZ(-15deg) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(90px) rotateZ(-15deg) translateY(-18px) rotateX(-10deg); }
}

@keyframes floatBook5 {
  0%, 100% { transform: translateZ(110px) rotateZ(30deg) translateY(0px) rotateY(0deg); }
  50% { transform: translateZ(110px) rotateZ(30deg) translateY(-22px) rotateY(-15deg); }
}

@keyframes floatBook6 {
  0%, 100% { transform: translateZ(70px) rotateZ(-10deg) translateY(0px) rotateZ(-10deg); }
  50% { transform: translateZ(70px) rotateZ(-10deg) translateY(-12px) rotateZ(-25deg); }
}

@keyframes floatBook7 {
  0%, 100% { transform: translateZ(130px) rotateZ(20deg) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(130px) rotateZ(20deg) translateY(-28px) rotateX(15deg); }
}

@keyframes floatBook8 {
  0%, 100% { transform: translateZ(60px) rotateZ(-25deg) translateY(0px) rotateY(0deg); }
  50% { transform: translateZ(60px) rotateZ(-25deg) translateY(-16px) rotateY(20deg); }
}

@keyframes particleFloat1 {
  0%, 100% { transform: translateZ(150px) translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateZ(150px) translateY(-30px) scale(1.2); opacity: 1; }
}

@keyframes particleFloat2 {
  0%, 100% { transform: translateZ(140px) translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateZ(140px) translateY(-25px) scale(1.3); opacity: 1; }
}

@keyframes particleFloat3 {
  0%, 100% { transform: translateZ(160px) translateY(0px) scale(1); opacity: 0.9; }
  50% { transform: translateZ(160px) translateY(-35px) scale(1.1); opacity: 1; }
}

@keyframes particleFloat4 {
  0%, 100% { transform: translateZ(130px) translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateZ(130px) translateY(-20px) scale(1.4); opacity: 1; }
}

@keyframes particleFloat5 {
  0%, 100% { transform: translateZ(170px) translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateZ(170px) translateY(-28px) scale(1.2); opacity: 1; }
}

@keyframes particleFloat6 {
  0%, 100% { transform: translateZ(120px) translateY(0px) scale(1); opacity: 0.9; }
  50% { transform: translateZ(120px) translateY(-32px) scale(1.3); opacity: 1; }
}

@keyframes particleFloat7 {
  0%, 100% { transform: translateZ(180px) translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateZ(180px) translateY(-24px) scale(1.1); opacity: 1; }
}

@keyframes particleFloat8 {
  0%, 100% { transform: translateZ(110px) translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateZ(110px) translateY(-26px) scale(1.4); opacity: 1; }
}

@keyframes symbolFloat1 {
  0%, 100% { transform: translateZ(200px) translateY(0px) rotateZ(0deg) scale(1); }
  50% { transform: translateZ(200px) translateY(-15px) rotateZ(10deg) scale(1.1); }
}

@keyframes symbolFloat2 {
  0%, 100% { transform: translateZ(180px) translateY(0px) scale(1) rotateY(0deg); }
  50% { transform: translateZ(180px) translateY(-12px) scale(1.15) rotateY(15deg); }
}

@keyframes symbolFloat3 {
  0%, 100% { transform: translateZ(190px) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(190px) translateY(-18px) rotateX(10deg); }
}

@keyframes symbolFloat4 {
  0%, 100% { transform: translateZ(170px) translateY(0px) rotateZ(0deg); }
  50% { transform: translateZ(170px) translateY(-10px) rotateZ(-10deg); }
}

@keyframes symbolFloat5 {
  0%, 100% { transform: translateZ(160px) translateY(0px) scale(1); }
  50% { transform: translateZ(160px) translateY(-14px) scale(1.2); }
}

@keyframes symbolFloat6 {
  0%, 100% { transform: translateZ(210px) translateY(0px) rotateY(0deg); }
  50% { transform: translateZ(210px) translateY(-16px) rotateY(-15deg); }
}

/* Fade transition for original slideshow (kept for compatibility) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
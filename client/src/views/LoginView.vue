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

    <!-- Login Form -->
    <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8">
      <h2 class="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>
      <p class="text-white/80 text-center mb-8">Sign in to your account</p>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
        <p class="text-green-300 text-sm text-center">{{ successMessage }}</p>
      </div>

      <!-- Error Messages -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p class="text-red-300 text-sm text-center">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-1">
            Email <span class="text-red-400">*</span>
          </label>
          <input
            v-model="loginForm.email"
            type="email"
            id="email"
            required
            placeholder="Enter your email"
            :class="[
              'w-full px-4 py-2 bg-transparent text-white placeholder-white/70 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all',
              emailError ? 'border-red-500' : 'border-white/50'
            ]"
            @blur="validateEmail"
            @input="clearEmailError"
          />
          <p v-if="emailError" class="text-red-400 text-xs mt-1">{{ emailError }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-1">
            Password <span class="text-red-400">*</span>
          </label>
          <div class="relative">
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              placeholder="Enter your password"
              :class="[
                'w-full px-4 py-2 pr-12 bg-transparent text-white placeholder-white/70 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all',
                passwordError ? 'border-red-500' : 'border-white/50'
              ]"
              @blur="validatePassword"
              @input="clearPasswordError"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="text-red-400 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              v-model="loginForm.rememberMe"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-transparent border-white/50 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="ml-2 text-sm text-white">Remember me</span>
          </label>
          
          <a 
            href="#" 
            @click.prevent="showForgotPassword = true"
            class="text-sm text-blue-300 hover:text-blue-200 hover:underline transition-colors"
          >
            Forgot Password?
          </a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <!-- Sign Up Link -->
      <p class="text-xs text-center text-white mt-6">
        Don't have an account?
        <a href="#" @click.prevent="goToSignUp" class="text-blue-300 hover:text-blue-200 hover:underline transition-colors">
          Sign Up
        </a>
      </p>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Reset Password</h3>
        <p class="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
        
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-4">
            <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="resetEmail"
              type="email"
              id="resetEmail"
              required
              placeholder="Enter your email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex gap-3">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// State management
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')

// Error handling
const errorMessage = ref('')
const successMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

// Mock user database (in real app, this would be handled by backend)
const mockUsers = [
  { email: 'admin@library.com', password: 'admin123', name: 'Admin User' },
  { email: 'user@library.com', password: 'user123', name: 'Library User' },
  { email: 'test@example.com', password: 'test123', name: 'Test User' }
]

// Validation functions
const validateEmail = () => {
  if (!loginForm.email) {
    emailError.value = 'Email is required'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  emailError.value = ''
  return true
}

const validatePassword = () => {
  if (!loginForm.password) {
    passwordError.value = 'Password is required'
    return false
  }
  passwordError.value = ''
  return true
}

const clearEmailError = () => {
  if (emailError.value) emailError.value = ''
  if (errorMessage.value) errorMessage.value = ''
}

const clearPasswordError = () => {
  if (passwordError.value) passwordError.value = ''
  if (errorMessage.value) errorMessage.value = ''
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Authentication functions
const authenticateUser = (email, password) => {
  return mockUsers.find(user => user.email === email && user.password === password)
}

const createSession = (user, rememberMe) => {
  const sessionData = {
    user: { email: user.email, name: user.name },
    timestamp: Date.now(),
    rememberMe
  }
  
  if (rememberMe) {
    localStorage.setItem('userSession', JSON.stringify(sessionData))
  } else {
    sessionStorage.setItem('userSession', JSON.stringify(sessionData))
  }
  console.log('Session created:', sessionData)
}

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  
  if (!isEmailValid || !isPasswordValid) {
    return
  }
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const user = authenticateUser(loginForm.email, loginForm.password)
    if (user) {
      createSession(user, loginForm.rememberMe)
      successMessage.value = `Welcome back, ${user.name}!`
      router.push('/dashboard') // <-- Redirect to dashboard after login
    } else {
      errorMessage.value = 'Invalid email or password. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
  router.push('/dashboard')
}

const handleForgotPassword = async () => {
  if (!resetEmail.value) {
    alert('Please enter your email address')
    return
  }
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert(`Password reset link sent to ${resetEmail.value}`)
  showForgotPassword.value = false
  resetEmail.value = ''
}

const goToSignUp = () => {
  router.push('/register')
}

const checkExistingSession = () => {
  const sessionData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession')
  if (sessionData) {
    const session = JSON.parse(sessionData)
    console.log('Existing session found:', session)
}


checkExistingSession()
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
</style>
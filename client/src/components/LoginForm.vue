<template>
  <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-8">
    <h2 class="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">Welcome Back</h2>
    <p class="text-white/80 text-center mb-6 sm:mb-8">Sign in with your username</p>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-3 sm:mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
      <p class="text-green-300 text-xs sm:text-sm text-center">{{ successMessage }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-3 sm:mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-300 text-xs sm:text-sm text-center">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
      <!-- Username -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Username <span class="text-red-400">*</span></label>
        <input v-model="loginForm.username" type="text" required placeholder="Enter username"
          class="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-transparent text-white border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all"
          :class="usernameError ? 'border-red-500' : 'border-white/50'" @blur="validateUsername" @input="clearUsernameError" />
        <p v-if="usernameError" class="text-red-400 text-xs mt-1">{{ usernameError }}</p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Password <span class="text-red-400">*</span></label>
        <div class="relative">
          <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" required placeholder="Enter password"
            class="w-full px-3 py-2 sm:px-4 sm:py-2.5 pr-10 bg-transparent text-white border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all"
            :class="passwordError ? 'border-red-500' : 'border-white/50'" @blur="validatePassword" @input="clearPasswordError" />
          <button type="button" @click="togglePasswordVisibility"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            👁
          </button>
        </div>
        <p v-if="passwordError" class="text-red-400 text-xs mt-1">{{ passwordError }}</p>
      </div>

      <!-- Remember Me + Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-white text-xs sm:text-sm">
          <input v-model="loginForm.rememberMe" type="checkbox" class="w-4 h-4" /> Remember me
        </label>
        <a href="#" @click.prevent="showForgotPassword = true"
          class="text-xs sm:text-sm text-blue-300 hover:underline">Forgot Password?</a>
      </div>

      <!-- Submit -->
      <button type="submit" :disabled="isLoading"
        class="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:bg-blue-800 disabled:opacity-50">
        <span v-if="isLoading">Signing in...</span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Sign Up -->
    <p class="text-xs text-center text-white mt-4 sm:mt-6">
      Don't have an account? <a href="#" @click.prevent="goToSignUp"
        class="text-blue-300 hover:underline">Sign Up</a>
    </p>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4">Reset Password</h3>
        <p class="text-gray-600 mb-4">Enter your username to get a reset link.</p>
        <form @submit.prevent="handleForgotPassword">
          <input v-model="resetUsername" type="text" required placeholder="Username"
            class="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <div class="flex gap-3">
            <button type="button" @click="showForgotPassword = false"
              class="flex-1 border rounded-lg py-2">Cancel</button>
            <button type="submit" class="flex-1 bg-blue-600 text-white rounded-lg py-2">Send Link</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({ username: '', password: '', rememberMe: false })
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetUsername = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const usernameError = ref('')
const passwordError = ref('')

// ✅ Validation + Authentication (same as your original script)
const validateUsername = () => { /* same as before */ }
const validatePassword = () => { /* same as before */ }
const clearUsernameError = () => { usernameError.value = ''; errorMessage.value = '' }
const clearPasswordError = () => { passwordError.value = ''; errorMessage.value = '' }
const togglePasswordVisibility = () => { showPassword.value = !showPassword.value }

const handleLogin = async () => { /* your API call logic */ }
const handleForgotPassword = async () => { /* forgot password logic */ }
const goToSignUp = () => { router.push('/register') }
</script>

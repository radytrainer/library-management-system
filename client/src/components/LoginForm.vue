<template>
  <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8">
    <h2 class="text-2xl font-bold text-white text-center mb-6">Sign In</h2>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Email</label>
        <input v-model="form.email" type="email" required placeholder="example@mail.com"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Password</label>
        <input v-model="form.password" type="password" required placeholder="Enter your password"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <button type="submit"
        class="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        :disabled="isLoading">
        {{ isLoading ? 'Signing In...' : 'Login' }}
      </button>

      <p v-if="errorMessage" class="text-red-400 text-xs text-center mt-2">{{ errorMessage }}</p>
    </form>

    <p class="text-xs text-center text-white mt-4">
      Don't have an account?
      <a href="#" @click.prevent="goToRegister" class="text-blue-300 hover:underline">Register</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const authStore = useUserStore()

const form = ref({ email: '', password: '' })
const errorMessage = ref('')
const isLoading = ref(false)

const goToRegister = () => router.push('/register')

const handleLogin = async () => {
  console.log('Login started with email:', form.value.email)
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await authStore.login(form.value.email, form.value.password)
    console.log('Login result:', result)
    if (result.success) {
      console.log('Login successful, redirecting...')
      const role = authStore.user?.role
      router.push(role === 'admin' ? '/dashboard' : '/books')
    } else {
      throw new Error(result.error || 'Login failed')
    }
  } catch (err) {
    console.error('Login error:', err)
    errorMessage.value = err.message || 'Invalid email or password!'
  } finally {
    isLoading.value = false
    console.log('Login process finished')
  }
}
</script>
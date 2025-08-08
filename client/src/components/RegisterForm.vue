<template>
  <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8">
    <h2 class="text-2xl font-bold text-white text-center mb-6">Create Your Account</h2>
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Full Name</label>
        <input v-model="form.username" type="text" required placeholder="Your Full Name"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Email</label>
        <input v-model="form.email" type="email" required placeholder="example@mail.com"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Phone Number</label>
        <input v-model="form.phone" type="tel" required placeholder="+1234567890"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Password</label>
        <input v-model="form.password" type="password" required placeholder="Enter your password"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Confirm Password</label>
        <input v-model="form.confirmPassword" type="password" required placeholder="Re-enter your password"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <button type="submit"
        class="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        :disabled="isSubmitting">
        {{ isSubmitting ? 'Registering...' : 'Register' }}
      </button>

      <p v-if="formError" class="text-red-400 text-xs text-center">{{ formError }}</p>
    </form>

    <p class="text-xs text-center text-white mt-4">
      Already have an account?
      <a href="#" @click.prevent="goToSignIn" class="text-blue-300 hover:underline">Sign In</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { registerUser } from '@/services/Api/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const formError = ref('')
const isSubmitting = ref(false)

const goToSignIn = () => router.push('/login')

const handleSubmit = async () => {
  formError.value = ''
  isSubmitting.value = true

  // ✅ Check password confirmation
  if (form.value.password !== form.value.confirmPassword) {
    formError.value = 'Passwords do not match'
    isSubmitting.value = false
    return
  }

  try {
    const user = await registerUser(form.value)

    // ✅ Save to Pinia store
    authStore.setUser({
      token: user.accessToken,
      role: user.role,
      name: user.username,
      email: user.email
    })

    // ✅ Redirect by role
    router.push(user.role === 'admin' ? '/dashboard' : '/books')

  } catch (err) {
    formError.value = err.response?.data?.message || 'Something went wrong!'
  } finally {
    isSubmitting.value = false
  }
}
</script>


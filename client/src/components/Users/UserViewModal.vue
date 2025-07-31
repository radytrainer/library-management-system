<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: Boolean,
  user: {
    type: Object,
    default: () => ({ username: '', email: '', profile_image: '' })
  }
})

watch(
  () => props.user,
  (val) => {
    console.log('👤 Viewed user in modal:', val)
  },
  { deep: true, immediate: true }
)

function onImageError() {
  console.log('❌ Modal avatar failed:', props.user.profile_image)
}

function onImageLoad() {
  console.log('✅ Modal avatar loaded:', props.user.profile_image)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full">
      <div class="flex gap-4 items-center">
        <img
          :src="props.user.profile_image
            ? `/uploads/${props.user.profile_image}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.username)}&background=4f46e5&color=fff`"
          class="w-20 h-20 rounded-full object-cover border"
          alt="User Avatar"
          @error="onImageError"
          @load="onImageLoad"
        />
        <div>
          <h3 class="text-xl font-bold">{{ props.user.username }}</h3>
          <p class="text-sm text-gray-500">{{ props.user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

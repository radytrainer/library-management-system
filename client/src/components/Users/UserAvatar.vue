<template>
  <div class="relative inline-block">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      :class="['rounded-full object-cover border', sizeClass]"
    />
    <img
      v-else
      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`"
      :alt="name"
      :class="['rounded-full object-cover border', sizeClass]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  name: { type: String, required: true },
  src: { type: String, default: '' },
  size: { type: String, default: 'medium' } // small, medium, large
})

const sizeClass = computed(() => {
  switch (size) {
    case 'small': return 'w-8 h-8'
    case 'large': return 'w-20 h-20'
    default: return 'w-10 h-10'
  }
})
</script>

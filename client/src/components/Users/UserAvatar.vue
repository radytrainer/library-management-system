<template>
  <div class="relative inline-block">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      :class="['rounded-full object-cover border', sizeClass]"
      @error="onImageError"
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
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const props = defineProps({
  name: { type: String, required: true },
  src: { type: String, default: '' },
  size: { type: String, default: 'medium' }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'w-8 h-8';
    case 'large': return 'w-20 h-20';
    default: return 'w-10 h-10';
  }
});

function onImageError() {
  console.log('❌ Avatar image failed to load:', props.src);
  userStore.error = 'Failed to load avatar image';
}
</script>
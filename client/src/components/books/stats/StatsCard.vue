<template>
  <div class="bg-indigo-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-indigo-100 shadow-md p-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-3xl font-bold text-indigo-700">{{ value }}</div>
        <div class="text-sm text-indigo-500">{{ label }}</div>
      </div>
      <div class="text-indigo-500 bg-indigo-100 p-3 rounded-full">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path :d="iconPath" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  iconPath: {
    type: String,
    required: true
  }
})
</script>
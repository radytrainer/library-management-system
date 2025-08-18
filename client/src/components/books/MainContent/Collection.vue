<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <Header 
      @toggle-dropdown="handleDropdownToggle"
      @add-by-form="$emit('add-by-form')"
      @add-by-import="$emit('add-by-import')"
    />
    
    <Filter 
      :categories="categories"
      :languages="languages"
      @update:search="$emit('update:search', $event)"
      @update:category="$emit('update:category', $event)"
      @update:status="$emit('update:status', $event)"
      @update:language="$emit('update:language', $event)"
    />
  </div>
</template>

<script setup>
import Header from './Header.vue';
import Filter from './Filter.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  languages: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  'toggle-dropdown',
  'add-by-form',
  'add-by-import',
  'update:search',
  'update:category',
  'update:status',
  'update:language'
]);

const handleDropdownToggle = (isOpen) => {
  emit('toggle-dropdown', isOpen);
};
</script>
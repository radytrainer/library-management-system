<template>
    <div v-if="showForm" class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="relative top-[110px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-4xl">
            <!-- Form Header -->
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">{{ form.id ? 'Edit Book' : 'Add New Book' }}
                            </h2>
                            <p class="text-sm text-gray-500">{{ form.id ? 'Update book information' : 'Fill in the details below'}}
                            </p>
                        </div>
                    </div>
                    <button @click="closeForm"
                        class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Step Indicator -->
                <div class="flex justify-center mt-4">
                    <div class="flex space-x-2">
                        <div v-for="(step, index) in steps" :key="index" @click="currentStep = index"
                            class="cursor-pointer flex items-center">
                            <div :class="[
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                currentStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                            ]">
                                {{ index + 1 }}
                            </div>
                            <div v-if="index < steps.length - 1" :class="[
                                'w-8 h-1 mx-1',
                                currentStep > index ? 'bg-blue-500' : 'bg-gray-200'
                            ]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Content -->
            <form @submit.prevent="submitForm" class="p-6">
                <!-- Step 1: Basic Information -->
                <div v-show="currentStep === 0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Basic Information
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Title -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Title *
                            </label>
                            <input v-model="form.title" required type="text" class="form-input"
                                placeholder="Enter book title" />
                        </div>
                        <!-- ISBN -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                ISBN
                            </label>
                            <input v-model="form.isbn" type="text" class="form-input" placeholder="978-0-123456-78-9" />
                        </div>
                        <!-- Quantity -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Quantity *
                            </label>
                            <input v-model="form.quantity" required type="number" min="1" class="form-input"
                                placeholder="1" />
                        </div>
                        <!-- Publication Year -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Publication Year
                            </label>
                            <input v-model="form.public_year" type="number" min="1000" max="2024" class="form-input"
                                placeholder="2024" />
                        </div>
                    </div>
                </div>

                <!-- Step 2: Additional Information -->
                <div v-show="currentStep === 1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Additional Information
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Donated By -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Donated By
                            </label>
                            <input v-model="form.donated_by" type="text" class="form-input" placeholder="Donor name" />
                        </div>
                        <!-- Author ID -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Author ID *
                            </label>
                            <select v-model="form.AuthorId" required class="form-input">
                                <option disabled value="">Select Author</option>
                                <option v-for="author in authors" :key="author.id" :value="author.id">
                                    {{ author.name }}
                                </option>
                            </select>
                        </div>
                        <!-- Category ID -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Category ID *
                            </label>
                            <select v-model="form.CategoryId" required class="form-input">
                                <option disabled value="">Select Category</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <!-- Language ID -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                Language ID *
                            </label>
                            <select v-model="form.language_id" required class="form-input">
                                <option disabled value="">Select Language</option>
                                <option v-for="language in languages" :key="language.id" :value="language.id">
                                    {{ language.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Description and Cover -->
                <div v-show="currentStep === 2">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        Description and Cover
                    </h3>

                    <div class="grid grid-cols-1 gap-6">
                        <!-- Description -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Description
                            </label>
                            <textarea v-model="form.description" rows="3" class="form-input resize-none"
                                placeholder="Enter book description..."></textarea>
                        </div>
                        <!-- Cover Image -->
                        <div class="form-group">
                            <label class="form-label">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Cover Image
                            </label>
                            <div class="file-upload-area">
                                <input type="file" @change="handleFile" class="file-input" accept="image/*"
                                    id="cover-image" />
                                <label for="cover-image" class="file-upload-label">
                                    <div class="file-upload-content">
                                        <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="text-sm font-medium text-gray-700">Click to upload cover image</p>
                                    </div>
                                </label>
                            </div>
                            <div v-if="previewImage" class="mt-4">
                                <img :src="previewImage" alt="Preview"
                                    class="w-60 h-60 object-cover rounded-lg border" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button v-if="currentStep > 0" @click="prevStep"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>


                    <div v-else></div>

                    <button v-if="currentStep < steps.length - 1" type="button" @click="nextStep" class="btn-primary">
                        Next
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button v-else type="submit" class="btn-primary">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ form.id ? 'Update Book' : 'Create Book' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    showForm: Boolean,
    form: Object,
    authors: Array,
    categories: Array,
    languages: Array,
    previewImage: String,
})

const emit = defineEmits(['closeForm', 'submitForm', 'handleFile'])

const steps = ['Basic Information', 'Additional Information', 'Description & Cover']
const currentStep = ref(0)

function closeForm() {
    currentStep.value = 0
    emit('closeForm')
}

const submitForm = () => {
  emit('submitForm')
}

function handleFile(event) {
    emit('handleFile', event)
}

function nextStep() {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++
    }
}

function prevStep() {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

// Watch for when the form is shown
watch(() => props.showForm, (newVal) => {
    if (newVal) {
        // Reset to first step when form is opened
        currentStep.value = 0
    }
})
</script>

<style scoped>
.form-group {
    @apply space-y-2;
}

.form-label {
    @apply flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1;
}

.form-input {
    @apply w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400;
}

.form-input:focus {
    @apply shadow-lg;
}

.file-upload-area {
    @apply relative;
}

.file-input {
    @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.file-upload-label {
    @apply block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50;
}

.file-upload-content {
    @apply flex flex-col items-center justify-center text-center;
}

.btn-primary {
    @apply inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}

.btn-secondary {
    @apply px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Import Books</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Excel File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Excel File <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 flex items-center">
              <input
                type="file"
                ref="excelInput"
                accept=".xlsx,.xls"
                @change="handleExcelChange"
                class="hidden"
              />
              <button
                @click="$refs.excelInput.click()"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Choose File
              </button>
              <span class="ml-2 text-sm text-gray-500 truncate max-w-xs">
                {{ excelFile ? excelFile.name : 'No file chosen' }}
              </span>
            </div>
            <p v-if="excelError" class="mt-1 text-sm text-red-500">{{ excelError }}</p>
            <p class="mt-1 text-xs text-gray-500">
              Supported formats: .xlsx (Excel 2007+), .xls (Excel 97-2003)
            </p>
          </div>

          <!-- Cover Images Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cover Images (Optional)
            </label>
            <div class="mt-1 flex items-center">
              <input
                type="file"
                ref="imagesInput"
                accept="image/*"
                multiple
                @change="handleImagesChange"
                class="hidden"
              />
              <button
                @click="$refs.imagesInput.click()"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Choose Images
              </button>
              <span class="ml-2 text-sm text-gray-500">
                {{ coverImages.length }} files selected
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Match filenames with Excel's "cover_image_filename" column
            </p>
          </div>

          <!-- Template Download -->
          <div class="border-t border-gray-200 pt-4">
            <a
              href="/templates/books_import_template.xlsx"
              download
              class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              @click.prevent="downloadTemplate"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Template File
            </a>
            <p class="mt-1 text-xs text-gray-500">
              Use this template to ensure proper formatting
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="closeModal"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              :disabled="isLoading"
            >
              Cancel
            </button>
            <button
              @click="startImport"
              :disabled="!excelFile || isLoading"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Import Books</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
            </button>
          </div>

          <!-- Error Display -->
          <div v-if="importErrors.length > 0" class="mt-4 p-4 bg-red-50 rounded-md">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Import completed with errors
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(error, index) in importErrors" :key="index">
                      <span v-if="error.row" class="font-medium">Row {{ error.row }}:</span>
                      {{ error.message }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Display -->
          <div v-if="importSuccess" class="mt-4 p-4 bg-green-50 rounded-md">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Import successful
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>
                    Successfully imported {{ importedCount }} books.
                    <span v-if="importErrors.length > 0">
                      {{ importErrors.length }} records had errors.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { importBooks } from '@/services/Api/book';
import * as XLSX from 'xlsx';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['close', 'importSuccess']);

const excelFile = ref(null);
const coverImages = ref([]);
const excelError = ref('');
const isLoading = ref(false);
const importErrors = ref([]);
const importSuccess = ref(false);
const importedCount = ref(0);

const closeModal = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  excelFile.value = null;
  coverImages.value = [];
  excelError.value = '';
  isLoading.value = false;
  importErrors.value = [];
  importSuccess.value = false;
  importedCount.value = 0;
};

const handleExcelChange = async (event) => {
  const file = event.target.files[0];
  excelError.value = '';
  
  if (!file) return;

  // Validate file extension
  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    excelError.value = 'Invalid file type. Please upload an Excel file (.xlsx or .xls)';
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    excelError.value = 'File too large. Maximum size is 5MB';
    return;
  }

  // Additional validation by reading file header
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      excelError.value = 'File contains no worksheets';
      return;
    }
    
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: null });
    
    if (jsonData.length === 0) {
      excelError.value = 'Worksheet contains no data';
      return;
    }
    
    excelFile.value = file;
  } catch (error) {
    console.error('Excel validation error:', error);
    excelError.value = 'Invalid Excel file. Please check the file and try again.';
  }
};

const handleImagesChange = (event) => {
  coverImages.value = Array.from(event.target.files);
};

const downloadTemplate = async () => {
  try {
    // Create a simple template workbook
    const templateData = [
      {
        title: 'Book Title',
        isbn: '1234567890',
        quantity: 5,
        donated_by: 'Donor Name',
        public_year: 2023,
        description: 'Book description',
        available: 'TRUE',
        Author: 'Author Name',
        Category: 'Category Name',
        Language: 'Language Name',
        cover_image_filename: 'example.jpg' // Add this column
      }
    ];
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');
    
    // Generate and download the file
    XLSX.writeFile(workbook, 'books_import_template.xlsx');
  } catch (error) {
    console.error('Error generating template:', error);
    Swal.fire({
      icon: 'error',
      title: 'Template Download Failed',
      text: 'Could not generate template file',
    });
  }
};

const startImport = async () => {
  if (!excelFile.value) {
    excelError.value = 'Please select an Excel file';
    return;
  }

  isLoading.value = true;
  importErrors.value = [];
  importSuccess.value = false;

  try {
    const formData = new FormData();
    formData.append('excelFile', excelFile.value);
    
    // Append each image file individually
    coverImages.value.forEach(img => {
      formData.append('cover_images[]', img);
    });

    const response = await importBooks(formData);

    if (response.data.success) {
      importedCount.value = response.data.importedCount;
      importSuccess.value = true;
      
      if (response.data.errors?.length) {
        importErrors.value = response.data.errors.map(err => ({
          row: err.row,
          message: err.error
        }));
      }

      emit('importSuccess');
    } else {
      throw new Error(response.data.message || 'Import failed');
    }
  } catch (error) {
    console.error('Import error:', error);
    
    if (error.response?.data?.errors) {
      importErrors.value = error.response.data.errors.map(err => ({
        row: err.row,
        message: err.error || err.message
      }));
    } else {
      importErrors.value = [{
        message: error.response?.data?.message || error.message || 'Unknown error occurred'
      }];
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>  
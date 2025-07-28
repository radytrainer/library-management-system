<template>
  <div>
    <table class="w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2">#</th>
          <th class="border p-2">Username</th>
          <th class="border p-2">Email</th>
          <th class="border p-2">Role</th>
          <th class="border p-2">Barcode</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td class="border p-2">{{ index + 1 }}</td>
          <td class="border p-2">{{ user.username }}</td>
          <td class="border p-2">{{ user.email }}</td>
          <td class="border p-2">{{ user.Role?.name }}</td>
          <!-- ✅ Barcode Column -->
          <td class="border p-2">
            <svg :ref="el => generateBarcode(el, user.id)" class="w-40"></svg>
          </td>
          <td class="border p-2">
            <button class="px-2 py-1 bg-blue-500 text-white rounded" @click="$emit('edit', user)">Edit</button>
            <button class="px-2 py-1 bg-red-500 text-white rounded" @click="$emit('delete', user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'

defineProps({
  users: Array
})

// ✅ Generate barcode for each user
function generateBarcode(el, value) {
  if (el) {
    JsBarcode(el, value, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 40,
      displayValue: true
    })
  }
}

onMounted(async () => {
  await nextTick()
  console.log('✅ Barcodes generated for users')
})
</script>

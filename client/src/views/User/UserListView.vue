<template>
  <div>
    <h3>User Barcode</h3>
    <img v-if="barcodeUrl" :src="barcodeUrl" alt="User Barcode" />
    <p v-else>No barcode available</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const barcodeUrl = ref(null)
router.get('/:id/barcode', [authJwt.verifyToken], userController.getUserBarcode);
  

onMounted(async () => {
  const userId = 1 // replace with actual user ID you want to load barcode for
  await userStore.fetchUserBarcodeImage(userId)
  barcodeUrl.value = userStore.userBarcodeImageUrl
})
</script>

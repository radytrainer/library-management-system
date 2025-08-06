<template>
  <div v-if="user" class="card" ref="cardElement">
    <img :src="logoUrl" alt="Logo" class="logo">
    <h3>{{ systemName }}</h3>
    <img :src="user.profile_image" alt="Profile" class="profile" v-if="user.profile_image">
    <p>Username: {{ user.username }}</p>
    <img :src="user.barcode_image" alt="Barcode" class="barcode" v-if="user.barcode_image">
    <p>User ID: {{ user.id }}</p>
    <button @click="generatePDF" class="print-btn">Download PDF</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import html2pdf from 'html2pdf.js'; // Import html2pdf

const props = defineProps({
  user: Object,
  systemName: String,
  logoUrl: String,
});

const emit = defineEmits(['generated']);

const cardElement = ref(null);
const isReadyToPrint = ref(false);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      console.log('User data received:', newUser);
      generateCard();
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log('UserCard mounted');
});

function generateCard() {
  if (props.user) {
    generateBarcode();
    emit('generated');
    checkImageLoad();
  }
}

function generateBarcode() {
  console.log('Generating barcode with image:', props.user.barcode_image);
}

function checkImageLoad() {
  if (!props.user.profile_image && !props.user.barcode_image) {
    isReadyToPrint.value = true;
    return;
  }

  const images = [];
  if (props.user.profile_image) images.push(new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = props.user.profile_image;
  }));
  if (props.user.barcode_image) images.push(new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = props.user.barcode_image;
  }));

  Promise.all(images).then(() => {
    console.log('All images loaded');
    isReadyToPrint.value = true;
  }).catch((err) => {
    console.error('Image load error:', err);
    isReadyToPrint.value = true;
  });
}

function generatePDF() {
  if (cardElement.value && isReadyToPrint.value) {
    console.log('Generating PDF for card');
    const element = cardElement.value;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10], // [top, right, bottom, left] in mm
        filename: `user_card_${props.user.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, // Higher scale for better quality
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
      .then(() => {
        console.log('PDF generated and downloaded');
      })
      .catch((error) => {
        console.error('PDF generation error:', error);
      });
  } else {
    console.log('Card not ready for PDF, isReadyToPrint:', isReadyToPrint.value, 'cardElement:', cardElement.value);
  }
}

defineExpose({
  generateCard,
  generatePDF, // Expose generatePDF instead of printCard
});
</script>

<style scoped>
.card { border: 1px solid #ccc; padding: 20px; width: 300px; text-align: center; }
.logo, .profile, .barcode { margin: 10px 0; max-width: 100%; height: auto; }
.print-btn { margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
.print-btn:hover { background-color: #45a049; }
</style>
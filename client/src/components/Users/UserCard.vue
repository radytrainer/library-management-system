<template>
  <div v-if="user" class="card" ref="cardElement">
    <div class="header">
      <img :src="logoUrl" alt="Logo" class="logo  " v-if="logoUrl" >
      <h3 class="system-name">{{ systemName }}</h3>
    </div>
    <div class="content">
      <img :src="user.profile_image" alt="Profile" class="profile" v-if="user.profile_image">
      <p class="username">Name: {{ user.username }}</p>
      <img :src="user.barcode_image" alt="Barcode" class="barcode" v-if="user.barcode_image">
      <p class="user-id">User ID: {{ user.id }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  user: Object,
  systemName: String,

});
const logoUrl = ref("../../public/logo.png");

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
  if (!props.user.profile_image && !props.user.barcode_image && !props.logoUrl) {
    isReadyToPrint.value = true;
    return;
  }

  const images = [];
  if (props.user.profile_image) images.push(new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = () => { console.error('Profile image failed to load:', props.user.profile_image); resolve(); };
    img.src = props.user.profile_image;
  }));
  if (props.user.barcode_image) images.push(new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = () => { console.error('Barcode image failed to load:', props.user.barcode_image); resolve(); };
    img.src = props.user.barcode_image;
  }));
  if (props.logoUrl) images.push(new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = () => { console.error('Logo image failed to load:', props.logoUrl); resolve(); };
    img.src = props.logoUrl;
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
        margin: [15, 15, 15, 15],
        filename: `user_card_${props.user.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: true,
        },
        jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
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
  generatePDF,
});
</script>

<style scoped>
.card {
  border: 2px solid #333;
  padding: 20px;
  width: 300px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.header {
  margin-bottom: 15px;
}

.logo {
  max-width: 100px;
  height: auto;
  margin-bottom: 10px;
  margin-left: 80px;
}

.system-name {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.content {
  margin-bottom: 15px;
}

.profile, .barcode {
  max-width: 150px;
  height: auto;
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.username, .user-id {
  font-size: 16px;
  color: #34495e;
  margin: 5px 0;
  font-weight: 500;
}
</style>
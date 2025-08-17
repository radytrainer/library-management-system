<template>
  <div v-if="user" class="flex items-center justify-center bg-white" ref="cardElement">
    <div class="border border-[#48e3ff] p-[6px] w-[80px] text-center bg-white shadow-[0_2px_4px_rgba(44,244,237,0.1)]">
      
      <!-- Header with logo and system name -->
      <div class="flex items-center justify-start gap-[4px] mb-[4px]">
        <img :src="logoUrl" alt="Logo" class="h-[12px] w-auto" v-if="logoUrl" />
        <h3 class="text-[6px] mt-[-8px] font-bold text-[#2c3e50] leading-none">{{ systemName }}</h3>
      </div>

      <!-- Main content: profile, username, QR code, ID -->
      <div class="flex flex-col justify-center items-center mt-[6px]">
        <img
          :src="user.profile_image"
          alt="Profile"
          class="w-[30px] h-[30px] rounded-full border-[1px] border-[lightblue] object-cover overflow-hidden shadow-[0_0_4px_rgba(173,216,230,0.6)]"
          v-if="user.profile_image"
        />
        <p class="text-[8px] text-[#34495e] font-medium mb-[6px]">{{ user.username }}</p>

        <img
          :src="user.qr_code_image"
          alt="QR Code"
          class="max-w-[60px] h-auto"
          v-if="user.qr_code_image"
        />
        <p class="text-[6px] text-[#444f5a]">ID: {{ user.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import html2pdf from 'html2pdf.js';

const logoUrl = ref('../../public/logo.png');

const props = defineProps({
  user: Object,
  systemName: String,
});

const emit = defineEmits(['generated']);
const cardElement = ref(null);
const isReadyToPrint = ref(false);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
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
    emit('generated');
    checkImageLoad();
  }
}

function checkImageLoad() {
  const images = [];

  if (props.user.profile_image)
    images.push(loadImage(props.user.profile_image));

  if (props.user.qr_code_image) // Updated to check qr_code_image
    images.push(loadImage(props.user.qr_code_image));

  if (logoUrl.value)
    images.push(loadImage(logoUrl.value));

  Promise.all(images)
    .then(() => {
      isReadyToPrint.value = true;
    })
    .catch(() => {
      isReadyToPrint.value = true;
    });
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

function generatePDF() {
  if (cardElement.value && isReadyToPrint.value) {
    const element = cardElement.value;

    html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: `user_card_${props.user.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 4, // sharper image rendering
          useCORS: true,
        },
        jsPDF: { unit: 'mm', format: [86, 54], orientation: 'portrait' },
      })
      .from(element)
      .save();
  }
}

defineExpose({
  generateCard,
  generatePDF,
});
</script>
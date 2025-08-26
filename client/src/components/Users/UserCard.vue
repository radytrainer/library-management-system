<template>
  <div v-if="user" ref="cardElement" class="flex items-center justify-center" style="margin: 0; padding: 0;">
    <div
      class="border border-[#00aaff] p-[8px] w-[200px] h-[300px] text-center bg-white shadow-[0_4px_8px_rgba(0,170,255,0.2)]">

      <!-- Logo and Title in the same row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[6px]">
          <img :src="logoUrl" alt="Logo" class="h-[32px] w-auto mt-3" v-if="logoUrl" />
        </div>
        <h3 class="text-[14px] font-bold text-[#2c3e50] leading-tight flex-grow text-center -ml-[20px]">
          PNC LIBRARY
        </h3>
      </div>

      <div class="flex flex-col items-center mt-[10px]">
        <img :src="user.profile_image" alt="Profile"
          class="w-[90px] h-[90px] rounded-full border-2 border-[#00aaff] object-cover overflow-hidden shadow-[0_0_8px_rgba(173,216,230,0.6)]"
          v-if="user.profile_image" />
        <p class="text-[16px] text-[#34495e] font-semibold mt-[10px]">{{ user.username }}</p>
        <img :src="user.barcode_image" alt="Barcode" class="max-w-[100px] h-auto mt-[10px]" v-if="user.barcode_image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import html2canvas from 'html2canvas';

const logoUrl = ref('../../public/logo.png');

const props = defineProps({
  user: Object,
  systemName: String,
});

const emit = defineEmits(['generated']);
const cardElement = ref(null);
const isReadyToPrint = ref(false);
const isGenerating = ref(false); // ✅ prevent multiple downloads

onMounted(() => {
  console.log('UserCard mounted');
});

function generateCard() {
  if (props.user && !isGenerating.value) {
    isGenerating.value = true; // lock
    emit('generated');
    checkImageLoad();
  }
}

function checkImageLoad() {
  const images = [];

  if (props.user.profile_image)
    images.push(loadImage(props.user.profile_image));

  if (props.user.barcode_image)
    images.push(loadImage(props.user.barcode_image));

  if (logoUrl.value)
    images.push(loadImage(logoUrl.value));

  Promise.all(images)
    .then(() => {
      isReadyToPrint.value = true;
      generateImage();
      isGenerating.value = false; // unlock
    })
    .catch((error) => {
      console.error('Image loading error:', error);
      isReadyToPrint.value = true;
      isGenerating.value = false; // unlock even on error
    });
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = resolve;
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

function generateImage() {
  if (cardElement.value && isReadyToPrint.value) {
    const element = cardElement.value.querySelector('div.border');
    if (element) {
      html2canvas(element, {
        scale: 12,
        useCORS: true,
        backgroundColor: null,
        width: element.offsetWidth,
        height: element.offsetHeight,
        dpi: 600,
        letterRendering: true,
        allowTaint: true,
        logging: true,
      }).then((canvas) => {
        if (canvas.width === 0 || canvas.height === 0) {
          console.error('Canvas is empty! Check element visibility or image loading.');
          return;
        }
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1.0);
        link.download = `user_card_${props.user.id}_highres.png`;
        link.click();
      }).catch((error) => {
        console.error('html2canvas error:', error);
      });
    } else {
      console.error('Element not found!');
    }
  }
}

defineExpose({
  generateCard,
  generateImage,
});
</script>

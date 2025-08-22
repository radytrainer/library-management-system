<template>
  <div class="fixed inset-0 w-screen h-screen">
    <img 
      src="/image.png" 
      alt="Background" 
      class="w-full h-full object-cover" 
    />
    <!-- Dark overlay (optional) -->
    <!-- <div class="absolute inset-0 bg-black bg-opacity-50"></div> -->

    <!-- Content (centered) -->
    <!-- <div class="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
      <h1 class="text-4xl font-bold">Welcome</h1>
    </div> -->
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>

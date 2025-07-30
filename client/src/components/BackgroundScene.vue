<template>
  <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div class="scene-3d">
      <div class="library-scene">
        <!-- Floating Books -->
        <div class="floating-book book-1"></div>
        <div class="floating-book book-2"></div>
        <div class="floating-book book-3"></div>
        <div class="floating-book book-4"></div>

        <!-- Book Shelves -->
        <div class="bookshelf shelf-1">
          <div class="shelf-board"></div>
          <div class="shelf-book sb-1"></div>
          <div class="shelf-book sb-2"></div>
          <div class="shelf-book sb-3"></div>
        </div>

        <div class="bookshelf shelf-2">
          <div class="shelf-board"></div>
          <div class="shelf-book sb-4"></div>
          <div class="shelf-book sb-5"></div>
          <div class="shelf-book sb-6"></div>
        </div>

        <!-- Floating Particles -->
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
    </div>
    <div class="absolute inset-0 bg-black bg-opacity-30 z-5"></div>
  </div>
</template>

<style scoped>
/* Keep all your 3D and animation CSS here */
/* Use your existing floating-book, bookshelf, particle, animations */
/* 3D Scene Setup */
.scene-3d {
  perspective: 1500px;
  perspective-origin: center center;
  width: 100%;
  height: 100%;
}

.library-scene {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: sceneRotate 60s linear infinite;
}

@keyframes sceneRotate {
  0% { transform: rotateY(0deg) rotateX(0deg); }
  25% { transform: rotateY(90deg) rotateX(5deg); }
  50% { transform: rotateY(180deg) rotateX(0deg); }
  75% { transform: rotateY(270deg) rotateX(-5deg); }
  100% { transform: rotateY(360deg) rotateX(0deg); }
}

/* Floating Books */
.floating-book {
  position: absolute;
  width: 40px;
  height: 30px;
  border-radius: 3px;
  transform-style: preserve-3d;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  will-change: transform;
}

.floating-book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  transform: translateZ(-8px);
  filter: brightness(0.7);
  border-radius: inherit;
}

.floating-book::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: inherit;
  transform: rotateY(90deg) translateZ(4px);
  transform-origin: right;
  filter: brightness(0.8);
  border-radius: 0 3px 3px 0;
}

.book-1 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  top: 10vh;
  left: 10vw;
  transform: translateZ(100px) rotateZ(15deg);
  animation: floatBook1 8s ease-in-out infinite;
}

.book-2 {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  top: 20vh;
  right: 15vw;
  transform: translateZ(80px) rotateZ(-20deg);
  animation: floatBook2 10s ease-in-out infinite 1s;
}

.book-3 {
  background: linear-gradient(135deg, #16a34a, #15803d);
  top: 60vh;
  left: 5vw;
  transform: translateZ(120px) rotateZ(25deg);
  animation: floatBook3 7s ease-in-out infinite 2s;
}

.book-4 {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  top: 70vh;
  right: 10vw;
  transform: translateZ(90px) rotateZ(-15deg);
  animation: floatBook4 9s ease-in-out infinite 3s;
}

/* Book Shelves */
.bookshelf {
  position: absolute;
  transform-style: preserve-3d;
}

.shelf-1 {
  top: 30vh;
  left: -10vw;
  transform: translateZ(50px) rotateY(45deg);
}

.shelf-2 {
  top: 60vh;
  right: -10vw;
  transform: translateZ(40px) rotateY(-45deg);
}

.shelf-board {
  width: 150px;
  height: 15px;
  background: linear-gradient(135deg, #8b4513, #654321);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.shelf-book {
  position: absolute;
  width: 20px;
  height: 30px;
  border-radius: 2px;
  top: -30px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.sb-1 { left: 10px; background: #ef4444; }
.sb-2 { left: 35px; background: #3b82f6; }
.sb-3 { left: 60px; background: #16a34a; }
.sb-4 { left: 10px; background: #eab308; }
.sb-5 { left: 35px; background: #8b5cf6; }
.sb-6 { left: 60px; background: #f97316; }

/* Floating Particles */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  transform-style: preserve-3d;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
  will-change: transform, opacity;
}

.particle-1 { top: 15vh; left: 20vw; transform: translateZ(150px); animation: particleFloat1 5s ease-in-out infinite; }
.particle-2 { top: 25vh; right: 25vw; transform: translateZ(140px); animation: particleFloat2 6s ease-in-out infinite 1s; }
.particle-3 { top: 45vh; left: 15vw; transform: translateZ(160px); animation: particleFloat3 4s ease-in-out infinite 2s; }
.particle-4 { top: 65vh; right: 20vw; transform: translateZ(130px); animation: particleFloat4 7s ease-in-out infinite 3s; }

/* Knowledge Symbols */
.knowledge-symbol {
  position: absolute;
  width: 24px;
  height: 24px;
  transform-style: preserve-3d;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
  will-change: transform;
}

.symbol-1 { top: 20vh; left: 30vw; transform: translateZ(200px); animation: symbolFloat1 6s ease-in-out infinite; }
.symbol-2 { top: 40vh; right: 35vw; transform: translateZ(180px); animation: symbolFloat2 7s ease-in-out infinite 1s; }
.symbol-3 { top: 60vh; left: 25vw; transform: translateZ(190px); animation: symbolFloat3 5s ease-in-out infinite 2s; }

/* Animations */
@keyframes floatBook1 {
  0%, 100% { transform: translateZ(100px) rotateZ(15deg) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(100px) rotateZ(15deg) translateY(-20px) rotateX(10deg); }
}

@keyframes floatBook2 {
  0%, 100% { transform: translateZ(80px) rotateZ(-20deg) translateY(0px) rotateY(0deg); }
  50% { transform: translateZ(80px) rotateZ(-20deg) translateY(-15px) rotateY(15deg); }
}

@keyframes floatBook3 {
  0%, 100% { transform: translateZ(120px) rotateZ(25deg) translateY(0px) rotateZ(25deg); }
  50% { transform: translateZ(120px) rotateZ(25deg) translateY(-25px) rotateZ(40deg); }
}

@keyframes floatBook4 {
  0%, 100% { transform: translateZ(90px) rotateZ(-15deg) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(90px) rotateZ(-15deg) translateY(-18px) rotateX(-10deg); }
}

@keyframes particleFloat1 {
  0%, 100% { transform: translateZ(150px) translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateZ(150px) translateY(-30px) scale(1.2); opacity: 1; }
}

@keyframes particleFloat2 {
  0%, 100% { transform: translateZ(140px) translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateZ(140px) translateY(-25px) scale(1.3); opacity: 1; }
}

@keyframes particleFloat3 {
  0%, 100% { transform: translateZ(160px) translateY(0px) scale(1); opacity: 0.9; }
  50% { transform: translateZ(160px) translateY(-35px) scale(1.1); opacity: 1; }
}

@keyframes particleFloat4 {
  0%, 100% { transform: translateZ(130px) translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateZ(130px) translateY(-20px) scale(1.4); opacity: 1; }
}

@keyframes symbolFloat1 {
  0%, 100% { transform: translateZ(200px) translateY(0px) rotateZ(0deg) scale(1); }
  50% { transform: translateZ(200px) translateY(-15px) rotateZ(10deg) scale(1.1); }
}

@keyframes symbolFloat2 {
  0%, 100% { transform: translateZ(180px) translateY(0px) scale(1) rotateY(0deg); }
  50% { transform: translateZ(180px) translateY(-12px) scale(1.15) rotateY(15deg); }
}

@keyframes symbolFloat3 {
  0%, 100% { transform: translateZ(190px) translateY(0px) rotateX(0deg); }
  50% { transform: translateZ(190px) translateY(-18px) rotateX(10deg); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .floating-book {
    width: 30px;
    height: 20px;
  }
  .shelf-board {
    width: 120px;
    height: 12px;
  }
  .shelf-book {
    width: 15px;
    height: 25px;
    top: -25px;
  }
  .knowledge-symbol {
    width: 20px;
    height: 20px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .floating-book, .particle, .knowledge-symbol, .library-scene {
    animation: none !important;
    transform: none !important;
  }
}
</style>

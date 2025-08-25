import './assets/tailwind.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useUserStore } from './stores/userStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize store state from localStorage
const userStore = useUserStore();
if (localStorage.getItem('token') && localStorage.getItem('user')) {
  userStore.setToken(localStorage.getItem('token'));
  userStore.setUser(JSON.parse(localStorage.getItem('user')));
}

app.mount('#app');
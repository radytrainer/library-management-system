import "./assets/tailwind.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import { createI18n } from "vue-i18n"
import { useUserStore } from "@/stores/userStore"
// Import translations
import en from "./locales/en/en.json"
import km from "./locales/km/km.json"

const app = createApp(App)
const pinia = createPinia()

// Detect saved language or browser preference
const savedLanguage = localStorage.getItem("language")
const browserLanguage = navigator.language.split("-")[0]
const defaultLocale = savedLanguage || (browserLanguage === "km" ? "km" : "en")

// Setup i18n
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: "en",
  messages: { en, km },
  missing: (locale, key) => {
    console.warn(`Missing translation for "${key}" in "${locale}"`)
    return key // fallback to key
  },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})

// Helper to switch language dynamically
const updateLocale = (newLocale) => {
  if (i18n.global.availableLocales.includes(newLocale)) {
    i18n.global.locale.value = newLocale
    localStorage.setItem("language", newLocale)
    document.documentElement.lang = newLocale
    window.dispatchEvent(new CustomEvent("language-changed", { detail: newLocale }))
  }
}

app.config.globalProperties.$updateLocale = updateLocale

// Apply plugins
app.use(pinia)
app.use(router)
app.use(i18n)

// Set HTML lang attribute
document.documentElement.lang = defaultLocale

// Mount app
app.mount("#app")

// Initialize Pinia store (restore session)
setTimeout(() => {
  const userStore = useUserStore()
  userStore.initializeFromStorage()
}, 0)

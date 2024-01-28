import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import i18nInstance from './locales'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18nInstance)
app.mount('#app')

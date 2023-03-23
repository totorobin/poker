import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import i18nInstance from '@/locales'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18nInstance)

app.mount('#app')

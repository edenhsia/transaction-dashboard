import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import router from './router'

import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue, components',
      },
    },
  },
})
app.use(ToastService)
app.use(router)
app.mount('#app')

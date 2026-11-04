import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

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
app.use(ConfirmationService)
app.use(router)
app.use(VueQueryPlugin)

async function bootstrap() {
  const { worker } = await import('@/mocks/browser')

  await worker.start({
    onUnhandledFrame: 'bypass',
  })

  app.mount('#app')
}

bootstrap()

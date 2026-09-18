import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify plugin + theme registration land here in Phase 3.
const app = createApp(App)

app.use(router)

app.mount('#app')

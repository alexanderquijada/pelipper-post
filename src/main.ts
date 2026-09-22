import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Explicit imports — neither of these is pulled in automatically.
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Components are auto-imported by vite-plugin-vuetify (see vite.config.ts), so
// there is no eager `import * as components` here — that is the tree-shaking.
import { createVuetify } from 'vuetify'

// Palette from BRIEF.md §6. These theme values are the SINGLE SOURCE OF TRUTH
// for colour — do not re-declare any of these hexes in component CSS.
const pelipperDark = {
  dark: true,
  colors: {
    background: '#0E1621',
    surface: '#16202E',
    primary: '#4FA3D1',
    secondary: '#7FD1E8',
    accent: '#F2A65A',
    success: '#5FBF8F',
    error: '#E8705A',
    'on-background': '#E6EDF3',
    'on-surface': '#E6EDF3',
    // custom token -> gives us text-muted / bg-muted utility classes
    muted: '#8FA3B8',
  },
}

const pelipperLight = {
  dark: false,
  colors: {
    // Sky blue, and the fallback beneath the gradient in App.vue.
    background: '#DCEAF7',
    surface: '#FFFFFF',
    primary: '#2E6E92',
    secondary: '#4FA3D1',
    accent: '#E08A3C',
    success: '#3E9E70',
    error: '#D1523C',
    'on-background': '#16202E',
    'on-surface': '#16202E',
    // Darkened from #5C7186: the tagline and footer sit on the SKY, not a card,
    // where the old value measured 3.87:1 — under the 4.5:1 text floor.
    muted: '#4E6174',
  },
}

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'pelipperLight',
    themes: { pelipperDark, pelipperLight },
  },
  defaults: {
    VCard: {
      // No `rounded` default: Vuetify's rounded-* utilities carry !important and
      // would beat the 12px radius BRIEF.md §4 specifies. Radius, border and
      // shadow are all set in App.vue's global card rule instead.
      elevation: 0,
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: true,
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')

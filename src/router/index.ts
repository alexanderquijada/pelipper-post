import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// One route, on purpose. Vue Router is here because the capstone asks for it;
// the dashboard is a single page. Do not add pages. See CLAUDE.md rule 6.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router

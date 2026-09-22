import { createRouter, createWebHistory } from 'vue-router'

/**
 * Six routes. Every route component is lazy-loaded — route-level code splitting
 * keeps a page the user hasn't visited out of the initial bundle.
 * See CLAUDE.md rule 6.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: () => import('../views/OverviewView.vue') },
    { path: '/trends', name: 'trends', component: () => import('../views/TrendsView.vue') },
    { path: '/signals', name: 'signals', component: () => import('../views/SignalsView.vue') },
    { path: '/cargo', name: 'cargo', component: () => import('../views/CargoView.vue') },
    { path: '/network', name: 'network', component: () => import('../views/NetworkView.vue') },
    { path: '/couriers', name: 'couriers', component: () => import('../views/CouriersView.vue') },
    // Anything else goes home rather than showing a dead screen.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

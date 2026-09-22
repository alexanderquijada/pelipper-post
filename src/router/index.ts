import { createRouter, createWebHistory } from 'vue-router'

/**
 * Six routes, every component lazy-loaded — route-level code splitting keeps a
 * page the user hasn't visited out of the initial bundle. See CLAUDE.md rule 6.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: () => import('../views/OverviewView.vue') },
    { path: '/trends', name: 'trends', component: () => import('../views/TrendsView.vue') },
    { path: '/exceptions', name: 'exceptions', component: () => import('../views/ExceptionsView.vue') },
    { path: '/cargo', name: 'cargo', component: () => import('../views/CargoView.vue') },
    { path: '/regions', name: 'regions', component: () => import('../views/RegionsView.vue') },
    { path: '/couriers', name: 'couriers', component: () => import('../views/CouriersView.vue') },

    // Renamed 2026-09-22. Kept so existing links and bookmarks don't break.
    { path: '/signals', redirect: '/exceptions' },
    { path: '/network', redirect: '/regions' },

    // Anything else goes home rather than showing a dead screen.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

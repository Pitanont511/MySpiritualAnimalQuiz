import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Intro',
    component: () => import('../pages/Intro.vue'),
    meta: { backgroundKey: 'intro' },
  },
  {
    path: '/question/:index',
    name: 'Question',
    component: () => import('../pages/Question.vue'),
    meta: { backgroundKey: 'question' },
  },
  {
    path: '/transition/:index',
    name: 'Transition',
    component: () => import('../pages/Transition.vue'),
    meta: { backgroundKey: 'transition' },
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../pages/Result.vue'),
    meta: { backgroundKey: 'result' },
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('../pages/Download.vue'),
    meta: { backgroundKey: 'download' },
  },
  {
    path: '/brand',
    name: 'Brand',
    component: () => import('../pages/Brand.vue'),
    meta: { backgroundKey: 'brand' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
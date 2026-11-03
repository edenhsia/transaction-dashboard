import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/BaseLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: '數據總覽' },
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/views/TransactionsView.vue'),
          meta: { title: '交易查詢' },
        },
        {
          path: 'transactions/:id',
          name: 'transaction-detail',
          component: () => import('@/views/TransactionDetailView.vue'),
          meta: {
            title: '交易明細',
          },
        },
        {
          path: '/devices',
          name: 'devices',
          component: () => import('@/views/DevicesView.vue'),
          meta: { title: '設備管理' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/transactions',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach(function (to) {
  document.title = `${String(to.meta.title ?? 'Dashboard')} | Transaction Dashboard`
})

export default router

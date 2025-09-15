import MainLayout from '@/layouts/MainLayout.vue'
import AlarmPage from '@/views/main/AlarmPage.vue'
import DataHistoryPage from '@/views/main/DataHistoryPage.vue'
import ParameterPage from '@/views/main/ParameterPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'parameter',
        component: ParameterPage,
        meta: { title: 'Parameter' },
      },
      {
        path: '/datahistory',
        name: 'datahistory',
        component: DataHistoryPage,
        meta: { title: 'Data History' },
      },
      {
        path: '/alarm',
        name: 'alarm',
        component: AlarmPage,
        meta: { title: 'Alarm' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

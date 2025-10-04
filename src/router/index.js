import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import ManageUserPage from '@/views/account/ManageUserPage.vue'
import Login from '@/views/auth/Login.vue'
import AlarmPage from '@/views/main/AlarmPage.vue'
import DataHistoryPage from '@/views/main/DataHistoryPage.vue'
import ParameterPageMatoa from '@/views/main/ParameterPageMatoa.vue'
import ParameterPageKmt from '@/views/main/ParameterPageKmt.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { name } from 'dayjs/locale/id'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'parameter-matoa',
        name: 'parameter-matoa',
        component: ParameterPageMatoa,
        meta: { title: 'Parameter' },
      },
      {
        path: 'parameter-kmt',
        name: 'parameter-kmt',
        component: ParameterPageKmt,
        meta: { title: 'Parameter KMT'},
      },
      {
        path: 'datahistory',
        name: 'datahistory',
        component: DataHistoryPage,
        meta: { title: 'Data History' },
      },
      {
        path: 'alarm',
        name: 'alarm',
        component: AlarmPage,
        meta: { title: 'Alarm' },
      },
    ],
  },
  {
    path: '/setting',
    component: MainLayout,
    children: [
      {
        path: 'manageuser',
        name: 'manageuser',
        component: ManageUserPage,
        meta: { title: 'Manage User' },
      },
    ],
  },
  {
    path: '/auth/login',
    component: Login,
    name: 'login',
    meta: { title: 'Login' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

//auth guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (!auth.user) {
    auth.loadUserFromStorage()
  }

  if (to.name !== 'login' && !auth.user) {
    next({ name: 'login' })
  } else if (to.path === '/') {
    next({ name: 'parameter-matoa' })
  } else {
    next()
  }
})

export default router

import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import ManageUserPage from '@/views/account/ManageUserPage.vue'
import Login from '@/views/auth/Login.vue'
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
  } else {
    next()
  }
})

export default router

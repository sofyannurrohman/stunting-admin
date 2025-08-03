import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // or however you store the auth token/state

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Posyandu',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Posyandu Dashboard',
        requiresAuth: true
      },
    },
    {
      path: '/toddlers',
      name: 'Toddler Dashboard',
      component: () => import('../views/Toddler/Dashboard.vue'),
      meta: {
        title: 'Balita Dashboard',
        requiresAuth: true
      },
    },
    {
      path: '/users',
      name: 'User Dashboard',
      component: () => import('../views/User/Dashboard.vue'),
      meta: {
        title: 'User Dashboard',
        requiresAuth: true
      },
    },
    {
      path: '/informations',
      name: 'Information Dashboard',
      component: () => import('../views/Information/Dashboard.vue'),
      meta: {
        title: 'Information Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/child-profiles',
      name: 'Child Profile Dashboard',
      component: () => import('../views/ChildProfile/Dashboard.vue'),
      meta: {
        title: 'ChildProfile Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})


router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Posyandu Balita`
  const auth = useAuthStore() // could also check localStorage/sessionStorage directly

  const isAuthenticated = !!auth.token // or however you check auth

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' }) // redirect to login page
  } else {
    next()
  }
})
export default router

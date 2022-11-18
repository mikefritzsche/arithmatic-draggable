import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
    },
    {
        path: '/cf-formula-builder/complex',
        name: 'cf-form-builder-complex',
        component: () => import(/* webpackChunkName: "form-builder-complex" */ '../views/CFComplexView.vue')
    },
    {
        path: '/cf-formula-builder/simple',
        name: 'cf-form-builder-simple',
        component: () => import(/* webpackChunkName: "form-builder-simple" */ '../views/CFSimpleView.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

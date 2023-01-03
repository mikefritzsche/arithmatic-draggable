import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/tree-data',
        name: 'tree-data',
        component: () => import(/* webpackChunkName: "home" */ '../views/TreeDataView.vue')
    },
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
    {
        path: '/cf-formula-builder/nested',
        name: 'cf-form-builder-nested',
        component: () => import(/* webpackChunkName: "form-builder-complex" */ '../views/NestedBuilderView.vue')
    },
    {
        path: '/cf-formula-builder/nested-simple',
        name: 'cf-form-builder-nested-simple',
        component: () => import(/* webpackChunkName: "form-builder-nested-simple" */ '../views/NestedSimpleView.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

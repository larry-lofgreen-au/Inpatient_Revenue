import { createRouter, createWebHistory } from 'vue-router'
import Search from '../views/Search.vue'
import SearchCM from '../views/SearchCM.vue'
import AttachCM from '../views/AttachCM.vue'
import LC from '../views/LC.vue'
import GetHelp from '../views/GetHelp.vue'
import Settings from '../views/Settings.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: LC
        },
        {
            path: '/search_lc',
            component: Search
        },
        {
            path: '/search_cm',
            component: SearchCM
        },
        {
            path: '/attach_cm',
            component: AttachCM
        },
        {
            path: '/lc',
            component: LC
        },
        {
            path: '/help',
            component: GetHelp
        },
        {
            path: '/settings',
            component: Settings
        }
    ]
})

export default router

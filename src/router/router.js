import { createRouter, createWebHistory } from 'vue-router'
import AttachCM from '../views/AttachCM.vue'
import GetHelp from '../views/GetHelp.vue'
import LC_Entry from '../views/LC_Entry.vue'
import LC_Mismatched_CM from '../views/LC_mismatched_CM.vue'
import LC_No_CM from '../views/LC_no_CM.vue'



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: LC_Entry
        },
        {
            path: '/lc_mismatched_cm',
            component: LC_Mismatched_CM
        },
        {
            path: '/lc_no_cm',
            component: LC_No_CM
        },
        {
            path: '/attach_cm',
            component: AttachCM
        },
        {
            path: '/lc_entry',
            component: LC_Entry
        },
        {
            path: '/help',
            component: GetHelp
        }
    ]
})

export default router

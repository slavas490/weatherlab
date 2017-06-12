import Vue from 'vue'
import Router from 'vue-router'

import home from '@/pages/home'
import faq from '@/pages/faq'
import terms from '@/pages/terms'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: home
        },
        {
            path: '/faq',
            component: faq
        },
        {
            path: '/terms',
            component: terms
        }
    ],
    mode: 'history'
})

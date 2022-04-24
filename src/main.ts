import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
// import Instruction from './components/Instruction.vue'
// import Menu from './components/Menu.vue'
// import GameHUD from './components/GameHUD.vue'
import Game from './components/Game.vue'

import './assets/style.css';

const routes: VueRouter.RouteRecordRaw[] = [
    // { path: '/menu', component: Menu },
    // { path: '/instruction', component: Instruction },
    { path: '/', component: Game },
    // { path: '/play', component: GameHUD },
    // { path: '/:catchAll(.*)', redirect: 'menu' }
]


const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})


const app = createApp(App)
app.use(router)
app.mount('#app')
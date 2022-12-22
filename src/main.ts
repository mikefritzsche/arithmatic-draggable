import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'tachyons/css/tachyons.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss'

const pinia = createPinia()

createApp(App).use(pinia).use(ElementPlus).use(store).use(router).mount('#app')

import { createApp } from 'vue';
import store from './store'
import 'remixicon/fonts/remixicon.css';
import './index.css';
import Toast  from 'vue-toastification'
import {options} from './notifications/toast.js'
import App from './App.vue';
import router from './router';

createApp(App).use(router).use(store).use(Toast,options).mount('#app')

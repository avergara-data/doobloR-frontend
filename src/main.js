import { createApp } from 'vue';
import store from './store'
import 'remixicon/fonts/remixicon.css';
import './index.css';
import Toast  from 'vue-toastification'
import {options} from './notifications/toast.js'
import App from './App.vue';
import router from './router';
import VueApexCharts from 'vue3-apexcharts';

createApp(App).use(router).use(store).use(Toast,options).use(VueApexCharts).mount('#app')

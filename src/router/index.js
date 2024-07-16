import { createRouter, createWebHistory } from 'vue-router';
import Public from '../views/public/public.vue'
import Private from '../views/private/private.vue';
import { PublicRoutes } from '../views/public/router';
import { PrivateRoutes } from '../views/private/router';


const routes = [
  {
    path: '',
    name: 'private',
    component: Private,
    children: PrivateRoutes,
    props: true,
    // meta: {
    //     // requiresAuth: true
    // }
  },
  {
    path: '/public',
    name: 'public',
    component: Public,
    children: PublicRoutes,
    meta: {
      requiresAuth: false
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
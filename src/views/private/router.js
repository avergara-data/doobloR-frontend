const home = ()=>import('./views/Home.vue')
const listUsers = ()=>import('./views/ListUsers.vue')
const listStudies = ()=>import('./views/ListStudies.vue')
const reports = ()=>import('./views/Reports.vue')



export const PrivateRoutes = [
    {
        path:'',
        redirect:'/home',
    },
    {
        path: '/home',
        component: home,
        name: 'home',
        meta: {
        title: 'Inicio',
        menu: 'Inicio',
        }
    },
    {
        path: '/users',
        component: listUsers,
        name: 'list-users',
        meta: {
        title: 'Usuarios',
        menu: 'Usuarios',
        }
    },
    {
        path: '/studies',
        component: listStudies,
        name: 'list-studies',
        meta: {
        title: 'Estudios',
        menu: 'Estudios',
        }
    },
    {
        path: '/reports',
        component: reports,
        name: 'reports',
        meta: {
        title: 'Reportes',
        menu: 'Reportes',
        }
    },
]
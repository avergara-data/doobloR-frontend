import axios from "axios"
import BASE_URL from "../../api/api.js"
const state ={
    auth_token: null,
    user: {
        id: null,
        username: null,
        role:{
            id:null,
            name:null
        }
    }
};
const getters = {
    getAuthToken(state){
        return state.auth_token
    },
    getUsername(state){
        if(!state.user.username){
            state.user.username = JSON.parse(localStorage.getItem('user')).username
        }
        return state.user.username
    },
    getUserID(state){
        if(!state.user.id){
            state.user.id = JSON.parse(localStorage.getItem('user')).id
        }
        return state.user.id
    },
    getRolId(state){
        if(!state.user.rol.id){
            state.user.rol.id = JSON.parse(localStorage.getItem('user')).rol.id
        }
        return state.rol.id
    },
    getRolName(state){
    if(!state.user.rol.nombre){
        state.user.rol.nombre = JSON.parse(localStorage.getItem('user')).rol.name
    }
    return state.user.rol.name
    },  
    isLoggedIn(state){
        const loggedOut = state.auth_token === null || state.auth_token == JSON.stringify(null)
        return !loggedOut
    },
    haveToken(){
        const auth_token = localStorage.getItem('auth_token')
        const authTokenExists = auth_token !== 'undefined' && auth_token !== null
        return authTokenExists
    }
}
const actions = {
    registerUser({ commit }, payload){
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_URL}/auth/create-user`, payload)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        });
    },
    loginUser({ commit }, payload){
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_URL}/auth/authenticate-user`, payload)
            .then(response => {
                console.log(response)
                commit('setUserInfo', response)
                resolve(response);
            })
            .catch(error => {
                reject(error)
            })
        });
    },
    logoutUser({ commit }){
        new Promise((resolve, reject) => {
            axios.post(`${BASE_URL}/auth/logout-user`)
            .then(response => {
                commit('resetUserInfo', response)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        });
    }
}
const mutations = {
    setUserInfo(state, data){
        state.user.id = data.data.user.id
        state.user.username = data.data.user.username
        state.auth_token = data.data.user.token
        state.user.role.id = data.data.user.role.id
        state.user.role.name = data.data.user.role.name
        localStorage.setItem('auth_token', data.data.user.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
    },
    resetUserInfo(state, data){
        state.user = {
                id: null,
                username: null,
                role:{
                    id:null,
                    name:null
                }
        }
        state.auth_token = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
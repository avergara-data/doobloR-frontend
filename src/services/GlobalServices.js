import http from '../http/http';

export default {
    getData(url){
        return new Promise(((resolve, reject) => {
            http.get(`${url}`)
            .then((response) => resolve(response.data))
            .catch((err) => reject(err))
        }))
    },
    setData(url,id, form){
        return new Promise(((resolve, reject) => {
            http.put(`${url}/${id}`,form)
            .then((response) => resolve(response.data))
            .catch((err) => reject(err))
        }))
    },
    createData(url,form){
        return new Promise(((resolve, reject) => {
            http.post(`${url}`,form)
            .then((response) => resolve(response))
            .catch((err) => reject(err))
        }))
    },
    deleteDataById(url,id){
        return new Promise(((resolve, reject) => {
        http.delete(`${url}/${id}`)
        .then((response) => resolve(response.data))
        .catch((err) => reject(err))
    }))
    }
}
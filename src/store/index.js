import { createStore } from 'vuex'
import sessionManager from "./modules/session_manager";


export default createStore({
    modules: {
        sessionManager,
    }
})
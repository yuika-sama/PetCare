import {publicApi, authApi} from './baseApi';

const authService = {
    login(payload){
        return publicApi.post('/auth/public/login', payload);
    },
    logout(){
        return authApi.delete('/auth/logout');
    }   
}

export default authService;
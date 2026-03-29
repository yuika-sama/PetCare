import {publicApi, authApi} from './baseApi';

const authService = {
    async login(payload){
        const response = await publicApi.post('/auth/public/login', payload);
        const data = response?.data?.data || {};
        const accessToken = data?.token;
        const userInfo = data?.user || {};
        const userRole = userInfo?.role || '';

        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
        }
        if (userRole) {
            localStorage.setItem('user_role', userRole);
        }
        if (Object.keys(userInfo).length > 0) {
            localStorage.setItem('user_info', JSON.stringify(userInfo));
        }

        return response;
    },
    logout(){
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_info');
        return authApi.delete('/auth/logout');
    }   
}

export default authService;
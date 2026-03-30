import {authApi} from './baseApi';

const customerService = {
    getCustomers(params) {
        return authApi.get('/customers', {params});
    },
    findCustomerByPhone(phone) {
        return authApi.get('/customers', { params: { phone } });
    },
    createCustomers(payload) {
        return authApi.post('/customers', payload);
    },
    createCustomer(payload) {
        return authApi.post('/customers', payload);
    },
    getCustomerPets(customerId) {
        return authApi.get(`/customers/${customerId}/pets`);
    }
}

export default customerService;
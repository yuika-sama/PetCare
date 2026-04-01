import {authApi} from './baseApi';

const normalizeClientPayload = (payload = {}) => ({
    name: payload?.name || payload?.fullName || '',
    phone: payload?.phone || payload?.phoneNumber || '',
});

const customerService = {
    getCustomers(params) {
        return authApi.get('/clients/search', {params});
    },
    findCustomerByPhone(phone) {
        return authApi.get('/clients', { params: { phone } });
    },
    createCustomers(payload) {
        return authApi.post('/clients', normalizeClientPayload(payload));
    },
    createCustomer(payload) {
        return authApi.post('/clients', normalizeClientPayload(payload));
    },
    getCustomerPets(customerId) {
        return authApi.get(`/clients/${customerId}/pets`);
    }
}

export default customerService;
import { authApi } from "./baseApi";

const STATUS_MAP = {
    pending: 'chờ thực hiện',
    in_progress: 'đang thực hiện',
    waiting_conclusion: 'chờ kết luận',
    waiting_payment: 'chờ thanh toán',
    completed: 'đã thanh toán',
    paid: 'đã thanh toán',
};

const normalizeStatus = (status) => {
    if (!status) return status;
    return STATUS_MAP[status] || status;
};

const normalizeParams = (params = {}) => {
    const next = { ...params };
    if (next.status) {
        next.status = normalizeStatus(next.status);
    }
    return next;
};

const receptionService = {
    getReceptions(params) {
        return authApi.get('/reception-slips', { params: normalizeParams(params) });
    },
    getReceptionsByStates(states = [], params = {}) {
        const normalizedStates = states
            .filter(Boolean)
            .map((state) => normalizeStatus(state));

        return authApi.get('/reception-slips/by-state', {
            params: {
                ...params,
                states: normalizedStates,
            },
        });
    },
    createReception(payload) {
        return authApi.post('/reception-slips', payload);
    },
    getReceptionById(receptionId) {
        return authApi.get(`/reception-slips/${receptionId}`);
    },
    patchReceptionById(receptionId, payload) {
        return authApi.patch(`/reception-slips/${receptionId}`, payload);
    },
    searchParaclinicalServices(params = {}) {
        return authApi.get('/paraclinical-services/search', {
            params: {
                keyword: params?.keyword,
                limit: params?.limit || 50,
            },
        });
    },
    searchTechnicians(params = {}) {
        return authApi.get('/technicians/search', {
            params: {
                keyword: params?.keyword,
                limit: params?.limit || 50,
            },
        });
    },
    getSelectedParaclinicalServices(receptionId) {
        return authApi.get(`/reception-slips/${receptionId}/paraclinical-services`);
    },
    saveSelectedParaclinicalServices(receptionId, payload) {
        return authApi.post(`/reception-slips/${receptionId}/paraclinical-services`, payload);
    }
}

export default receptionService;
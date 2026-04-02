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

const getApiData = (response) => response?.data?.data;

const toArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
};

const receptionService = {
    async getReceptions(params) {
        const response = await authApi.get('/reception-slips', { params: normalizeParams(params) });
        return { ...response, normalizedData: toArray(getApiData(response)) };
    },
    async getReceptionsByStates(states = [], params = {}) {
        const normalizedStates = states
            .filter(Boolean)
            .map((state) => normalizeStatus(state));

        const response = await authApi.get('/reception-slips/by-state', {
            params: {
                ...params,
                states: normalizedStates,
            },
        });
        return { ...response, normalizedData: toArray(getApiData(response)) };
    },
    async createReception(payload) {
        return authApi.post('/reception-slips', payload);
    },
    async getReceptionById(receptionId) {
        const response = await authApi.get(`/reception-slips/${receptionId}`);
        return { ...response, normalizedData: getApiData(response) };
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
    async getSelectedParaclinicalServices(receptionId) {
        const response = await authApi.get(`/reception-slips/${receptionId}/paraclinical-services`);
        return { ...response, normalizedData: toArray(getApiData(response)) };
    },
    saveSelectedParaclinicalServices(receptionId, payload) {
        return authApi.post(`/reception-slips/${receptionId}/paraclinical-services`, payload);
    },
    async getDoctorsWithWaitingCases() {
        const response = await authApi.get('/doctors/waiting-cases');
        return { ...response, normalizedData: toArray(getApiData(response)) };
    }
}

export default receptionService;
import {authApi} from './baseApi';

const treatmentService = {
    createTreatmentSlip(payload) {
        return authApi.post('/treatment-slips', payload);
    },
    getTreatmentSlipsByReceptionId(receptionId) {
        return authApi.get(`/treatment-slips/reception/${receptionId}`);
    },
    getTreatmentSlipById(treatmentSlipId) {
        return authApi.get(`/treatment-slips/${treatmentSlipId}`);
    },
    async getTreatmentDetailFlexible(receptionOrSlipId) {
        try {
            return await this.getTreatmentSlipsByReceptionId(receptionOrSlipId);
        } catch {
            return this.getTreatmentSlipById(receptionOrSlipId);
        }
    },
    patchTreatmentSlipById(treatmentSlipId, payload) {
        return authApi.patch(`/treatment-slips/${treatmentSlipId}`, payload);
    }
}

export default treatmentService;
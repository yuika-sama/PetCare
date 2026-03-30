import {authApi} from './baseApi';

const paymentService = {
    getPrePayments(params){
        return authApi.get('/prepayments', {params});
    },
    createPrepPayment(payload){
        return authApi.post('/prepayments', payload);
    },
    createPrePayment(payload){
        return authApi.post('/prepayments', payload);
    },
    createInvoice(payload){
        return authApi.post('/invoices', payload);
    },
    getInvoiceById(invoiceId){
        return authApi.get(`/invoices/${invoiceId}`);
    },
    patchInvoiceById(invoiceId, payload){
        return authApi.patch(`/invoices/${invoiceId}`, payload);
    },
    getInvoicePreview(receptionSlipId){
        return authApi.get(`/reception-slips/${receptionSlipId}/invoice`);
    },
    getPaymentMethods(){
        return authApi.get('/payment-methods');
    }
}

export default paymentService;
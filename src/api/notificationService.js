import { authApi } from './baseApi';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Có phiếu khám mới cần thực hiện!',
        petName: 'Kuro',
        customerName: 'Nguyễn Anh Đức',
        message: 'đã được tiếp đón. Hãy bắt đầu khám ngay!',
        time: '3 phút',
        receptionId: 1,
    },
    {
        id: 2,
        title: 'Cần cập nhật kết luận phiếu khám',
        petName: 'Milo',
        customerName: 'Lê Huyền Linh',
        message: 'đang chờ bác sĩ kết luận.',
        time: '10 phút',
        receptionId: 2,
    },
    {
        id: 3,
        title: 'Có phiếu cần ưu tiên xử lý',
        petName: 'Bim',
        customerName: 'Trần Tuấn Kiệt',
        message: 'có ghi chú cấp cứu từ lễ tân.',
        time: '15 phút',
        receptionId: 3,
    },
];

const notificationService = {
    async listDoctorNotifications() {
        try {
            const response = await authApi.get('/doctors/waiting-cases');
            const records = response?.data?.data || [];
            const mapped = records.map((record, index) => ({
                id: record?.doctorId || record?.id || index + 1,
                title: 'Có phiếu khám mới cần thực hiện!',
                petName: record?.petName || 'Thú cưng',
                customerName: record?.clientName || record?.doctorName || 'Khách hàng',
                message: 'đang chờ bác sĩ xử lý.',
                time: record?.updatedAt || '',
                receptionId: record?.receptionSlipId || record?.receptionId || record?.id,
            }));

            return { data: mapped };
        } catch {
            return Promise.resolve({ data: MOCK_NOTIFICATIONS });
        }
    },
    async listReceptionistNotifications(params = {}) {
        try {
            const response = await authApi.get('/reception-slips', {
                params: {
                    status: 'chờ thanh toán',
                    ...params,
                },
            });

            const records = response?.data?.data || [];
            const mapped = records.map((record) => ({
                id: record?.id,
                title: 'Thực hiện thanh toán!',
                time: record?.receptionTime || '',
                orderCode: `REC${record?.id || ''}`,
                customerName: record?.client?.fullName || 'Khách hàng',
                receptionId: record?.id,
            }));

            return { data: mapped };
        } catch {
            return Promise.resolve({ data: MOCK_NOTIFICATIONS });
        }
    },
    async markAsRead(notificationId) {
        return Promise.resolve({ data: { id: notificationId, read: true } });
    },
};

export default notificationService;

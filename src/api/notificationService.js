const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Co phieu kham moi can thuc hien!',
        petName: 'Kuro',
        customerName: 'Nguyen Anh Duc',
        message: 'da duoc tiep don. Hay bat dau kham ngay!',
        time: '3 phut',
        receptionId: 1,
    },
    {
        id: 2,
        title: 'Can cap nhat ket luan phieu kham',
        petName: 'Milo',
        customerName: 'Le Huyen Linh',
        message: 'dang cho bac si ket luan.',
        time: '10 phut',
        receptionId: 2,
    },
    {
        id: 3,
        title: 'Co phieu can uu tien xu ly',
        petName: 'Bim',
        customerName: 'Tran Tuan Kiet',
        message: 'co ghi chu cap cuu tu le tan.',
        time: '15 phut',
        receptionId: 3,
    },
];

const notificationService = {
    async listDoctorNotifications() {
        return Promise.resolve({ data: MOCK_NOTIFICATIONS });
    },
    async markAsRead(notificationId) {
        return Promise.resolve({ data: { id: notificationId, read: true } });
    },
};

export default notificationService;

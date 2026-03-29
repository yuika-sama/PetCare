const MOCK_MEDICINES = [
    {
        id: 1,
        name: 'Dai trang Truong Phuc',
        desc: 'Dieu tri viem loet dai trang, roi loan tieu hoa (3 vi x 10 vien)',
        price: '120.000d',
        unit: '/hop',
        stock: '2.000',
        image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
        selected: false,
        qty: 0,
        selectedUnit: 'Hop',
        expanded: false,
        dosage: {
            morning: 0,
            noon: 0,
            afternoon: 0,
            evening: 0,
            note: '',
        },
    },
    {
        id: 2,
        name: 'Men tieu hoa Petical',
        desc: 'Ho tro he tieu hoa va can bang vi sinh duong ruot',
        price: '85.000d',
        unit: '/hop',
        stock: '1.250',
        image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
        selected: false,
        qty: 0,
        selectedUnit: 'Hop',
        expanded: false,
        dosage: {
            morning: 0,
            noon: 0,
            afternoon: 0,
            evening: 0,
            note: '',
        },
    },
    {
        id: 3,
        name: 'Khang sinh tong hop',
        desc: 'Ho tro dieu tri nhiem khuan duong ho hap',
        price: '210.000d',
        unit: '/hop',
        stock: '860',
        image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
        selected: false,
        qty: 0,
        selectedUnit: 'Hop',
        expanded: false,
        dosage: {
            morning: 0,
            noon: 0,
            afternoon: 0,
            evening: 0,
            note: '',
        },
    },
];

const medicineService = {
    async listMedicines() {
        return Promise.resolve({ data: MOCK_MEDICINES });
    },
    async saveSelection(payload) {
        return Promise.resolve({ data: payload });
    },
};

export default medicineService;

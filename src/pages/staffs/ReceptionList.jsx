import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReceptionList.css';
import { Input, Button } from 'semantic-ui-react';
import { Search, SlidersHorizontal } from 'lucide-react';
import StaffNavBar from '../../components/staffs/StaffNavBar';
import StaffStatusTabs from '../../components/staffs/StaffStatusTabs';
import StaffReceptionCard from '../../components/staffs/StaffReceptionCard';
import StaffCompletedReceptionCard from '../../components/staffs/StaffCompletedReceptionCard';

const demoCards = [
    {
        id: 1,
        customer: 'Nguyễn Anh Đức',
        phone: '0912345678',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'received',
        pets: [
            { name: 'Kuro', breed: 'Chó Poodle', type: 'Chó', age: '3 Tuổi', weight: '4.5kg' }
        ],
        paid: '251.000đ',
        total: '1.000.000đ'
    },
    {
        id: 2,
        customer: 'Nguyễn Duy Ngọc',
        phone: '0908264671',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'exam',
        pets: [
            { name: 'Kuro', breed: 'Chó Poodle', type: 'Chó', age: '3 Tuổi', weight: '4.5kg' },
            { name: 'Mike', breed: 'Mèo Anh lông ngắn', type: 'Mèo', age: '2 Tuổi', weight: '2.5kg' }
        ],
        paid: '824.400đ',
        total: '3.000.000đ'
    },
    {
        id: 3,
        customer: 'Hà An Huy',
        phone: '0908264671',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'done',
        pets: [
            { name: 'Kuro', breed: 'Chó Poodle', type: 'Chó', age: '3 Tuổi', weight: '4.5kg' },
            { name: 'Mike', breed: 'Mèo Anh lông ngắn', type: 'Mèo', age: '2 Tuổi', weight: '2.5kg', alert: true }
        ],
        paid: '824.400đ',
        total: '3.000.000đ'
    }
];

const ReceptionList = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('cho');
    const [onlyUnpaid, setOnlyUnpaid] = useState(false);

    // Filter cards based on tab and query
    const filteredCards = demoCards.filter((card) => {
        const keyword = query.trim().toLowerCase();
        const searchable = `${card.customer} ${card.phone} ${card.code} ${card.pets.map((pet) => pet.name).join(' ')}`.toLowerCase();
        const matchQuery = !keyword || searchable.includes(keyword);
        const unpaid = card.paid === '0đ';
        const matchUnpaid = !onlyUnpaid || unpaid;
        
        if (activeTab === 'all') return matchQuery && matchUnpaid;
        
        // Define tab to status mapping
        const tabStatusMap = {
            'cho': 'received',
            'da': 'exam',
            'huy': 'cancelled',
            'hoanthanh': 'done'
        };
        
        return matchQuery && matchUnpaid && card.status === tabStatusMap[activeTab];
    });

    return (
        <div className="staff-page">
            <div className="staff-content">
                <div className="staff-header">
                    <div>
                        <h1>Danh sách tiếp đón</h1>
                        <p>Hôm nay, phòng khám PetHealth</p>
                    </div>
                    <div className="staff-avatar" />
                </div>

                <div className="staff-search-row">
                    <Input
                        fluid
                        icon={<Search size={18} className="staff-search-icon" />}
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="staff-search"
                    />
                    <Button className="staff-filter" icon>
                        <SlidersHorizontal size={18} />
                    </Button>
                </div>

                <label className="staff-inline-filter">
                    <input
                        type="checkbox"
                        checked={onlyUnpaid}
                        onChange={(event) => setOnlyUnpaid(event.target.checked)}
                    />
                    Chỉ hiển thị hồ sơ chưa thanh toán
                </label>

                <div className="staff-tabs-wrap">
                    <StaffStatusTabs onChange={(key) => setActiveTab(key)} />
                </div>

                <div className="staff-cards">
                    {filteredCards.map((card) => (
                        activeTab === 'hoanthanh' ? (
                            <StaffCompletedReceptionCard 
                                key={card.id}
                                customer={card.customer}
                                phone={card.phone}
                                code={card.code}
                                createdAt={card.createdAt}
                                pets={card.pets.map((pet) => ({
                                    name: pet.name,
                                    breed: pet.breed,
                                    gender: pet.type === 'Mèo' ? 'female' : 'male',
                                    age: pet.age,
                                    weight: pet.weight
                                }))}
                                totalAmount={card.total}
                                subAmount={card.total}
                            />
                        ) : (
                            <StaffReceptionCard
                                key={card.id}
                                {...card}
                                onPay={() => navigate('/staffs/payment')}
                            />
                        )
                    ))}
                    {filteredCards.length === 0 && (
                        <div className="staff-empty">Không có hồ sơ phù hợp bộ lọc.</div>
                    )}
                </div>
            </div>

            <StaffNavBar />
        </div>
    );
};

export default ReceptionList;

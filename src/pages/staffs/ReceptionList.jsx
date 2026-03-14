import React, { useState } from 'react';
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
        customer: 'Nguyen Anh Duc',
        phone: '0912345678',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'received',
        pets: [
            { name: 'Kuro', breed: 'Cho Poodle', type: 'Cho', age: '3 Tuoi', weight: '4.5kg' }
        ],
        paid: '251.000đ',
        total: '1.000.000đ'
    },
    {
        id: 2,
        customer: 'Nguyen Duy Ngoc',
        phone: '0908264671',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'exam',
        pets: [
            { name: 'Kuro', breed: 'Cho Poodle', type: 'Cho', age: '3 Tuoi', weight: '4.5kg' },
            { name: 'Mike', breed: 'Meo Anh long ngan', type: 'Meo', age: '2 Tuoi', weight: '2.5kg' }
        ],
        paid: '824.400đ',
        total: '3.000.000đ'
    },
    {
        id: 3,
        customer: 'Ha An Huy',
        phone: '0908264671',
        code: '2141441',
        createdAt: '10:03 - 20/03/2026',
        status: 'done',
        pets: [
            { name: 'Kuro', breed: 'Cho Poodle', type: 'Cho', age: '3 Tuoi', weight: '4.5kg' },
            { name: 'Mike', breed: 'Meo Anh long ngan', type: 'Meo', age: '2 Tuoi', weight: '2.5kg', alert: true }
        ],
        paid: '824.400đ',
        total: '3.000.000đ'
    }
];

const ReceptionList = () => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('cho');

    // Filter cards based on tab and query
    const filteredCards = demoCards.filter(card => {
        const matchQuery = card.customer.toLowerCase().includes(query.toLowerCase());
        
        if (activeTab === 'all') return matchQuery;
        
        // Define tab to status mapping
        const tabStatusMap = {
            'cho': 'received',
            'da': 'exam',
            'huy': 'cancelled',
            'hoanthanh': 'done'
        };
        
        return matchQuery && card.status === tabStatusMap[activeTab];
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

                <div className="staff-tabs-wrap">
                    <StaffStatusTabs onChange={(key) => setActiveTab(key)} />
                </div>

                <div className="staff-cards">
                    {filteredCards.map((card) => (
                        activeTab === 'hoanthanh' ? (
                            <StaffCompletedReceptionCard 
                            />
                        ) : (
                            <StaffReceptionCard key={card.id} {...card} />
                        )
                    ))}
                </div>
            </div>

            <StaffNavBar />
        </div>
    );
};

export default ReceptionList;

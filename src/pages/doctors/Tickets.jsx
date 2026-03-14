import React from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import TicketCard from '../../components/doctor/TicketCard';
import TabStatus from '../../components/doctor/TabStatus';
import './Tickets.css';

import { Search, SlidersVertical, MoreVertical } from 'lucide-react';

const SearchIcon = () => <Search size={20} color="#209D80" />;
const FilterIcon = () => <SlidersVertical size={20} color="#209D80" />;
const MoreVerticalIcon = () => <MoreVertical size={24} color="#1a1a1a" />;

const Tickets = () => {
    const dummyTickets = [
        {
            id: 1,
            customerName: 'Nguyễn Anh Đức',
            dateTime: '10:03 - 20/03/2026',
            paidAmount: '0đ',
            totalAmount: '/1.000.000đ',
            pet: {
                name: 'Kuro',
                breed: 'Chó Poodle',
                gender: 'male',
                age: '3 Tuổi',
                weight: '4.5kg',
                hasAlert: true
            },
            services: [
                { name: 'Điều trị ngoại trú', status: 'pending' },
                { name: 'Điều trị nội trú', status: 'completed' },
                { name: 'Khám lâm sàng', status: 'completed' }
            ]
        },
        {
            id: 2,
            customerName: 'Nguyễn Anh Đức',
            dateTime: '10:03 - 20/03/2026',
            paidAmount: '0đ',
            totalAmount: '/1.000.000đ',
            pet: {
                name: 'Kuro',
                breed: 'Chó Poodle',
                gender: 'male',
                age: '3 Tuổi',
                weight: '4.5kg',
                hasAlert: false
            },
            services: [
                { name: 'Khám lâm sàng', status: 'pending' }
            ]
        },
        {
            id: 3,
            customerName: 'Nguyễn Anh Đức',
            dateTime: '10:03 - 20/03/2026',
            paidAmount: '0đ',
            totalAmount: '/1.000.000đ',
            pet: {
                name: 'Kuro',
                breed: 'Chó Poodle',
                gender: 'male',
                age: '3 Tuổi',
                weight: '4.5kg',
                hasAlert: false
            },
            services: [
                { name: 'Khám lâm sàng', status: 'pending' }
            ]
        }
    ];

    return (
        <DoctorLayout>
            <div className="tickets-page">
                <div className="tickets-header-area">
                    <div className="tickets-top-bar">
                        <h1 className="tickets-title">Phiếu khám</h1>
                        <button className="icon-btn">
                            <MoreVerticalIcon />
                        </button>
                    </div>

                    <div className="tickets-search-filter">
                        <div className="search-box">
                            <span className="search-icon"><SearchIcon /></span>
                            <input type="text" placeholder="Search" className="search-input" />
                        </div>
                        <button className="filter-btn">
                            <FilterIcon />
                        </button>
                    </div>
                </div>

                <div className="tickets-content-area">
                    <TabStatus />
                    <div className="tickets-list">
                        {dummyTickets.map((ticket) => (
                            <TicketCard key={ticket.id} {...ticket} />
                        ))}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Tickets;

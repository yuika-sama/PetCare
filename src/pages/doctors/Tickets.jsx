import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import TicketCard from '../../components/doctor/TicketCard';
import TabStatus from '../../components/doctor/TabStatus';
import './Tickets.css';
import "@fontsource/roboto/500.css";

import { Search, Bell, ChevronLeft } from 'lucide-react';
import receptionService from '../../api/receptionService';

const SearchIcon = () => <Search size={20} color="#209D80" />;
const BellIcon = () => <Bell size={24} color="#111827" />;
const BackIcon = () => <ChevronLeft size={22} color="#111827" />;

const Tickets = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const params = activeTab === 'all' ? {} : { status: activeTab };
                const response = await receptionService.getReceptions(params);
                const records = response?.data?.data || [];
                if (!isMounted) return;

                const mapped = records.map((record) => {
                    const createdAt = record?.receptionTime;
                    const displayDate = createdAt
                        ? new Date(createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', ' -')
                        : '--:-- - --/--/----';
                    const petName = record?.pet?.name || 'Chưa có tên';
                    const serviceName = record?.examForm?.examType || 'Khám lâm sàng';
                    const status = (record?.status || '').toLowerCase();
                    const mappedStatus = status.includes('complete')
                        ? 'completed'
                        : status.includes('progress')
                            ? 'in_progress'
                            : 'pending';
                    const response = {
                        id: record?.id,
                        code: `PK${record?.id || ''}`,
                        customerName: record?.client?.fullName || 'Khách hàng',
                        dateTime: displayDate,
                        pet: {
                            name: petName,
                            breed: record?.pet?.breed || record?.pet?.species || 'Chưa rõ giống',
                            gender: (record?.pet?.gender || '').toLowerCase() === 'female' ? 'female' : 'male',
                            age: record?.pet?.dateOfBirth ? '-- Tuổi' : '-- Tuổi',
                            weight: record?.pet?.weight ? `${record.pet.weight}kg` : '--kg',
                            hasAlert: Boolean(record?.note)
                        },
                        services: [{ name: serviceName, status: mappedStatus }],
                    };
                    return response;
                });

                console.log(mapped)

                setTickets(mapped);
            } catch {
                if (!isMounted) return;
                setTickets([]);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchTickets();
        return () => {
            isMounted = false;
        };
    }, [activeTab]);

    const inferStatus = (services) => {
        if (services.length === 0) return 'pending';
        const hasPending = services.some((service) => service.status === 'pending');
        const hasCompleted = services.some((service) => service.status === 'completed');
        if (hasPending && hasCompleted) return 'in_progress';
        if (hasPending) return 'pending';
        return 'completed';
    };

    const filteredTickets = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return tickets.filter((ticket) => {
            const status = inferStatus(ticket.services);
            const matchesTab = activeTab === 'all' || status === activeTab;

            const text = `${ticket.customerName} ${ticket.pet.name} ${ticket.pet.breed} ${ticket.code}`.toLowerCase();
            const matchesSearch = !keyword || text.includes(keyword);

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm, tickets]);

    const tabItems = useMemo(() => {
        const counts = tickets.reduce((acc, ticket) => {
            const status = inferStatus(ticket.services);
            acc[status] = (acc[status] || 0) + 1;
            acc.all += 1;
            return acc;
        }, { pending: 0, in_progress: 0, completed: 0, all: 0 });

        return [
            { id: 'pending', label: 'Chờ thực hiện', count: counts.pending },
            { id: 'in_progress', label: 'Đang thực hiện', count: counts.in_progress },
            { id: 'completed', label: 'Hoàn thành', count: counts.completed },
            { id: 'all', label: 'Tất cả', count: counts.all },
        ];
    }, [tickets]);

    return (
        <DoctorLayout>
            <div className="tickets-page">
                <div className="tickets-header-area">
                    <div className="tickets-top-bar">
                        <div className="tickets-title-wrap">
                            <button className="tickets-back-btn" type="button" onClick={() => navigate('/doctors/home')} aria-label="Ve trang chu">
                                <BackIcon />
                            </button>
                            <h1 className="tickets-title">Phiếu khám</h1>
                        </div>
                        <button
                            className="notification-btn"
                            aria-label="Thông báo"
                            onClick={() => navigate('/doctors/notifications')}
                        >
                            <BellIcon />
                        </button>
                    </div>

                    <div className="search-box">
                        <span className="search-icon"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div style={{ marginTop: '16px' }}>
                        <TabStatus activeTab={activeTab} onTabChange={setActiveTab} tabs={tabItems} />
                    </div>
                </div>

                <div className="tickets-content-area">
                    <div className="tickets-list">
                        {isLoading && <div className="tickets-empty-state">Đang tải dữ liệu phiếu khám...</div>}
                        {filteredTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                {...ticket}
                                onClick={() => navigate(`/doctors/tickets/${ticket.id}`)}
                            />
                        ))}
                        {!isLoading && filteredTickets.length === 0 && (
                            <div className="tickets-empty-state">Không có phiếu khám phù hợp bộ lọc.</div>
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Tickets;

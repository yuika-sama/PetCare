import React, { useState, useMemo, useEffect } from 'react';
import { Search, Bell, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, UserRound, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReceptionistLayout from '../../layouts/ReceptionistLayout';
import ReceptionCard from '../../components/receptionist/ReceptionCard';
import ReceivedCard from '../../components/receptionist/ReceivedCard';
import { RECEPTIONIST_PATHS } from '../../routes/receptionistPaths';
import receptionService from '../../api/receptionService';
import './TodayOrders.css';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const ORDER_STATUS = {
    RECEIVED: 'da_tiep_don',
    WAITING_PAYMENT: 'cho_thanh_toan',
    PAID: 'da_thanh_toan',
    ALL: 'tat_ca'
};

const initialOrders = [
    // {
    //     id: 1,
    //     customerName: 'Nguyễn Anh Đức',
    //     phone: '0912345678',
    //     ticketId: '2141441',
    //     status: ORDER_STATUS.RECEIVED,
    //     statusLabel: 'Đã tiếp đón',
    //     createdAt: 'Tiếp đón lúc 10:03 - 20/03/2026',
    //     date: 20,
    //     species: 'cho',
    //     hasAdvance: true,
    //     pets: [{ name: 'Kuro', breed: 'Chó Poodle', gender: 'male', age: '3 Tuổi', weight: '4.5kg' }],
    //     sourceOrder: '2141441',
    //     paymentEnabled: true,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=NAD'
    // },
    // {
    //     id: 2,
    //     customerName: 'Lê Huyền Linh',
    //     phone: '0816278274',
    //     ticketId: '2141442',
    //     status: ORDER_STATUS.RECEIVED,
    //     statusLabel: 'Đã tiếp đón',
    //     createdAt: 'Tiếp đón lúc 11:10 - 20/03/2026',
    //     date: 20,
    //     species: 'meo',
    //     hasAdvance: false,
    //     pets: [{ name: 'Mike', breed: 'Mèo Anh lông ngắn', gender: 'male', age: '2 Tuổi', weight: '2.5kg' }],
    //     sourceOrder: null,
    //     paymentEnabled: true,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=LHL'
    // },
    // {
    //     id: 3,
    //     customerName: 'Nguyễn Duy Ngọc',
    //     phone: '0908264671',
    //     ticketId: '2141551',
    //     status: ORDER_STATUS.WAITING_PAYMENT,
    //     statusLabel: 'Chờ thanh toán',
    //     createdAt: 'Lập phiếu lúc 09:03 - 20/03/2026',
    //     date: 20,
    //     species: 'cho',
    //     hasAdvance: true,
    //     pets: [{ name: 'Milo', breed: 'Chó Corgi', gender: 'male', age: '4 Tuổi', weight: '7kg' }],
    //     sourceOrder: null,
    //     serviceSummary: '82 Hug × 16 Hug',
    //     totalAmount: '251.000đ',
    //     paymentEnabled: true,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=NDN'
    // },
    // {
    //     id: 4,
    //     customerName: 'Trần Minh Hạnh',
    //     phone: '0902627274',
    //     ticketId: '2141999',
    //     status: ORDER_STATUS.WAITING_PAYMENT,
    //     statusLabel: 'Chờ thanh toán',
    //     createdAt: 'Lập phiếu lúc 08:50 - 20/03/2026',
    //     date: 20,
    //     species: 'khac',
    //     hasAdvance: false,
    //     pets: [{ name: 'Peach', breed: 'Thỏ Mini', gender: 'female', age: '1 Tuổi', weight: '1.1kg' }],
    //     sourceOrder: null,
    //     serviceSummary: '12 Hug × 04 Hug',
    //     totalAmount: '179.000đ',
    //     paymentEnabled: true,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=TMH'
    // },
    // {
    //     id: 5,
    //     customerName: 'Hà An Huy',
    //     phone: '0977771234',
    //     ticketId: '2141777',
    //     status: ORDER_STATUS.PAID,
    //     statusLabel: 'Đã thanh toán',
    //     createdAt: 'Thanh toán lúc 07:45 - 20/03/2026',
    //     date: 20,
    //     species: 'cho',
    //     hasAdvance: true,
    //     pets: [{ name: 'Pika', breed: 'Chó Phốc sóc', gender: 'female', age: '5 Tuổi', weight: '2.3kg' }],
    //     sourceOrder: '2141333',
    //     serviceSummary: '64 Hug × 08 Hug',
    //     totalAmount: '368.000đ',
    //     paymentEnabled: false,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=HAH'
    // },
    // {
    //     id: 6,
    //     customerName: 'Phạm Ngọc Vy',
    //     phone: '0933338899',
    //     ticketId: '2141880',
    //     status: ORDER_STATUS.PAID,
    //     statusLabel: 'Đã thanh toán',
    //     createdAt: 'Thanh toán lúc 13:25 - 20/03/2026',
    //     date: 20,
    //     species: 'meo',
    //     hasAdvance: true,
    //     pets: [{ name: 'Bông', breed: 'Mèo Ba Tư', gender: 'female', age: '3 Tuổi', weight: '3.2kg' }],
    //     sourceOrder: null,
    //     serviceSummary: '31 Hug × 06 Hug',
    //     totalAmount: '205.000đ',
    //     paymentEnabled: false,
    //     hideSource: false,
    //     avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=PNV'
    // }
];

const TodayOrders = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(ORDER_STATUS.RECEIVED);
    const [calendarExpanded, setCalendarExpanded] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState(initialOrders);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        name: '', phone: '', petName: '', species: '', breed: '', appointmentDate: ''
    });

    const today = new Date();
    const todayDate = today.getDate();
    const fallbackDate = initialOrders[0]?.date || todayDate;
    const defaultSelectedDate = initialOrders.some((order) => order.date === todayDate)
        ? todayDate
        : fallbackDate;

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

    const selectedDateIso = useMemo(() => {
        const date = new Date(viewYear, viewMonth, selectedDate || 1);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [viewYear, viewMonth, selectedDate]);

    useEffect(() => {
        let isMounted = true;

        const mapStatus = (rawStatus) => {
            const status = String(rawStatus || '').toLowerCase();
            if (status.includes('paid') || status.includes('da_thanh_toan')) {
                return ORDER_STATUS.PAID;
            }
            if (status.includes('cho_thanh_toan') || status.includes('waiting') || status.includes('payment')) {
                return ORDER_STATUS.WAITING_PAYMENT;
            }
            return ORDER_STATUS.RECEIVED;
        };

        const mapOrder = (record) => {
            const mappedStatus = mapStatus(record?.status);
            const dateObj = record?.receptionTime ? new Date(record.receptionTime) : new Date();
            const statusLabel =
                mappedStatus === ORDER_STATUS.PAID
                    ? 'Đã thanh toán'
                    : mappedStatus === ORDER_STATUS.WAITING_PAYMENT
                        ? 'Chờ thanh toán'
                        : 'Đã tiếp đón';
            const initials = (record?.client?.fullName || 'KH')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('');

            return {
                id: record?.id,
                customerId: record?.client?.id,
                customerName: record?.client?.fullName || 'Khách hàng',
                phone: record?.client?.phoneNumber || '--',
                ticketId: `REC${record?.id || ''}`,
                status: mappedStatus,
                statusLabel,
                createdAt: dateObj.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).replace(',', ' -'),
                date: dateObj.getDate(),
                species: record?.pet?.species || '',
                hasAdvance: false,
                pets: [
                    {
                        id: record?.pet?.id,
                        name: record?.pet?.name || 'Chưa có tên',
                        breed: record?.pet?.breed || record?.pet?.species || '--',
                        gender: String(record?.pet?.gender || '').toLowerCase() === 'female' ? 'female' : 'male',
                        age: record?.pet?.dateOfBirth ? '-- Tuổi' : '-- Tuổi',
                        weight: record?.pet?.weight ? `${record?.pet?.weight}kg` : '--',
                    },
                ],
                sourceOrder: null,
                paymentEnabled: mappedStatus !== ORDER_STATUS.PAID,
                hideSource: false,
                avatar: `https://placehold.co/80x80/e0f2ef/209D80?text=${initials || 'KH'}`,
                receptionRecord: record,
            };
        };

        const fetchOrders = async () => {
            setIsLoadingOrders(true);
            setOrdersError('');
            try {
                const response = await receptionService.getReceptions({ date: selectedDateIso });
                const records = response?.data?.data || [];
                if (!isMounted) return;
                setOrders(records.map(mapOrder));
            } catch {
                if (!isMounted) return;
                setOrders([]);
                setOrdersError('Không thể tải dữ liệu tiếp đón từ hệ thống.');
            } finally {
                if (isMounted) {
                    setIsLoadingOrders(false);
                }
            }
        };

        fetchOrders();

        return () => {
            isMounted = false;
        };
    }, [selectedDateIso]);

    // Build the full month grid
    const monthGrid = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        // getDay() returns 0=Sun, we need Mon=0
        let startWeekday = firstDay.getDay() - 1;
        if (startWeekday < 0) startWeekday = 6;

        const cells = [];
        // Empty leading cells
        for (let i = 0; i < startWeekday; i++) {
            cells.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d);
        }
        return cells;
    }, [viewYear, viewMonth]);

    // Get week row that contains the selected date
    const currentWeek = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        let startWeekday = firstDay.getDay() - 1;
        if (startWeekday < 0) startWeekday = 6;
        const offset = startWeekday + selectedDate - 1; // index in monthGrid
        const weekStart = Math.floor(offset / 7) * 7;
        const week = [];
        for (let i = 0; i < 7; i++) {
            const cell = monthGrid[weekStart + i];
            week.push(cell ?? null);
        }
        return week;
    }, [viewYear, viewMonth, selectedDate, monthGrid]);

    const goMonth = (delta) => {
        let newMonth = viewMonth + delta;
        let newYear = viewYear;
        if (newMonth < 0) { newMonth = 11; newYear--; }
        if (newMonth > 11) { newMonth = 0; newYear++; }
        setViewMonth(newMonth);
        setViewYear(newYear);
        setSelectedDate(1);
    };

    const badgeData = useMemo(() => {
        const map = {};
        orders.forEach((order) => {
            map[order.date] = (map[order.date] || 0) + 1;
        });
        return map;
    }, [orders]);

    const filteredByDate = useMemo(
        () => orders.filter((order) => order.date === selectedDate),
        [orders, selectedDate]
    );

    const filteredBySearchAndFilters = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return filteredByDate.filter((order) => {
            const searchable = `${order.customerName} ${order.phone} ${order.ticketId} ${order.pets[0]?.name || ''}`.toLowerCase();
            const matchesKeyword = !keyword || searchable.includes(keyword);
            return matchesKeyword;
        });
    }, [filteredByDate, searchTerm]);

    const statusTabs = useMemo(() => {
        const count = (status) => filteredByDate.filter((item) => item.status === status).length;
        return [
            { key: ORDER_STATUS.RECEIVED, label: 'Đã tiếp đón', count: count(ORDER_STATUS.RECEIVED) },
            { key: ORDER_STATUS.WAITING_PAYMENT, label: 'Chờ thanh toán', count: count(ORDER_STATUS.WAITING_PAYMENT) },
            { key: ORDER_STATUS.PAID, label: 'Đã thanh toán', count: count(ORDER_STATUS.PAID) },
            { key: ORDER_STATUS.ALL, label: 'Tất cả', count: filteredByDate.length }
        ];
    }, [filteredByDate]);

    const activeOrders = useMemo(() => {
        if (activeStatus === ORDER_STATUS.ALL) return filteredBySearchAndFilters;
        return filteredBySearchAndFilters.filter((order) => order.status === activeStatus);
    }, [activeStatus, filteredBySearchAndFilters]);

    const receivedCustomers = useMemo(
        () => activeOrders.filter((order) => order.status === ORDER_STATUS.RECEIVED),
        [activeOrders]
    );

    const shouldUseSimpleReceptionCard = activeStatus === ORDER_STATUS.RECEIVED;

    const handleGoToNewReception = (customer = null) => {
        navigate(RECEPTIONIST_PATHS.NEW_RECEPTION, { state: customer ? { customer } : undefined });
    };

    const handleGoToNotifications = () => {
        navigate(RECEPTIONIST_PATHS.NOTIFICATIONS);
    };

    const handleGoToPayment = (order) => {
        navigate(RECEPTIONIST_PATHS.PAYMENT, {
            state: {
                receptionId: order?.id,
                customerName: order?.customerName,
                customerPhone: order?.phone,
            },
        });
    };

    const handleCreateCustomer = () => {
        if (!newCustomer.name || !newCustomer.phone || !newCustomer.petName || !newCustomer.species || !newCustomer.breed) {
            return;
        }

        const orderId = Date.now();
        const shortName = newCustomer.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join('') || 'KH';

        const newOrder = {
            id: orderId,
            customerName: newCustomer.name,
            phone: newCustomer.phone,
            ticketId: `${orderId}`.slice(-7),
            status: ORDER_STATUS.RECEIVED,
            statusLabel: 'Đã tiếp đón',
            createdAt: 'Tạo đơn vừa xong',
            date: selectedDate,
            species: newCustomer.species,
            hasAdvance: false,
            pets: [
                {
                    name: newCustomer.petName,
                    breed: newCustomer.breed,
                    gender: 'male',
                    age: '--',
                    weight: '--'
                }
            ],
            sourceOrder: null,
            paymentEnabled: false,
            hideSource: false,
            avatar: `https://placehold.co/80x80/e0f2ef/209D80?text=${shortName}`
        };

        setOrders((prev) => [newOrder, ...prev]);
        setShowNewCustomerModal(false);
        setActiveStatus(ORDER_STATUS.RECEIVED);
        setSearchTerm('');
        setNewCustomer({ name: '', phone: '', petName: '', species: '', breed: '', appointmentDate: '' });
    };

    return (
        <ReceptionistLayout>
            <div className="today-orders-page">
                {/* Header */}
                <div className="to-header-area">
                    <div className="to-header">
                        <div className="to-header-user">
                            <div className="to-header-avatar">
                                <img src="https://placehold.co/80x80/e0f2ef/209D80?text=TT" alt="Thu Trang" />
                            </div>
                            <div className="to-header-texts">
                                <p className="to-header-greeting">Xin chào</p>
                                <h1 className="to-header-name">Lê tân Thu Trang</h1>
                            </div>
                        </div>
                        <button
                            className="to-header-bell-btn"
                            type="button"
                            aria-label="Thông báo"
                            onClick={handleGoToNotifications}
                        >
                            <Bell size={20} color="#1a1a1a" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Calendar Strip */}
                <div className="to-calendar-section">
                    <div className="to-month-header">
                        {calendarExpanded && (
                            <button className="to-month-nav-btn" onClick={() => goMonth(-1)}>
                                <ChevronLeft size={18} color="#209D80" />
                            </button>
                        )}
                        <div className="to-month-label">
                            <span className="to-month-text">{MONTH_NAMES[viewMonth]}</span>
                            <ChevronDown size={16} color="#209D80" />
                        </div>
                        {calendarExpanded && (
                            <button className="to-month-nav-btn" onClick={() => goMonth(1)}>
                                <ChevronRight size={18} color="#209D80" />
                            </button>
                        )}
                    </div>

                    {/* Day-of-week header row (always visible) */}
                    <div className="to-week-strip to-day-header-row">
                        {DAY_LABELS.map((lbl, idx) => (
                            <div key={idx} className="to-day-col">
                                <span className="to-day-label">{lbl}</span>
                            </div>
                        ))}
                    </div>

                    {!calendarExpanded ? (
                        /* Collapsed: show only current week */
                        <div className="to-week-strip">
                            {currentWeek.map((date, idx) => (
                                <div key={idx} className="to-day-col">
                                    {date ? (
                                        <div
                                            className={`to-day-circle ${date === selectedDate ? 'active' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            {badgeData[date] && (
                                                <span className="to-day-badge">{badgeData[date]}</span>
                                            )}
                                            <span className="to-day-number">{date}</span>
                                        </div>
                                    ) : (
                                        <div className="to-day-circle empty"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Expanded: show full month grid */
                        <div className="to-month-grid">
                            {monthGrid.map((date, idx) => (
                                <div key={idx} className="to-day-col">
                                    {date ? (
                                        <div
                                            className={`to-day-circle ${date === selectedDate ? 'active' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            {badgeData[date] && (
                                                <span className="to-day-badge">{badgeData[date]}</span>
                                            )}
                                            <span className="to-day-number">{date}</span>
                                        </div>
                                    ) : (
                                        <div className="to-day-circle empty"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="to-collapse-indicator" onClick={() => setCalendarExpanded(!calendarExpanded)}>
                        {calendarExpanded ? <ChevronUp size={20} color="#209D80" /> : <ChevronDown size={20} color="#209D80" />}
                    </div>
                </div>

                {/* Stats Row */}
                {/* <div className="to-stats-row">
                    <div className="to-stat-card">
                        <span className="to-stat-label">Đã tiếp đón</span>
                        <span className="to-stat-value">{statusTabs.find((tab) => tab.key === ORDER_STATUS.RECEIVED)?.count || 0}</span>
                    </div>
                    <div className="to-stat-card">
                        <span className="to-stat-label">Đã thanh toán</span>
                        <span className="to-stat-value">{statusTabs.find((tab) => tab.key === ORDER_STATUS.PAID)?.count || 0}</span>
                    </div>
                </div> */}

                {/* Search Bar */}
                <div className="to-search-container">
                    <div className="to-search-box">
                        <Search size={20} color="#209D80" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="to-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {ordersError && <p className="to-empty-text">{ordersError}</p>}
                {isLoadingOrders && <p className="to-empty-text">Đang tải danh sách tiếp đón...</p>}

                {/* Status Tabs */}
                <div className="to-status-tabs">
                    {statusTabs.map(tab => (
                        <div
                            key={tab.key}
                            className={`to-status-tab ${activeStatus === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveStatus(tab.key)}
                        >
                            <span className="to-tab-label">{tab.label}</span>
                            <span className="to-tab-count">{tab.count}</span>
                        </div>
                    ))}
                </div>

                {/* Content by tab */}
                {shouldUseSimpleReceptionCard && (
                    <>
                        {receivedCustomers.length > 0 ? (
                            <div className="to-customers-list">
                                {receivedCustomers.map((c) => (
                                    <ReceptionCard
                                        key={c.id}
                                        name={c.customerName}
                                        phone={c.phone}
                                        avatar={c.avatar}
                                        onAdd={() =>
                                            handleGoToNewReception({
                                                id: c.customerId,
                                                name: c.customerName,
                                                phone: c.phone,
                                                pets: c.pets || [],
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="to-empty-state">
                                <div className="to-empty-icon">
                                    <UserRound size={32} color="#a1a1aa" />
                                </div>
                                <p className="to-empty-text">Không tìm thấy khách hàng</p>
                                <button className="to-empty-add-btn" onClick={handleGoToNewReception}>
                                    <span className="to-empty-add-icon-wrap">
                                        <PlusCircle size={16} color="#209D80" strokeWidth={2.25} />
                                    </span>
                                    <span>Tạo mới khách hàng</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!shouldUseSimpleReceptionCard && activeOrders.length > 0 && (
                    <div className="to-customers-list">
                        {activeOrders.map((order) => (
                            <ReceivedCard
                                key={order.id}
                                customerName={order.customerName}
                                phone={order.phone}
                                ticketId={order.ticketId}
                                status={order.statusLabel}
                                createdAt={order.createdAt}
                                pets={order.pets}
                                sourceOrder={order.sourceOrder}
                                serviceSummary={order.serviceSummary}
                                totalAmount={order.totalAmount}
                                paymentEnabled={order.paymentEnabled}
                                paymentButtonLabel={
                                    order.status === ORDER_STATUS.PAID ? 'Đã thanh toán' : 'Thanh toán'
                                }
                                hideSource={order.hideSource}
                                onPayment={() => handleGoToPayment(order)}
                            />
                        ))}
                    </div>
                )}

                {!shouldUseSimpleReceptionCard && activeOrders.length === 0 && (
                    <div className="to-empty-state">
                        <div className="to-empty-icon">
                            <UserRound size={32} color="#a1a1aa" />
                        </div>
                        <p className="to-empty-text">Không có đơn phù hợp bộ lọc</p>
                        <button className="to-empty-add-btn" onClick={handleGoToNewReception}>
                            <span className="to-empty-add-icon-wrap">
                                <PlusCircle size={32} color="#209D80" />
                            </span>
                            <span>Tạo mới khách hàng</span>
                        </button>
                    </div>
                )}
            </div>

            {/* New Customer Modal */}
            {showNewCustomerModal && (
                <>
                    <div className="to-modal-overlay" onClick={() => setShowNewCustomerModal(false)}></div>
                    <div className="to-modal-content">
                        <div className="to-modal-handle"></div>
                        <h2 className="to-modal-title">Tạo mới khách hàng</h2>

                        <div className="to-modal-form">
                            <div className="to-modal-field">
                                <label className="to-modal-label">Khách hàng <span className="to-modal-req">*</span></label>
                                <input
                                    type="text"
                                    className="to-modal-input"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                />
                            </div>

                            <div className="to-modal-field">
                                <label className="to-modal-label">Số điện thoại <span className="to-modal-req">*</span></label>
                                <input
                                    type="text"
                                    className="to-modal-input"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                />
                            </div>

                            {/* <div className="to-modal-field-row">
                                <div className="to-modal-field to-modal-field-half">
                                    <label className="to-modal-label">Thú cưng <span className="to-modal-req">*</span></label>
                                    <input
                                        type="text"
                                        className="to-modal-input"
                                        value={newCustomer.petName}
                                        onChange={(e) => setNewCustomer({...newCustomer, petName: e.target.value})}
                                    />
                                </div>
                                <div className="to-modal-field to-modal-field-half">
                                    <label className="to-modal-label">Loài <span className="to-modal-req">*</span></label>
                                    <div className="to-modal-select-wrapper">
                                        <select
                                            className="to-modal-select"
                                            value={newCustomer.species}
                                            onChange={(e) => setNewCustomer({...newCustomer, species: e.target.value})}
                                        >
                                            <option value="" disabled></option>
                                            <option value="cho">Chó</option>
                                            <option value="meo">Mèo</option>
                                            <option value="khac">Khác</option>
                                        </select>
                                        <ChevronDown size={18} color="#888" className="to-modal-select-icon" />
                                    </div>
                                </div>
                            </div> */}

                            {/* <div className="to-modal-field">
                                <label className="to-modal-label">Giống <span className="to-modal-req">*</span></label>
                                <div className="to-modal-select-wrapper">
                                    <select
                                        className="to-modal-select"
                                        value={newCustomer.breed}
                                        onChange={(e) => setNewCustomer({...newCustomer, breed: e.target.value})}
                                    >
                                        <option value="" disabled></option>
                                        <option value="poodle">Poodle</option>
                                        <option value="corgi">Corgi</option>
                                        <option value="husky">Husky</option>
                                        <option value="golden">Golden Retriever</option>
                                    </select>
                                    <ChevronDown size={18} color="#888" className="to-modal-select-icon" />
                                </div>
                            </div> */}

                            {/* <div className="to-modal-field">
                                <label className="to-modal-label">Ngày hẹn</label>
                                <div className="to-modal-input-icon-wrapper">
                                    <input
                                        type="text"
                                        className="to-modal-input"
                                        value={newCustomer.appointmentDate}
                                        onChange={(e) => setNewCustomer({...newCustomer, appointmentDate: e.target.value})}
                                    />
                                    <Calendar size={20} color="#888" className="to-modal-input-icon" />
                                </div>
                            </div> */}
                        </div>

                        <div className="to-modal-actions">
                            <button className="to-modal-btn-cancel" onClick={() => setShowNewCustomerModal(false)}>Hủy bỏ</button>
                            <button className="to-modal-btn-submit" onClick={handleCreateCustomer}>Tạo mới</button>
                        </div>
                    </div>
                </>
            )}
        </ReceptionistLayout>
    );
};

export default TodayOrders;

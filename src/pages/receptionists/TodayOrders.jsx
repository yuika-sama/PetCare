import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, UserRound, PlusCircle, Calendar } from 'lucide-react';
import ReceptionistLayout from '../../layouts/ReceptionistLayout';
import ReceptionCard from '../../components/receptionist/ReceptionCard';
import ReceivedCard from '../../components/receptionist/ReceivedCard';
import './TodayOrders.css';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Sample badge data (date -> count)
const BADGE_DATA = { 7: 7, 8: 12, 10: 22, 11: 4 };

const TodayOrders = () => {
    const [activeStatus, setActiveStatus] = useState('cho');
    const [calendarExpanded, setCalendarExpanded] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '', phone: '', petName: '', species: '', breed: '', appointmentDate: ''
    });

    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState(today.getDate());

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

    const statusTabs = [
        { key: 'cho', label: 'Chờ tiếp đón', count: 3 },
        { key: 'da', label: 'Đã tiếp đón', count: 10 },
        { key: 'huy', label: 'Đã hủy', count: 16 },
        { key: 'hoanthanh', label: 'Hoàn thành', count: 16 },
        { key: 'all', label: 'Tất cả', count: 16 },
    ];

    // const customers = [
    //     {
    //         id: 1,
    //         name: 'Nguyễn Anh Đức',
    //         phone: '0912345678',
    //         avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=NAD'
    //     },
    //     {
    //         id: 2,
    //         name: 'Lê Huyền Linh',
    //         phone: '0816278274',
    //         avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=LHL'
    //     },
    //     {
    //         id: 3,
    //         name: 'Trần Minh Hạnh',
    //         phone: '0902627274',
    //         avatar: 'https://placehold.co/80x80/e0f2ef/209D80?text=TMH'
    //     },
    // ];
    const customers = []

    const receivedOrders = [
        {
            id: 1,
            customerName: 'Nguyễn Anh Đức',
            phone: '0912345678',
            ticketId: '2141441',
            status: 'Đã tiếp đón',
            createdAt: 'Tạo đơn lúc 10:03 - 20/03/2026',
            pets: [
                { name: 'Kuro', breed: 'Chó Poodle', gender: 'male', age: '3 Tuổi', weight: '4.5kg' },
            ],
            sourceOrder: '2141441',
            paymentEnabled: true,
        },
        {
            id: 2,
            customerName: 'Nguyễn Duy Ngọc',
            phone: '0908264671',
            ticketId: '2141441',
            status: 'Đã tiếp đón',
            createdAt: 'Tiếp đón lúc 10:03 - 20/03/2026',
            pets: [
                { name: 'Kuro', breed: 'Chó Poodle', gender: 'male', age: '3 Tuổi', weight: '4.5kg' },
                { name: 'Mike', breed: 'Mèo Anh lông ngắn', gender: 'male', age: '2 Tuổi', weight: '2.5kg' },
            ],
            sourceOrder: null,
            paymentEnabled: false,
        },
    ];

    return (
        <ReceptionistLayout>
            <div className="today-orders-page">
                {/* Header */}
                <div className="to-header">
                    <h1 className="to-page-title">Đơn hôm nay</h1>
                    <div className="to-header-avatar">
                        <img src="https://placehold.co/40x40/e0f2ef/209D80?text=Dr" alt="avatar" />
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
                                            {BADGE_DATA[date] && (
                                                <span className="to-day-badge">{BADGE_DATA[date]}</span>
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
                                            {BADGE_DATA[date] && (
                                                <span className="to-day-badge">{BADGE_DATA[date]}</span>
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
                <div className="to-stats-row">
                    <div className="to-stat-card">
                        <span className="to-stat-label">Đã tiếp đón</span>
                        <span className="to-stat-value">11</span>
                    </div>
                    <div className="to-stat-card">
                        <span className="to-stat-label">Đang thực hiện</span>
                        <span className="to-stat-value">11</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="to-search-container">
                    <div className="to-search-box">
                        <Search size={20} color="#209D80" />
                        <input type="text" placeholder="Search" className="to-search-input" />
                    </div>
                    <button className="to-filter-btn">
                        <SlidersHorizontal size={20} color="#209D80" />
                    </button>
                </div>

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
                {activeStatus === 'cho' && (
                    <>
                        {customers.length > 0 ? (
                            <div className="to-customers-list">
                                {customers.map(c => (
                                    <ReceptionCard
                                        key={c.id}
                                        name={c.name}
                                        phone={c.phone}
                                        avatar={c.avatar}
                                        onAdd={() => console.log('Add', c.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="to-empty-state">
                                <div className="to-empty-icon">
                                    <UserRound size={32} color="#a1a1aa" />
                                </div>
                                <p className="to-empty-text">Không tìm thấy khách hàng</p>
                                <button className="to-empty-add-btn" onClick={() => setShowNewCustomerModal(true)}>
                                    <PlusCircle size={18} color="#209D80" />
                                    <span>Tạo mới khách hàng</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeStatus === 'da' && (
                    <div className="to-customers-list">
                        {receivedOrders.map(order => (
                            <ReceivedCard
                                key={order.id}
                                customerName={order.customerName}
                                phone={order.phone}
                                ticketId={order.ticketId}
                                status={order.status}
                                createdAt={order.createdAt}
                                pets={order.pets}
                                sourceOrder={order.sourceOrder}
                                paymentEnabled={order.paymentEnabled}
                                onPayment={() => console.log('Payment', order.id)}
                            />
                        ))}
                    </div>
                )}

                {activeStatus === 'huy' && (
                    <div className="to-empty-state">
                        <div className="to-empty-icon">
                            <UserRound size={32} color="#a1a1aa" />
                        </div>
                        <p className="to-empty-text">Không có đơn hủy</p>
                    </div>
                )}
            </div>

            {/* New Customer Modal */}
            {showNewCustomerModal && (
                <>
                    <div className="to-modal-overlay" onClick={() => setShowNewCustomerModal(false)}></div>
                    <div className="to-modal-content">
                        <div className="to-modal-handle"></div>
                        <h2 className="to-modal-title">Tạo mới khách hàng & thú cưng</h2>

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

                            <div className="to-modal-field-row">
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
                            </div>

                            <div className="to-modal-field">
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
                            </div>

                            <div className="to-modal-field">
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
                            </div>
                        </div>

                        <div className="to-modal-actions">
                            <button className="to-modal-btn-cancel" onClick={() => setShowNewCustomerModal(false)}>Hủy bỏ</button>
                            <button className="to-modal-btn-submit" onClick={() => setShowNewCustomerModal(false)}>Tạo mới</button>
                        </div>
                    </div>
                </>
            )}
        </ReceptionistLayout>
    );
};

export default TodayOrders;

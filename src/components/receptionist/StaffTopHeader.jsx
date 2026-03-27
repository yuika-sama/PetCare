import React from 'react';
import './StaffTopHeader.css';

const StaffTopHeader = ({ title, onBack, rightNode = null, size = 'large' }) => {
    void title;
    void onBack;
    void rightNode;

    return (
        <header className={`staff-top-header ${size === 'normal' ? 'is-normal' : ''}`}>
            {/* <div className="staff-top-header-main"> */}
                {/* <Button
                    type="button"
                    icon
                    className="staff-back-btn"
                    onClick={onBack}
                    aria-label="Quay lại"
                >
                    <ChevronLeft size={24} />
                </Button> */}
                {/* <h1>{title}</h1> */}
            {/* </div> */}
            {/* {rightNode ? <div className="staff-top-header-right">{rightNode}</div> : null} */}
        </header>
    );
};

export default StaffTopHeader;
